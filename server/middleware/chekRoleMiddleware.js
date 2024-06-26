const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1] // Bearer sdfsadf тип токена и сам токен
            if (!token) { // если его несущ
                return res.status(401).json({message: "Не авторизован"})
            }
            const decoded = jwt.verify(token, config.get('secretKey'))
            if (decoded.role !== role) {
                return res.status(403).json({message: "Нет доступа"})
            }
            req.user = decoded
            next()
        }
        catch (e) {
            res.status(401).json({message: "Не авторизован"})
        }
    }
}