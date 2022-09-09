const todoController = require('./todo.controller')
const Router = require('express')
const authMiddleware = require('../../middlewares/auth.middleware')

const router = new Router()

router.post('/', authMiddleware, todoController.createTodo)
router.get('/', authMiddleware, todoController.getTodos)
router.put('/:id', authMiddleware, todoController.updateTodo)
router.delete('/:id', authMiddleware, todoController.deleteTodo)

module.exports = router

