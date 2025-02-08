const express = require("express");
const passport = require("passport");
const router = express.Router();

// Redirect to Google OAuth
router.get(
  "/google",
  (req, res, next) => {
    if (req.user) return res.redirect("/");
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback from Google OAuth
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    console.log(req.user);
    res.redirect("/");
  }
);

// Logout User
router.get("/logout", (req, res) => {
  req.logout(() => {
    console.log("User logged out");
    res.redirect("/");
  });
});

module.exports = router;
