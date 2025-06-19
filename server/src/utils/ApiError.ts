class ApiError extends Error {
  statusCode: number;
  success: boolean;

  constructor(statusCode: number, message?: string, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.stack = stack;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
