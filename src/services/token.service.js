const db = require("../db");

const jwt = require("jsonwebtoken");
const {query} = require("express");

class TokenService {
  generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})

    return {
      accessToken,
      refreshToken
    }
  }

  saveRefreshToken = async (userId, refreshToken) => {
    console.log('saveRefreshToken',userId, refreshToken)
    // найти в таблице юзер_токен запись по юзер_айди
    const queryResult = await db.query(`SELECT * FROM user_token WHERE "userId" = '${ userId }';`)
    const userToken = queryResult.rows[0]
    console.log(1, userToken)
    // если запись есть то мы обновляем рефреш токен,
    if (userToken) {
      const query = `UPDATE user_token set "refreshToken" = ${refreshToken} where "userId" = ${userId} RETURNING *`

      db.query(query)
        .then((result) => {
          console.log(2, result)
          return result.rows[0]
        })
        .catch(() => {
          return 'Ошибка при сохранении refreshToken'
        })
    }
    // если нет то создаем запись с изер айди и рефреш токеном
    try {
      const createQueryResult = await db.query(`INSERT INTO user_token ("userId", "refreshToken") values ($1, $2) RETURNING *`,[userId, refreshToken])
      return createQueryResult.rows[0]
    }catch (e) {
      console.log(e)
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
    const queryResult = await db.query(`DELETE FROM user_token where "refreshToken" = ${refreshToken};`)
    const tokenData = queryResult.rows[0]
    console.log(tokenData, queryResult)
    return tokenData;
  }
}

module.exports = new TokenService()
