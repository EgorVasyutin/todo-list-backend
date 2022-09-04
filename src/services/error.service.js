class ErrorService extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ErrorService(401, 'Пользователь не авторизован')
  }

  static BadRequest(message, errors = []) {
    return new ErrorService(400, message, errors);
  }
}

module.exports = ErrorService