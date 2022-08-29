const  db = require('../../db')
const jwt = require("jsonwebtoken")
const { secret } = require("../config")
const bcrypt = require('bcrypt')

const generateAccessToken = (id) => {
    return jwt.sign({id}, secret, {expiresIn: "24h"})
}
class TodoController {
    async signIn(req, res) {
        const {email, password} = req.body

        const response = await db.query(`SELECT * FROM users WHERE email = '${ email }';`)
        const candidate = response.rows[0]

        if (!candidate) {
            return res.status(400).json('Пользователь не найден')
        }

        const passwordsEqual = bcrypt.compareSync(password, candidate.password)
        // console.log(password)
        // console.log(candidate.password)
        if (!passwordsEqual) {
            return res.status(400).json('Неверный пароль')
        }

        return res.json(candidate)
    }

    async singUp(req, res) {
        const {email, password, username} = req.body

        if (!await db.query(`SELECT * FROM users WHERE email = '${ email }';`)) {
            return res.status(400).json('Почта занята')
        }
        const hash = bcrypt.hashSync(password, 7);

        const newUser = await db.query(`INSERT INTO users (email, password, username) values ($1, $2, $3) RETURNING *`,[email, hash, username])

        const token = generateAccessToken(req.body.id)
        const user = newUser.rows[0]
        res.json({user, token})
    }

    async getUser(req, res){
        const user = await db.query(`SELECT * FROM users WHERE `)

        res.json(user.rows[0])
    }
}

module.exports = new TodoController()