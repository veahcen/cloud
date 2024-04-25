const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const config = require("config")
const jwt = require('jsonwebtoken')

const User = require("../models/User")
const fileService = require('../services/fileService')
const File = require('../models/File')

const generateJwtToken = (id, email, diskSpace, usedSpace, role, avatar) => {
    return jwt.sign(
        {id, email, diskSpace, usedSpace, role, avatar},
        config.get("secretKey"),
        {expiresIn: '12h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }

        const users = await User.find({}, 'email');

        if (users.length >= 7) {
            return next(ApiError.forbidden('Количество пользователей в системе ограничено'))
        }

        if (password.length < 3) {
            return next(ApiError.badRequest('Короткий пароль'))
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            // Если вводимое значение не является действительным адресом электронной почты
            return next(ApiError.badRequest('Некорректный email'))
        }

        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const avatar = null
        const hashPassword = await bcrypt.hash(password, 6)
        const user = new User({email, password: hashPassword, role, avatar})
        await user.save()
        await fileService.createDir(new File({user:user.id, name: ''})) // создание папки с id пользователя
        const token = generateJwtToken(user.id, user.email, user.diskSpace, user.usedSpace, user.role, user.avatar)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!user) {
            return next(ApiError.notFound('Пользователь не найден'))
        }

        const passwordValid = bcrypt.compareSync(password, user.password)
        if (!passwordValid) {
            return next(ApiError.badRequest('Пароль не верный'))
        }

        const token = generateJwtToken(user.id, user.email, user.diskSpace, user.usedSpace, user.role, user.avatar)
        return res.json({token})
    }

    async deleteUser(req, res, next) {
        try {
            const {email} = req.body;

            // Проверяем, передан ли email
            if (!email) {
                return next(ApiError.badRequest('Требуется электронная почта'))
            }

            // Находим пользователя по email
            const user = await User.findOne({ email })

            // Проверяем, найден ли пользователь
            if (!user) {
                return next(ApiError.notFound('User не найден'))
            }

            // Находим главную папку пользователя
            const mainFolderPath = `${config.get('filePath')}\\${user._id}`

            // Проверяем, найдена ли главная папка пользователя
            if (!mainFolderPath) {
                return next(ApiError.notFound('Главная папка пользователя не найдена'))
            }

            // Рекурсивно удаляем главную папку и все ее содержимое
            await fileService.deleteFolderRecursive(mainFolderPath)

            // Удаляем пользователя
            await User.deleteOne({ email });

            await File.deleteMany({ user: user._id })

            // Возвращаем успешный ответ
            return res.json({ message: 'User был удален' })
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await User.find({}, 'email'); // Получаем всех пользователей и выбираем только поле email
            return res.json(users);
        } catch (error) {
            return next(error);
        }
    }

    async auth(req, res, next) {
        const token = generateJwtToken(req.user.id, req.user.email, req.user.diskSpace, req.user.usedSpace, req.user.role, req.user.avatar)
        return res.json({token})
    }
}

module.exports = new UserController()