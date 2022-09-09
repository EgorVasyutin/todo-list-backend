const Router = require('express')
const userController = require('./user.controller')

const router = new Router()

router.post('/sign-up', userController.singUp)
router.post('/sign-in', userController.signIn)
router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)

module.exports = router

