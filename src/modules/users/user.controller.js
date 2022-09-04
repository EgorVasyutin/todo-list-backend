const  db = require('../../db')
const bcrypt = require('bcrypt')
const userService = require('./user.service')
const ErrorService = require('../../services/error.service')

class UserController {
    async singUp(req, res, next) {
      try {
        const {email, password, username} = req.body
        console.log(email, password, username)
        const userData = await userService.signUp(email, password, username)
        res.cookie('refreshToken', userData.refreshToken, { 
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000
        })

        return  res.json(userData)
      } catch (e) {
        next(e)
      }
    }

    async signIn(req, res, next) {
      try {
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
      } catch (e) {
        next(e)
      }
    }

    async logout(req, res, next) {
      try {

      } catch (e) {
        next(e)
      }
    }

    async refresh(req, res, next) {
      try {

      } catch (e) {
        next(e)
      }
    }

    async getUser(req, res, next){
      try {
        const user = await db.query(`SELECT * FROM users WHERE `)

        res.json(user.rows[0])
      } catch (e) {
        next(e)
      }
    }
}

module.exports = new UserController()