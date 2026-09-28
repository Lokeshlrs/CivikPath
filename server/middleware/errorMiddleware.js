export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorMiddleware = (err, req, res, next) => {
  console.error('[API Error]', err.stack || err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.status || 500);

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const errorHandler = errorMiddleware;
export default errorMiddleware;
