const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const config = require("config")
const jwt = require('jsonwebtoken')
const {check, validationResult} = require("express-validator")
const User = require("../models/User")

const generateJwtToken = (id, email, diskSpace, usedSpace, role) => {
    return jwt.sign(
        {id, email, diskSpace, usedSpace, role},
        config.get("secretKey"),
        {expiresIn: '12h'}
    )
}

class UserController {
    async registration(req, res, next) {
        check('email', "Некоректный email").isEmail()
        check('password', 'Пароль должен быть больше 3').isLength({min:3})

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(ApiError.badRequest('Невалидный email или password меньше 3х символов'))
        }

        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }

        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 6)
        const user = await new User.create({email, password: hashPassword, role})
        // await user.save()

        const token = generateJwtToken(user.id, user.email, user.diskSpace, user.usedSpace, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.notFound('Пользователь не найден'))
        }

        const passwordValid = bcrypt.compareSync(password, user.password)
        if (!passwordValid) {
            return next(ApiError.badRequest('Пароль не верный'))
        }

        const token = generateJwtToken(user.id, user.email, user.diskSpace, user.usedSpace, user.role)
        return res.json({token})
    }

    async auth(req, res, next) {
        const token = generateJwtToken(req.user.id, req.user.email, req.user.diskSpace, req.user.usedSpace, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()