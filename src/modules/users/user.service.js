const db = require("../../db")
const bcrypt = require("bcrypt")
const tokenService = require('./token.service')

class UserService {
  async signUp(email, password, username) {
    const isEmailExists = await db.query(`SELECT * FROM users WHERE email = '${ email }';`)
    if (isEmailExists) {
      return new Error('Почта занята')
    }

    const hash = bcrypt.hash(password, 7);
    const dbResponse = await db.query(`INSERT INTO users (email, password, username) values ($1, $2, $3) RETURNING *`,[email, hash, username])
    const newUser = dbResponse.rows[0]

    const tokens = tokenService.generateTokens(newUser)
    await tokenService.saveRefreshToken(newUser.userId, tokens.refreshToken)

    return { ...tokens, user: newUser }
  }

}

module.exports = new UserService()
