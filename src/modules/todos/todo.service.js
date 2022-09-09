const db = require("../../db");
const ErrorService = require("../../services/error.service");

class TodoService {

  async getAll(userId) {
    try {
      const queryResult = await db.query(`SELECT * FROM users WHERE id = '${ userId }';`)
      const candidate = queryResult.rows[0]
      if (!candidate) {
        throw ErrorService.BadRequest('Пользователь не найден')
      }

      const query = `SELECT * FROM todos WHERE userid = ${userId};`
      const queryResponse = await db.query(query)

      return queryResponse.rows
    } catch (e) {
      throw ErrorService.BadRequest('Ошибка при получении списка туду')
    }
  }

  async create(userId, title, isDone) {
    try {
      const queryResult = await db.query(`SELECT * FROM users WHERE id = '${ userId }';`)
      const candidate = queryResult.rows[0]
      if (!candidate) {
        throw ErrorService.BadRequest('Пользователь не найден')
      }

      const query = `INSERT INTO todos (userid, title ,"isDone") values ($1, $2, $3) RETURNING *`
      const queryResponse = await db.query(query,[userId, title ,isDone])

      return queryResponse.rows[0]
    } catch (e) {
      throw ErrorService.BadRequest('Ошибка при создании туду')
    }
  }

  async update(title ,isDone, id) {
    try {
      const query = `UPDATE todos set title = '${title}', "isDone" = ${isDone} where id = '${id}' RETURNING *`
      console.log(query)
      return await db.query(query)
    } catch (e) {
      throw ErrorService.BadRequest('Ошибка при обновлении туду')
    }
  }

  async delete(id) {
    try {
      const query =  `DELETE FROM todos where id = '${id}';`
      console.log(query)
      return await db.query(query)
    } catch (e) {
      throw ErrorService.BadRequest('Ошибка при удалении туду')
    }
  }
}

module.exports = new TodoService()