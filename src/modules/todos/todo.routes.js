const todoController = require('./todo.controller')
const Router = require('express')
const authMiddleware = require('../../middlewares/auth.middleware')

const router = new Router()

router.post('/', todoController.createCard)
router.get('/', todoController.getCards)
router.get('/:id', todoController.getOneCard)
router.put('/:id', todoController.updateTodo)
router.delete('/:id', todoController.deleteTodo)
router.patch('/:id', todoController.patch)

module.exports = router

