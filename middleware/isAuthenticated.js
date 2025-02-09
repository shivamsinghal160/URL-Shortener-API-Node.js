const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.send(`<a href='${process.env.PUBLIC_URL}/auth/google'>Continue with Google</a>`)
};
module.exports = isAuthenticated;
