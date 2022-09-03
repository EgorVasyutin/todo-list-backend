const  db = require('../../db')
const bcrypt = require('bcrypt')
const userService = require('./user.service')

class UserController {
    async singUp(req, res, next) {
      try{
        const {email, password, username} = req.body
        const userData = await userService.signUp(email, password, username)
        res.cookie('refreshToken', userData.refreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000
        })
        
        return  res.json(userData)
      }catch (e) {
        next()
      }
    }

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

    async logout(req, res) {

    }

    async refresh(req, res) {

    }

    async getUser(req, res){
        const user = await db.query(`SELECT * FROM users WHERE `)

        res.json(user.rows[0])
    }
}

module.exports = new UserController()