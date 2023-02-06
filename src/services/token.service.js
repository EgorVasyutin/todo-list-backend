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


    // Hайти в таблице юзер_токен запись по юзер_айди
    const query = `SELECT * FROM user_token WHERE "userId" = '${ userId }';`
    const queryResult = await db.query(query)
    const userTokenRow = queryResult.rows[0]

    // если запись есть то мы обновляем рефреш токен,
    if (userTokenRow) {


      try {
        const query = `UPDATE user_token set "refreshToken" = '${refreshToken}' where "userId" = '${userTokenRow.userId}' RETURNING *;`

        const queryResult = await db.query(query)
        return queryResult.rows[0]
}
      catch (e) {
        throw ErrorService.BadRequest('Ошибка при обновлении refreshToken')
      }
    }

    // Если нет - создаем запись с userId и refreshToken
    try {
      const query = `INSERT INTO user_token ("userId", "refreshToken") values ($1, $2) RETURNING *`
      const createQueryResult = await db.query(query,[userId, refreshToken])
      return createQueryResult.rows[0]
    } catch (e) {
      throw ErrorService.BadRequest('Ошибка при сохранении refreshToken')
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

    const query = `DELETE FROM user_token where "refreshToken" = (E'${refreshToken}');`
    const queryResult = await db.query(query)
    const tokenData = queryResult.rows[0]

    return tokenData;
  }

  async findToken(refreshToken) {
    try {
      const query = `SELECT * FROM user_token WHERE "refreshToken" = (E'${refreshToken}')`
      const queryResult = await db.query(query)
      const tokenData = queryResult.rows[0]

      return tokenData
    } catch (e) {
      throw ErrorService.BadRequest('Ошибка при поиске user_token row по refresh-токену')
    }
  }
}

module.exports = new TokenService()
