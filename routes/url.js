const express = require("express");
const { body, validationResult } = require("express-validator");
const createUniqueId = require("../utils/createUniqueId");
const { conn } = require("../db");
const runQuery = require("../utils/queryHandler");

const router = express.Router();

router.post(
  "/shorten",
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
        "SELECT * FROM urls WHERE original_url = ?",
        [url]
      );
      console.log(checkExistResult, "checkExistResult");

      // if ERROR return
      if (checkExistResult.status === "ERROR") {
        return res.status(500).json({
          status: "ERROR",
          statusCode: 500,
          message: "Internal Server Error",
        });
      }

      if (checkExistResult.length > 0) {
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
