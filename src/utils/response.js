// Format standar untuk response sukses
exports.success = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        status: 'success',
        message: message,
        data: data
    });
};

// Format standar untuk response error
exports.error = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
        status: 'error',
        message: message
    });
};