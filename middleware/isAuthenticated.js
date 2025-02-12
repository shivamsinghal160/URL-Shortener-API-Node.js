const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.render("auth");
  }
  next();
};
module.exports = isAuthenticated;
