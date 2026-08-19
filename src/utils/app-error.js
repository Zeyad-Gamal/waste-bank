

class AppError extends Error {

  constructor(
    error,
    statusCode
  ) {

    super(error.message);

    this.statusCode = statusCode;

    this.code = error.code;

    this.isOperational = true;

    Error.captureStackTrace(
      this,
      this.constructor
    );

  }

}

module.exports = AppError;