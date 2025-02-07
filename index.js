require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Listen Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: OK,
    statusCode: 200,
    message:
      "Welcome to URL Shortener API, Please use /api/shorten to shorten your URL",
  });
});

// Route to shorten URL API
app.use("/api", require("./routes/url"));

// Route to redirect to original URL
app.use("/", require("./routes/redirect"));
