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
    const dbResponse = await db.query(`INSERT INTO users (email, password, username) values ($1, $2, $3) RETURNING *;`,[email, hash, username])
    const newUser = dbResponse.rows[0]

    const tokens = tokenService.generateTokens(newUser)
    await tokenService.saveRefreshToken(newUser.id, tokens.refreshToken)

    return { ...tokens, user: newUser }
  }

  async signIn(email, password) {
    const queryResult = await db.query(`SELECT * FROM users WHERE email = '${ email }';`)
    const candidate = queryResult.rows[0]

    if (!candidate) {
      throw ErrorService.BadRequest('Пользователь не найден')
    }

    const passwordsEqual = bcrypt.compareSync(password, candidate.password)
    // console.log(password)
    // console.log(candidate.password)
    if (!passwordsEqual) {
      throw ErrorService.BadRequest('Неверный пароль')
    }

    const tokens = tokenService.generateTokens(candidate)
    await tokenService.saveRefreshToken(candidate.id, tokens.refreshToken)

    return { ...tokens, user: candidate }
  }

  async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if(!refreshToken) {
      console.log('no refreshToken')
      throw ErrorService.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const TokenFormDb = tokenService.findToken(refreshToken)
    if(!userData && !TokenFormDb) {
      console.log('no userData && !TokenFormDb')
      throw ErrorService.UnauthorizedError()
    }

    const queryResult = await db.query(`SELECT * FROM users WHERE id = '${userData.id}';`)
    const candidate = queryResult.rows[0]
    console.log('candidate',candidate)

    const tokens = tokenService.generateTokens(candidate)
    console.log('NewTokens',tokens)
    // const ress = `SELECT * FROM user_token WHERE "userId" = '${ candidate.id }'`
    // console.log('ress',ress)
    // const queryResult2 = await db.query(ress)
    // console.log('queryResultTest',queryResult2)

    await tokenService.saveRefreshToken(candidate.id, tokens.refreshToken)
    console.log('await')

    return { ...tokens, user: candidate }

  }
}

module.exports = new UserService()
