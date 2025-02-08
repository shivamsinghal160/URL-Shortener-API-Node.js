const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(401).json({
    status: "UNAUTHORIZED",
    statusCode: 401,
    message: "Please login to continue , use /auth/google to login",
  });
};
module.exports = isAuthenticated;
