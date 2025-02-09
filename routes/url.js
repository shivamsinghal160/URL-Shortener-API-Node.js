const express = require("express");
const { body, validationResult } = require("express-validator");
const createUniqueId = require("../utils/createUniqueId");
const { conn } = require("../db");
const runQuery = require("../utils/queryHandler");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

// ***Route to Redirect with Shorten URL***
router.get("/shorten/:shortUrl", async (req, res) => {
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

    // Redirect User to Original URL
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

// ***Route to Response in JSON format from Shorten URL***
router.post("/shorten/:shortUrl", async (req, res) => {
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

// ***Route to Shorten URL API***
router.post(
  "/shorten",
  isAuthenticated,
  [body("url").isURL().withMessage("Enter a Valid Url")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "ERROR",
        statusCode: 400,
        message: errors.array(),
      });
    }

    try {
      const url = req.body.url;

      // Generate a unique id
      const uniqueId = createUniqueId();

      // Check if the URL already exists in the database
      const checkExistResult = await runQuery(
        conn,
        "SELECT original_url, short_url_id FROM urls WHERE original_url = ?",
        [url]
      );

      // if ERROR return
      if (checkExistResult.status === "ERROR") {
        return res.status(500).json({
          status: "ERROR",
          statusCode: 500,
          message: "Internal Server Error",
        });
      }

      if (checkExistResult.length > 0) {
        checkExistResult[0].shortened_url = `${process.env.PUBLIC_URL}/${checkExistResult[0].short_url_id}`;
        delete checkExistResult[0].short_url_id;

        return res.status(200).json({
          status: "OK",
          statusCode: 200,
          message: "URL already exists",
          data: checkExistResult[0],
        });
      }

      // Insert the URL and uniqueId into the database
      const insertResult = await runQuery(
        conn,
        "INSERT INTO urls (original_url, short_url_id) VALUES (?, ?)",
        [url, uniqueId]
      );

      if (insertResult.affectedRows > 0) {
        return res.status(200).json({
          status: "OK",
          statusCode: 200,
          message: "URL shortened successfully",
          data: {
            original_url: url,
            shortened_url: `${process.env.PUBLIC_URL}/${uniqueId}`,
          },
        });
      }
    } catch (error) {
      console.log("error on /api/shorten api ---> ", error);
      return res.status(500).json({
        status: "ERROR",
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  }
);

module.exports = router;
