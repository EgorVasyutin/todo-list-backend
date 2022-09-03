const db = require("../../db");

const jwt = require("jsonwebtoken");

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
    // найти в таблице юзер_токен запись по юзер_айди
    const userToken = await db.query(`SELECT * FROM user_token WHERE "userId" = '${ userId }';`)
    // если запись есть то мы обновляем рефреш токен,
    if (userToken) {
      const query = `UPDATE user_token set "refreshToken" = ${refreshToken} where "userId" = ${userId} RETURNING *`

      db.query(query)
        .then((result) => {
          return result.rows[0]
        })
        .catch(() => {
          return 'Ошибка при сохранении refreshToken'
        })
    }
    // если нет то создаем запись с изер айди и рефреш токеном
    const newUserToken = await db.query(`INSERT INTO user_token ("userId", "refreshToken") values ($1, $2) RETURNING *`,[userId, refreshToken])

    return newUserToken.rows[0]

  }
}

module.exports = new TokenService()
