const db = require("../../db")
const bcrypt = require("bcrypt")
const tokenService = require('../../services/token.service')
const ErrorService = require('../../services/error.service')

class UserService {
  async signUp(email, password, username) {
    const queryResult = await db.query(`SELECT * FROM users WHERE email = '${ email }';`)
    const isEmailExists = queryResult.rows[0]

    if (isEmailExists) {
     throw ErrorService.BadRequest('Почта занята')
    }

    try {
      const hash = bcrypt.hashSync(password, 7);
      const query = `INSERT INTO users (email, password, username) values ('${email}', '${hash}', '${username}') RETURNING *;`
      const dbResponse = await db.query(query)

      const newUser = dbResponse.rows[0]

      const tokens = tokenService.generateTokens(newUser)
      await tokenService.saveRefreshToken(newUser.id, tokens.refreshToken)

      return {user: newUser }

    } catch (e) {
      throw ErrorService.BadRequest('Ошибка при создании пользователя')
    }
  }

  async signIn(email, password) {
    const queryResult = await db.query(`SELECT * FROM users WHERE email = '${ email }';`)
    const candidate = queryResult.rows[0]
    if (!candidate) {
      throw ErrorService.BadRequest('Пользователь не найден')
    }

    const passwordsEqual = bcrypt.compareSync(password, candidate.password)
    if (!passwordsEqual) {
      throw ErrorService.BadRequest('Неверный пароль')
    }

    const tokens = tokenService.generateTokens(candidate)
    await tokenService.saveRefreshToken(candidate.id, tokens.refreshToken)

    return {user: candidate }
  }

  async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ErrorService.UnauthorizedError()
    }

    const userData = tokenService.validateRefreshToken(refreshToken)
    const userTokenData = await tokenService.findToken(refreshToken)
    if (!userData && !userTokenData) {
      throw ErrorService.UnauthorizedError()
    }

    const queryUserById = `SELECT * FROM users WHERE id = '${userData.id}';`
    const queryResult = await db.query(queryUserById)
    const candidate = queryResult.rows[0]

    const tokens = tokenService.generateTokens(candidate)
    await tokenService.saveRefreshToken(candidate.id, tokens.refreshToken)

    return { ...tokens, user: candidate }

  }
}

module.exports = new UserService()
