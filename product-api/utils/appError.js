class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // إذا كان الخطأ يبدأ بـ 4 (مثل 404) فهو فشل من المستخدم، وإذا كان غير ذلك فهو خطأ سيرفر 500
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
