require("dotenv").config();
const express = require("express");
const isAuthenticated = require("./middleware/isAuthenticated");
const getUserIpAddress = require("./middleware/accessIPAddress");
const passport = require("passport");
const initPassport = require("./utils/passportStrategy");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

// Middleware to parse JSON data
app.use(express.json());

// Listen Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Default Route
app.get("/", getUserIpAddress, (req, res) => {
  console.log("Request User:", req.clientIpAddress);
  res.status(200).json({
    status: "OK",
    statusCode: 200,
    client_ip_address: req.clientIpAddress,
    message: `Hi ${req.user?.name}, Welcome to URL Shortener API, Please use /api/shorten to shorten your URL`,
  });
});

// Route to authenticate user
app.use("/auth", require("./routes/auth"));

// Route to shorten URL API
app.use("/api", require("./routes/url"));
