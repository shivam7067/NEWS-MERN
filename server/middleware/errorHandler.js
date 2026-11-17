const errorHandler = (err, req, res, next) => {
    console.error('Server Error:', err);

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val) => val.message);
        return res.status(400).json({
            success: false,
            message: messages.join(', ')
        });
    }

    // Multer file upload errors & fileFilter type errors
    if (err.name === 'MulterError' || (err.message && err.message.includes('image files are allowed'))) {
        return res.status(400).json({
            success: false,
            message: err.message || 'File upload error'
        });
    }

    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid identifier format for ${err.path || 'resource'}`
        });
    }

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;
