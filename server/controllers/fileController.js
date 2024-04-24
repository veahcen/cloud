const fileService = require('../services/fileService')
const config = require('config')
const fs = require('fs')
const User = require('../models/User')
const File = require('../models/File')
const ApiError = require("../error/ApiError");
const Uuid = require('uuid')
const archiver = require('archiver')

// async function downloadFolder(folderId, parentPath) {
//     const folder = await File.findById(folderId);
//     const folderPath = fileService.getPath(folder) + 'a';
//     // Создаем папку на сервере для скачиваемой папки
//     fs.mkdirSync(folderPath);
//
//     // Получаем все файлы в папке
//     const files = await File.find({ parent: folder._id });
//     // Скачиваем каждый файл
//     for (const file of files) {
//         const filePath = path.join(folderPath, file.name);
//         // Скачиваем файл
//         fs.writeFileSync(filePath, file.data);
//     }
//
//     // Рекурсивно обрабатываем вложенные папки
//     const subFolders = await File.find({ parent: folder._id });
//     for (const subFolder of subFolders) {
//         await downloadFolder(subFolder._id, folderPath);
//     }
//
//     return folderPath; // Возвращаем путь к скачанной папке
// }

async function deleteChildren(parentId) {
    // Находим все дочерние элементы у файла с указанным parentId
    const children = await File.find({ parent: parentId });

    // Перебираем каждый дочерний элемент
    for (const child of children) {
        // Если у дочернего элемента есть дочерние элементы, рекурсивно удаляем их
        if (child.type === 'dir') {
            await deleteChildren(child._id);
        }
        // Удаляем сам дочерний элемент из базы данных
        await File.deleteOne({ _id: child._id });
    }
}

async function deleteFileAndChildren(fileId) {
    // Удаляем дочерние элементы файла из базы данных
    await deleteChildren(fileId);

    // Удаляем сам файл из базы данных
    await File.deleteOne({ _id: fileId });
}

async function updateParentFolderSize(parentId, fileSize) {
    let parentFolder = await File.findById(parentId);
    if (!parentFolder) return;

    parentFolder.size += fileSize;
    await parentFolder.save();

    // Рекурсивно обновляем родительские папки
    if (parentFolder.parent) {
        await updateParentFolderSize(parentFolder.parent, fileSize);
    }
}

async function updateDeleteParentFolderSize(parentId, fileSize) {
    let parentFolder = await File.findById(parentId);
    if (!parentFolder) return;

    parentFolder.size -= fileSize;
    await parentFolder.save();

    // Рекурсивно обновляем родительские папки
    if (parentFolder.parent) {
        await updateDeleteParentFolderSize(parentFolder.parent, fileSize);
    }
}

class FileController {
    async createDir(req, res) {
        try {
            const {name, type, parent} = req.body
            const file = new File({name, type, parent, user: req.user.id})
            const parentFile = await File.findOne({_id: parent})
            // если родительский файл не найден, то добавляем в корневую директорию
            if(!parentFile) {
                file.path = name
                await fileService.createDir(file)
            } else {
                file.path = `${parentFile.path}\\${file.name}`
                await fileService.createDir(file)
                parentFile.childs.push(file._id)
                await parentFile.save()
            }
            await file.save()
            return res.json(file)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async getFiles(req, res, next) {
        try {
            //искать файлы по id пользователя из токена и родит папк из стр запроса
            const {sort} = req.query
            let files
            switch (sort) {
                case 'name':
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({name:1})
                    break
                case 'type':
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({type:1})
                    break
                case 'date':
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({date:1})
                    break
                default:
                    files = await File.find({user: req.user.id, parent: req.query.parent})
                    break;
            }
            return res.json(files)
        } catch (e) {
            console.log(e)
            return next(ApiError.internal('Файлы не найдены'));
        }
    }

    async  uploadFile(req, res, next) {
        try {
            const file = req.files.file

            const parent = await File.findOne({user: req.user.id, _id: req.body.parent})
            const user = await User.findOne({_id: req.user.id})

            if (user.usedSpace + file.size > user.diskSpace) {
                return next(ApiError.badRequest({message: 'Нет места на диске'}))
            }
            user.usedSpace = user.usedSpace + file.size

            let path;
            if (parent) {
                path = `${config.get('filePath')}\\${user._id}\\${parent.path}\\${file.name}`
                await updateParentFolderSize(parent._id, file.size)
                await parent.save()
            } else {
                path = `${config.get('filePath')}\\${user._id}\\${file.name}`
            }

            if (fs.existsSync(path)) {
                return next(ApiError.badRequest({message: 'Такой файл уже есть'}))
            }
            file.mv(path)

            const type = file.name.split('.').pop()
            let filePath = file.name
            if (parent) {
                filePath = parent.path + "\\" + file.name
            }

            const dbFile = new File({
                name: file.name,
                type,
                accessLink: path,
                size: file.size,
                path: filePath,
                parent: parent?._id,
                user: user._id
            });


            await Promise.all([dbFile.save(), user.save()])

            res.json({dbFile, usedSpace: user.usedSpace})
        } catch (e) {
            console.log(e)
            return next(ApiError.internal({message: 'Ошибка загрузки'}))
        }
    }

    async downloadFile(req, res, next) {
        try {
            const file = await File.findOne({_id: req.query.id, user: req.user.id})
            const path = fileService.getPath(file)
            if (fs.existsSync(path)) {
                return res.download(path, file.name)
            }
            return next(ApiError.badRequest({message: "Ошибка загрузки"}))
        } catch (e) {
            console.log(e)
            return next(ApiError.internal({message: "Ошибка загрузки"}))
        }
    }

    // async downloadFile(req, res, next) {
    //     try {
    //         const file = await File.findOne({_id: req.query.id, user: req.user.id});
    //         const path = fileService.getPath(file);
    //         if (file.type === 'dir') {
    //             const folderPath = await downloadFolder(file._id, '/tmp'); // Начинаем скачивание с /tmp
    //             const archive = archiver('zip');
    //             archive.directory(folderPath, 'downloaded_folder');
    //             archive.pipe(res);
    //             archive.finalize();
    //         } else {
    //             if (fs.existsSync(path)) {
    //                 return res.download(path, file.name);
    //             }
    //         }
    //         return next(ApiError.badRequest({message: "Ошибка загрузки"}));
    //     } catch (e) {
    //         console.log(e);
    //         return next(ApiError.internal({message: "Ошибка загрузки"}));
    //     }
    // }


    async downloadFileByLink(req, res, next) {
        try {
            const file = await File.findById({_id: req.query.id});
            if (!file) {
                return next(ApiError.notFound('Файл не найден'));
            }

            const path = fileService.getPath(file);
            if (fs.existsSync(path)) {
                return res.download(path, file.name);
            }

            return next(ApiError.badRequest({ message: "Ошибка загрузки" }));
        } catch (e) {
            console.log(e);
            return next(ApiError.internal({ message: "Ошибка загрузки" }));
        }
    }

    async deleteFile(req, res, next) {
        try {
            const file = await File.findOne({_id: req.query.id, user: req.user.id})
            const parent = await File.findOne({user: req.user.id, _id: file.parent})
            const user = await User.findOne({_id: req.user.id})
            if (!file) {
                return next(ApiError.badRequest({message: "Файл не найден"}))
            }

            user.usedSpace = user.usedSpace - file.size
            if (parent) {
                await updateDeleteParentFolderSize(parent._id, file.size)
            }
            fileService.deleteFile(file)

            await deleteFileAndChildren(file._id);


            await user.save()
            return res.json({message: "Файл был удален", usedSpace: user.usedSpace})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest({message: "Ошибка удаления файла"}))
        }
    }

    async searchFile(req, res, next) {
        try {
            const searchName = req.query.search
            let files = await File.find({user: req.user.id})
            files = files.filter(file => file.name.includes(searchName))
            return res.json(files)
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest({message: "Ошибка поиска"}))
        }
    }



    async uploadAvatar(req, res, next) {
        try {
            const file = req.files.file
            const user = await User.findById(req.user.id)
            user.usedSpace = user.usedSpace + file.size
            const avatarName = Uuid.v4() + ".jpg"
            file.mv(config.get('staticPath') + "\\" + avatarName)
            user.avatar = avatarName
            await user.save()
            return res.json(user)
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest({message: "Ошибка загрузки аватарки"}))
        }
    }

    async deleteAvatar(req, res, next) {
        try {
            const user = await User.findById(req.user.id)
            user.usedSpace = user.usedSpace - user.avatar.size
            fs.unlinkSync(config.get('staticPath') + "\\" + user.avatar)
            user.avatar = null
            await user.save()
            return res.json(user)
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest({message: "Ошибка удаления аватарки"}))
        }
    }

}

module.exports = new FileController()