const express = require("express");
const { conn } = require("../db");
const runQuery = require("../utils/queryHandler");

const router = express.Router();

// Redirect to original URL
router.get("/:shortUrl", async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;
    const fetchOriginalUrl = await runQuery(
      conn,
      "SELECT * FROM urls WHERE short_url_id = ?",
      [shortUrl]
    );

    if (fetchOriginalUrl.length === 0) {
      return res.status(404).json({
        status: "ERROR",
        statusCode: 404,
        message: "URL not found",
      });
    }

    res.redirect(fetchOriginalUrl[0].original_url);
  } catch (error) {
    console.log("Error in redirecting to original URL ---> ", error);
    res.status(500).json({
      status: "ERROR",
      statusCode: 500,
      message: "Failed to redirect to original URL",
    });
  }
});

// Response in JSON format
router.post("/:shortUrl", async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;
    const fetchOriginalUrl = await runQuery(
      conn,
      "SELECT * FROM urls WHERE short_url_id = ?",
      [shortUrl]
    );

    if (fetchOriginalUrl.length === 0) {
      return res.status(404).json({
        status: "ERROR",
        statusCode: 404,
        message: "URL not found",
      });
    }

    res.json({
      status: "OK",
      statusCode: 200,
      message: "Redirecting to original URL",
      original_url: fetchOriginalUrl[0].original_url,
    });
  } catch (error) {
    console.log("Error in redirecting to original URL ---> ", error);
    res.status(500).json({
      status: "ERROR",
      statusCode: 500,
      message: "Failed to redirect to original URL",
    });
  }
});

module.exports = router;
