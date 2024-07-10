class AppError extends Error {
  constructor(message, statusCode) {
    let statusMessage;

    super(message); // pass the message the error class using super
    this.statusCode = statusCode;

    switch (statusCode) {
      case 400:
        statusMessage = "Bad request";
        break;
      default:
        statusMessage = "error";
        break;
    }
    this.status = statusMessage;

    // error from a 3-party we are handler e.g database error
    this.isOperational = true;

    // stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
