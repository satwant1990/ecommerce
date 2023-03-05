const errorMiddleware = (err, req, resp, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"
    if (err.code === 11000) {
        err.message = 'Email Already Exists';
        err.statusCode = 400
    }
    if (err.name === "CastError") {
        err.message = `Invalid ID: ${err.path}`;
        err.statusCode = 400
    }

    resp.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}
export default errorMiddleware;