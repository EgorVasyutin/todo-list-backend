const ErrorService = require('../services/error.service')
const tokenService = require('../services/token.service')

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next()
  }

  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      return next(ErrorService.UnauthorizedError())
    }
    const accessToken = authorizationHeader.split(' ')[1]

    if (!accessToken) {
      return next(ErrorService.UnauthorizedError())
    }

    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) {
      return next(ErrorService.UnauthorizedError())
    }

    req.user = userData

    next()
  } catch (e) {
    return res.status(403).json({message: "Пользователь не авторизован"})
  }
}
