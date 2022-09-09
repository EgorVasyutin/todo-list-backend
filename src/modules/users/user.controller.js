const  db = require('../../db')
const bcrypt = require('bcrypt')
const userService = require('./user.service')
const ErrorService = require('../../services/error.service')

class UserController {
    async singUp(req, res, next) {
      try {
        const {email, password, username} = req.body
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
        const userData = await userService.signIn(email, password)
        res.cookie('refreshToken', userData.refreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000
        })

        return  res.json(userData)
      } catch (e) {
        next(e)
      }
    }

    async logout(req, res, next) {
      try {
        const {refreshToken} = req.cookies;
        const token = await userService.logout(refreshToken)
        res.clearCookie('refreshToken')
        return res.json(token)
      } catch (e) {
        next(e)
      }
    }

    async refresh(req, res, next) {
      try {
        const {refreshToken} = req.cookies;
        console.log(refreshToken)
        const token = await userService.refresh(refreshToken)
        res.clearCookie('refreshToken')
        return res.json(token)
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