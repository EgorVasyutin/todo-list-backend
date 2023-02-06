const db = require("../../db");
const ErrorService = require("../../services/error.service");

class TodoService {

  async getAll() {
    try {
      // const queryResult = await db.query(`SELECT * FROM users WHERE id = '${ userId }';`)
      // const candidate = queryResult.rows[0]
      // if (!candidate) {
      //   throw ErrorService.BadRequest('Пользователь не найден')
      // }

      const query = `SELECT * FROM cards`
      const queryResponse = await db.query(query)
      
      return queryResponse.rows
    } catch (e) {
      throw ErrorService.BadRequest('Ошибка при получении списка задачи')
    }
  }

  async getOne(id) {
    try {
      // const queryResult = await db.query(`SELECT * FROM users WHERE id = '${ userId }';`)
      // const candidate = queryResult.rows[0]
      // if (!candidate) {
      //   throw ErrorService.BadRequest('Пользователь не найден')
      // }

      const query = `SELECT * FROM cards where id = '${id}'`
      const queryResponse = await db.query(query)

      return queryResponse.rows
    } catch (e) {
      throw ErrorService.BadRequest('Ошибка при получении задачи')
    }
  }

  async create(title, isDone, priority, status, type, startDate, endDate) {
    try {
      // const queryResult = await db.query(`SELECT * FROM users WHERE id = '${ userId }';`)
      // const candidate = queryResult.rows[0]
      // if (!candidate) {
      //   throw ErrorService.BadRequest('Пользователь не найден')
      // }
      const query = `INSERT INTO cards (title ,"isDone", priority, status, type, "startDate", "endDate") values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`
      const queryResponse = await db.query(query,[title ,isDone, priority, status, type, startDate, endDate])

      return queryResponse.rows[0]
    } catch (e) {
      throw ErrorService.BadRequest('Ошибка при создании задачи')
    }
  }

  async update(title, isDone, priority, type, startDate, endDate, id) {
    try {
      const query = `UPDATE cards set title = '${title}', "isDone" = ${isDone}, priority ='${priority}', type = '${type}', "startDate" = '${startDate}', "endDate" = '${endDate}' where id = '${id}' RETURNING *`

      return await db.query(query)
    } catch (e) {
      throw ErrorService.BadRequest('Ошибка при обновлении задачи')
    }
  }

  async delete(id) {
    try {
      const query =  `DELETE FROM cards where id = '${id}';`

      return await db.query(query)
    } catch (e) {
      throw ErrorService.BadRequest('Ошибка при удалении задачи')
    }
  }

  async patch(body, id) {
    const field = Object.keys(body)

  try {
      let query

      if (field[0] === 'isDone') {
        const isDone = body.isDone
        query = `UPDATE cards set "isDone" = ${isDone} where id = '${id}' RETURNING *`
      }
      if (field[0] === 'title') {
        const isDone = body.title
        query = `UPDATE cards set title = '${title}' where id = '${id}' RETURNING *`
      }
      if (field[0] === 'priority') {
        const priority = body.priority
        query = `UPDATE cards set priority = '${priority}' where id = '${id}' RETURNING *`
      }
      if (field[0] === 'type') {
        const type = body.type
        query = `UPDATE cards set type = '${type}' where id = '${id}' RETURNING *`
      }
      if (field[0] === 'startDate') {
        const startDate = body.startDate
        query = `UPDATE cards set "startDate" = '${startDate}' where id = '${id}' RETURNING *`
        console.log(query)
      }
      if (field[0] === 'endDate') {
        const endDate = body.endDate
        query = `UPDATE cards set "endDate" = '${endDate}' where id = '${id}' RETURNING *`
      }

      return await db.query(query)
    } catch (e) {
      throw ErrorService.BadRequest('Ошибка при обновлении задачи')
    }
  }
}

module.exports = new TodoService()