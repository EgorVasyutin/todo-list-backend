const Router = require('express')
const userController = require('./user.controller')
const authMiddleware = require('../../middlewares/auth.middleware')

const router = new Router()

router.post('/sign-up', userController.singUp)
router.post('/sign-in', authMiddleware, userController.signIn)
router.post('/logout', userController.logout)
router.post('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUser)

module.exports = router

