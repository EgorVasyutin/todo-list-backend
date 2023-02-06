const  db = require('../../db')
const userService = require('./user.service')

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
      const tokens = await userService.refresh(refreshToken)
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
      })

      return res.json(tokens)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()
