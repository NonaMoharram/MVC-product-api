const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let status = err.status || 'error';
    let message = err.message;

    // 1. التعامل مع خطأ تكرار البيانات الفريدة (Duplicate Key)
    if (err.code === 11000) {
        statusCode = 400;
        status = 'fail';
        const field = Object.keys(err.keyValue);
        message = `This ${field} already exists. Please use another ${field}!`;
    }

    // 2. التعامل مع خطأ نقص الحقول الإلزامية (Mongoose ValidationError)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        status = 'fail';
        // تجميع كل رسائل التحقق الناقصة في رسالة واحدة واضحة
        message = Object.values(err.errors).map(el => el.message).join(', ');
    }

    res.status(statusCode).json({
        status: status,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;


