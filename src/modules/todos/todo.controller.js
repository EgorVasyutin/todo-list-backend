const  db = require('../../db')

class TodoController {
  async createTodo(req, res){
    const userId = req.headers['user-id']
    const { title ,isDone} = req.body
    const query = `INSERT INTO todos (userid, title ,"isDone") values ($1, $2, $3) RETURNING *`

    db.query(query,[userId, title ,isDone])
      .then((result) => {
        return res.status(200).json(result.rows[0])
      })
      .catch(() => {
        return res.status(500).json('Ошибка при создании todo')
      })
  }
  async getTodosByUserId(req, res){
    const userId = req.headers['user-id']
    const query = `SELECT * FROM todos WHERE userid = ${userId};`

    db.query(query)
      .then((result) => {
        return res.status(200).json(result.rows)
      })
      .catch(() => {
        return res.status(500).json('Ошибка при получении todos юзера')
      })
  }
  // async getOneTodo(req, res){
  //     const id = req.params.id
  //     const todos = await db.query(`SELECT * FROM todo where id = $1`,[id])
  //     res.json(todos.rows[0])
  // }
  async updateTodo(req, res){
    const { title ,isDone} = req.body
    const id = req.params.id
    const query = `UPDATE todos set title = ${title}, "isDone" = ${isDone} where id = ${id} RETURNING *`

    db.query(query)
        .then((result) => {
          return res.status(200).json(result.rows[0])
        })
        .catch(() => {
          return res.status(500).json('Ошибка при создании todo')
        })
  }
  async deleteTodo(req, res){
    const userId = req.headers['user-id']
    const id = req.params.id
    const query = `DELETE FROM todos where id = ${id};`

    db.query(query)
        .then((result) => {
          return res.status(200).json(result.rows)
        })
        .catch(() => {
          return res.status(500).json('Ошибка при получении todos юзера')
        })
  }
}

module.exports = new TodoController()
