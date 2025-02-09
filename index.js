require("dotenv").config();
const express = require("express");
const useragent = require("express-useragent");
const passport = require("passport");
const session = require("express-session");
const isAuthenticated = require("./middleware/isAuthenticated");
const getUserIpAddress = require("./middleware/accessIPAddress");
const initPassport = require("./utils/passportStrategy");
const rateLimit = require("express-rate-limit");
const PORT = process.env.PORT || 3000;

const app = express();

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

// Middleware to Access User IP Address
app.use(getUserIpAddress);

// Middleware to Access User Agent
app.use(useragent.express());

// Listen Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Default Route
app.get("/", isAuthenticated, (req, res) => {
  res.status(200).json({
    status: "OK",
    statusCode: 200,
    message: `Hi ${req.user?.name}, Welcome to URL Shortener API, Please use /api/shorten to shorten your URL`,
  });
});

// Configure Rate Limiter Middleware
const rateLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  limit: 5,
  handler: (req, res, next, options) =>
    res.status(options.statusCode).json({
      status: "ERROR",
      statusCode: 429,
      error: options.message,
    }),
});

// Apply Rate Limiter Middleware to Analytics API
app.use("/api/analytics", isAuthenticated, rateLimiter);

// Route to authenticate user
app.use("/auth", require("./routes/auth"));

// Route to shorten URL API
app.use("/api", require("./routes/api"));
