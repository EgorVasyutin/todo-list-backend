const todoController = require('./todo.controller')
const Router = require('express')

const router = new Router()

router.post('/', todoController.createTodo)
router.get('/', todoController.getTodosByUserId)
router.put('/:id', todoController.updateTodo)
router.delete('/:id', todoController.deleteTodo)

module.exports = router

