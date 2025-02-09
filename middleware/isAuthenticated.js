const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.send(
      `<a href='${process.env.PUBLIC_URL}/auth/google'>Continue with Google</a>`
    );
  }
  next();
};
module.exports = isAuthenticated;
