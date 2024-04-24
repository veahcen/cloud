const fs = require("fs") // для работы с файловой системой
const File = require("../models/File")
const config = require('config')

class FileService {


    // фция созд папки, не физ файл, а объект модели
    createDir(file) {
        // для каждого пользователя созд папка по его id + относительный путь, если в корневой папке, то будет пуст
        const filePath = `${config.get('filePath')}\\${file.user}\\${file.path}`
        return new Promise((resolve, reject) => {
            try {
                // если не существует, то создаем папку
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({message: 'Файл был создан'})
                } else {
                    return reject({message: "Файл уже существует"})
                }
            } catch (e) {
                return reject({message: 'Ошибка файла'})
            }
        })
    }

    deleteFolderRecursive(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach((file) => {
                const curPath = path + '/' + file;
                if (fs.lstatSync(curPath).isDirectory()) { // рекурсивно удаляем подпапки
                    this.deleteFolderRecursive(curPath);
                } else { // удаляем файл
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path); // удаляем саму папку

        }
    }

    deleteFile(file) {
        const path = this.getPath(file)
        if (file.type === 'dir') {
            this.deleteFolderRecursive(path)
        } else {
            fs.unlinkSync(path)
        }
    }


    getPath(file) {
        return config.get('filePath') + '\\' + file.user + '\\' + file.path
    }

}

module.exports = new FileService()