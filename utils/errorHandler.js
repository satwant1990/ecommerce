class ErrorHandler extends Error {
    constructor(message,statusCode)
    {
        super(message)  
        statusCode = this.statusCode
        Error.captureStackTrace(this, this.constructor)
    }

}

export default ErrorHandler;