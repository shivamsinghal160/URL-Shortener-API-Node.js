const createUniqueId = require("../utils/createUniqueId");
const updateAnalytics = require("../utils/updateAnalytics");
const { validationResult } = require("express-validator");
const { conn } = require("../db");
const runQuery = require("../utils/queryHandler");

// Function: Fetch all shorten URLs of a user
const allShortenUrl = async (req, res) => {
  try {
    const fetchAllUrls = await runQuery(
      conn,
      "SELECT short_url_id, original_url, created_at FROM urls WHERE user_id = ?",
      [req.user.id]
    );

    if (fetchAllUrls.length === 0) {
      return res.status(404).json({
        status: "ERROR",
        statusCode: 404,
        message: "No URL found",
      });
    }

    return res.status(200).json({
      status: "OK",
      statusCode: 200,
      message: "All URLs fetched successfully",
      data: fetchAllUrls.map((item) => ({
        shortUrl: `${process.env.PUBLIC_URL}/api/shorten/${item.short_url_id}`,
        longUrl: item.original_url,
        createdAt: item.created_at,
      })),
    });
  } catch (error) {
    console.log("Error in fetching all URLs ---> ", error);
    return res.status(500).json({
      status: "ERROR",
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};

//Function: Fetch all shorten URLs of a user
const redirectShortUrl = async (req, res) => {
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

    // UPDATE Analytics for URL
    updateAnalytics(req, fetchOriginalUrl[0].id, fetchOriginalUrl[0].user_id);

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
};

// Function: Fetch shorten URLs (in JSON) of a user
const getShortUrlJSON = async (req, res) => {
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

    // UPDATE Analytics for URL
    updateAnalytics(req, fetchOriginalUrl[0].id, fetchOriginalUrl[0].user_id);

    res.json({
      status: "OK",
      statusCode: 200,
      message: "Redirecting to original URL",
      longUrl: fetchOriginalUrl[0].original_url,
    });
  } catch (error) {
    console.log("Error in redirecting to original URL ---> ", error);
    res.status(500).json({
      status: "ERROR",
      statusCode: 500,
      message: "Failed to redirect to original URL",
    });
  }
};

// Function: Render Index Page
const renderIndexPage = async (req, res) => {
  try {
    return res.render("index", {
      user: req.user,
    });
  } catch (error) {
    console.log("Error in rendering index page (in api.js) ---> ", error);
  }
};

// Function: Create Shorten URL
const createShortenUrl = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "ERROR",
      statusCode: 400,
      message: errors.array(),
    });
  }

  try {
    const url = req.body.longUrl;

    let isCustomAlias = false;
    let customAlias = "";
    let topic_id = null;
    if (req.body.customAlias && req.body.customAlias.trim() !== "") {
      isCustomAlias = true;
      customAlias = req.body.customAlias;

      // Check if the custom alias is not reserved alias
      if (customAlias === "overall") {
        return res.render("index", {
          status: "ERROR",
          statusCode: 400,
          user: req.user,
          message: "'overall' is a reserved alias",
        });
      }

      const checkAlias = await runQuery(
        conn,
        "SELECT * FROM urls WHERE short_url_id = ?",
        [customAlias]
      );

      if (checkAlias.length > 0) {
        return res.render("index", {
          status: "ERROR",
          statusCode: 400,
          user: req.user,
          message: `'${customAlias}' alias already exists`,
        });
      }
    }

    let topic;
    if (req.body.topic && req.body.topic.trim() !== "") {
      topic = req.body.topic.trim();

      // Check if the topic already exists in the database
      const checkTopic = await runQuery(
        conn,
        "SELECT * FROM topic WHERE name = ? and user_id = ?",
        [topic, req.user.id]
      );

      if (checkTopic.length === 0) {
        // Insert the topic into the database
        const insertTopic = await runQuery(
          conn,
          "INSERT INTO topic (name, user_id) VALUES (?, ?)",
          [topic, req.user.id]
        );
        topic_id = insertTopic.insertId;
      } else {
        topic_id = checkTopic[0].id;
      }
    }

    // Generate a unique id
    const uniqueId = !isCustomAlias ? createUniqueId() : customAlias;

    // Check if the URL already exists in the database
    const checkExistResult = await runQuery(
      conn,
      "SELECT t1.short_url_id, COALESCE(t2.name, '') as topic, t1.created_at FROM urls t1 LEFT JOIN topic t2 on t2.id = t1.topic_id WHERE t1.original_url = ? and t1.user_id = ?",
      [url, req.user.id]
    );

    // if ERROR return
    if (checkExistResult.status === "ERROR") {
      return res.render("index", {
        status: "ERROR",
        statusCode: 500,
        user: req.user,
        message: "Internal Server Error",
      });
    }

    if (checkExistResult.length > 0) {
      checkExistResult[0].shortUrl = `${process.env.PUBLIC_URL}/api/shorten/${checkExistResult[0].short_url_id}`;
      delete checkExistResult[0].short_url_id;

      return res.render("index", {
        status: "OK",
        statusCode: 200,
        user: req.user,
        message: "URL already exists",
        data: checkExistResult[0],
      });
    }

    // Insert the URL and uniqueId into the database
    const insertResult = await runQuery(
      conn,
      "INSERT INTO urls (original_url, short_url_id, topic_id, user_id) VALUES (?, ?, ?, ?)",
      [url, uniqueId, topic_id, req.user.id]
    );

    if (insertResult.affectedRows > 0) {
      return res.render("index", {
        status: "OK",
        statusCode: 200,
        user: req.user,
        message: "URL shortened successfully",
        data: {
          shortUrl: `${process.env.PUBLIC_URL}/api/shorten/${uniqueId}`,
          topic,
          createdAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.log("error on /api/shorten api ---> ", error);
    return res.render("index", {
      status: "ERROR",
      statusCode: 500,
      user: req.user,
      message: "Internal Server Error",
    });
  }
};

// Export the module
module.exports = {
  allShortenUrl,
  redirectShortUrl,
  getShortUrlJSON,
  renderIndexPage,
  createShortenUrl,
};
