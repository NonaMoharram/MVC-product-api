const AppError = require('../utils/AppError'); 
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = err => {
  const value = Object.keys(err.keyValue);
  const message = `Duplicate field value: (${value}). Please use another value.`;
  return new AppError(message, 409);
};
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const errorHandler = (err, req, res, next) => {
  console.log('🔴 ERROR DETECTED:', err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.name = err.name;
  error.code = err.code;
  error.message = err.message; 
  if (error.name === 'CastError') error = handleCastErrorDB(err);
  if (error.code === 11000) error = handleDuplicateFieldsDB(err);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(err);

  let finalStatusCode = error.statusCode || err.statusCode;
  if (typeof finalStatusCode !== 'number') {
      finalStatusCode = 400;
  }
  res.status(finalStatusCode).json({
    status: error.status || err.status || 'error',
    message: error.message || err.message, 
    data: null
  });
};
module.exports = errorHandler;
