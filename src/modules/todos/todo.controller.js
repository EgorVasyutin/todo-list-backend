const db = require('../../db')
const todoService = require('./todo.service')
const ErrorService = require('../../services/error.service')

class TodoController {
  async createTodo(req, res, next){
    try {
      const { title ,isDone} = req.body
      const newTodo = todoService.create(req.user.id, title, isDone)

      return res.status(201).json(newTodo)
    } catch (e) {
      next(e)
    }
  }

  async getTodos(req, res, next) {
    try {
      const todos = await todoService.getAll(req.user.id)
      return res.status(200).json(todos)

    } catch (e) {
      next(e)
    }

  }
  // async getOneTodo(req, res){
  //     const id = req.params.id
  //     const todos = await db.query(`SELECT * FROM todo where id = $1`,[id])
  //     res.json(todos.rows[0])
  // }
  async updateTodo(req, res, next) {
    const { title ,isDone} = req.body
    try {
      console.log(title ,isDone, req.params.id)
      const todos = await todoService.update(title ,isDone, req.params.id)

      return res.status(200).json(todos)
    } catch (e) {
      next(e)
    }
  }

  async deleteTodo(req, res, next){
    try {
      const todos = await todoService.delete(req.params.id)

      return res.status(200).json(todos)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new TodoController()
