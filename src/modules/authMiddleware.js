const {secret} = require('./config.js')
const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if(req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]

        console.log(123,token)

        if (!token) {
            return res.status(403).json({message: "Пользователь не авторизован 1"})
        }
        req.user = jwt.verify(token, secret)


        next()
    } catch (e) {
        console.error(e)
        return res.status(403).json({message: "Пользователь не авторизован 2"})
    }
}