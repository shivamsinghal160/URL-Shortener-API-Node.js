require("dotenv").config();
const express = require("express");
const useragent = require("express-useragent");
const passport = require("passport");
const session = require("express-session");
const isAuthenticated = require("./middleware/isAuthenticated");
const getUserIpAddress = require("./middleware/accessIPAddress");
const initPassport = require("./controllers/passportStrategy");
const rateLimit = require("express-rate-limit");
const PORT = process.env.PORT || 3000;

// Create Express App
const app = express();

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.COOKIE_SECURE === "true" ? true : false },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set View Engine with EJS
app.set("view engine", "ejs");

// Set Views Directory
app.set("views", "./views");

// Middleware to Access User IP Address
app.use(getUserIpAddress);

// Middleware to Access User Agent
app.use(useragent.express());

// Listen Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// serve public folder to access static files
app.use(express.static("public"));

// Default Route
app.get("/", isAuthenticated, (req, res) => {
  try {
    // Render index.ejs with user data
    res.render("index", { user: req.user });
  } catch (error) {
    console.log(error, "Error in rendering index.ejs");
  }
});

// Configure Rate Limiter Middleware
const rateLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  limit: 3, // limit each IP to 3 requests per windowMs
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
