const express = require("express");
const { body } = require("express-validator");
const isAuthenticated = require("../middleware/isAuthenticated");
const {
  allShortenUrl,
  redirectShortUrl,
  getShortUrlJSON,
  renderIndexPage,
  createShortenUrl,
} = require("../controllers/urls");
const {
  getOverallAnalytics,
  getUrlAnalytics,
  getTopicWiseAnalytics,
} = require("../controllers/analytics");

// Create a new router
const router = express.Router();

// ***Route to Get All Shorten URL***
router.get("/shorten/overall", isAuthenticated, allShortenUrl);

// ***Route to Redirect with Shorten URL***
router.get("/shorten/:shortUrl", redirectShortUrl);

// ***Route to Response in JSON format from Shorten URL***
router.post("/shorten/:shortUrl", getShortUrlJSON);

// ***Route to Render Index Page***
router.get("/shorten", isAuthenticated, renderIndexPage);

// ***Route to Create Shorten URL API***
router.post(
  "/shorten",
  isAuthenticated,
  [body("longUrl").isURL().withMessage("Enter a Valid Url")],
  createShortenUrl
);

// ***Route to Get Overall URL Analytics***
router.get("/analytics/overall", getOverallAnalytics);

// ***Route to Get URL Analytics by url alias***
router.get("/analytics/:shortUrl", isAuthenticated, getUrlAnalytics);

// ***Route to Get URL Analytics (Topic Wise)***
router.get("/analytics/topic/:topic", isAuthenticated, getTopicWiseAnalytics);

module.exports = router;
