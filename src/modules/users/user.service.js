const db = require("../../db")
const bcrypt = require("bcrypt")
const tokenService = require('../../services/token.service')
const ErrorService = require('../../services/error.service')

class UserService {
  async signUp(email, password, username) {
    const queryResult = await db.query(`SELECT * FROM users WHERE email = '${ email }';`)
    const isEmailExists = queryResult.rows[0]

    if (isEmailExists) {
      console.log('Почта')
     throw ErrorService.BadRequest('Почта занята')
    }

    const hash = bcrypt.hashSync(password, 7);
    const dbResponse = await db.query(`INSERT INTO users (email, password, username) values ($1, $2, $3) RETURNING *`,[email, hash, username])
    const newUser = dbResponse.rows[0]

    const tokens = tokenService.generateTokens(newUser)
    await tokenService.saveRefreshToken(newUser.id, tokens.refreshToken)

    return { ...tokens, user: newUser }
  }
}

module.exports = new UserService()
