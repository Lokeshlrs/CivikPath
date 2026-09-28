export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin permissions required',
    });
  }
};

export const requireAdmin = adminMiddleware;
export default adminMiddleware;
