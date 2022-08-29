const userController = require('./user.controller')
const Router = require('express')
const authMiddleware = require('../authMiddleware')

const router = new Router()

router.post('/sign-up', userController.singUp)
router.post('/sign-in', authMiddleware, userController.signIn)
router.get('/users', authMiddleware, userController.getUser)

module.exports = router