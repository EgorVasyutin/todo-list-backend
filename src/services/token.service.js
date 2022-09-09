const db = require("../db");

const jwt = require("jsonwebtoken");
const ErrorService = require("./error.service");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})

    return {
      accessToken,
      refreshToken
    }
  }

  async saveRefreshToken(userId, refreshToken) {
    console.log('saveRefreshToken',userId, refreshToken)
      //`SELECT * FROM user_token WHERE "userId" = '${ userId }';`
    // найти в таблице юзер_токен запись по юзер_айди
    const query = `SELECT * FROM user_token WHERE "userId" = '${ userId }';`
    console.log('query', query)
    const queryResult = await db.query(query)
    console.log('queryResult',queryResult)
    const userTokenRow = queryResult.rows[0]
    console.log(1, userTokenRow)

    // если запись есть то мы обновляем рефреш токен,
    if (userTokenRow) {
      console.log('userTokenRow')
      try {
         const query = `UPDATE user_token set "refreshToken" = ${refreshToken} where "userId" = '${userId}' RETURNING *`

         const queryResult = await db.query(query)
         console.log('refresh token updated', queryResult)

         return queryResult.rows[0]
      }
      catch (e) {
        throw ErrorService.BadRequest('Ошибка при сохранении refreshToken')
      }
    }

    // если нет то создаем запись с изер айди и рефреш токеном
    try {
      console.log('try')
      const createQueryResult = await db.query(`INSERT INTO user_token ("userId", "refreshToken") values ($1, $2) RETURNING *`,[userId, refreshToken])
      console.log('createQueryResult', createQueryResult)
      return createQueryResult.rows[0]
    }catch (e) {
      throw ErrorService.BadRequest('Ошибка при сохранении рефреш токена')
    }
  }

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return null;
    }
  }

  async removeToken(refreshToken) {
    console.log("refreshToken", refreshToken)
    const queryResult = await db.query(`DELETE FROM user_token where "refreshToken" = (E'${refreshToken}');`)
    const tokenData = queryResult.rows[0]
    console.log(tokenData, queryResult)
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await db.query(`SELECT * FROM user_token WHERE "refreshToken" = (E'${refreshToken}'`)
    return tokenData
  }
}

module.exports = new TokenService()
