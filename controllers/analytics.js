const { conn } = require("../db");
const runQuery = require("../utils/queryHandler");
const {
  analysisUrlAnalytics,
  analysisUrlWiseAnalytics,
} = require("./analysisUrlAnalytics");

// Function: Fetch overall analytics of a user
const getOverallAnalytics = async (req, res) => {
  try {
    // Fetch URL ID and check existence
    const urlResult = await runQuery(
      conn,
      "SELECT id FROM urls WHERE user_id = ?",
      [req.user.id]
    );

    if (urlResult.length === 0) {
      return res.status(404).json({
        status: "ERROR",
        statusCode: 404,
        message: "No URL found",
      });
    }

    const urlId = urlResult.map((item) => item.id).join(",");

    console.log("urlId", urlId);

    let data = {
      totalUrls: urlResult.length,
      ...(await analysisUrlAnalytics(urlId)),
    };

    console.log("data2", data);

    return res.status(200).json({
      status: "OK",
      statusCode: 200,
      message: "Analytics fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({
      status: "ERROR",
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};

// Function: Fetch URL analytics by short URL
const getUrlAnalytics = async (req, res) => {
  try {
    const { shortUrl } = req.params;

    console.log("shortUrl", shortUrl);
    console.log("req.user.id", req.user.id);

    // Fetch URL ID and check existence
    const urlResult = await runQuery(
      conn,
      "SELECT id FROM urls WHERE short_url_id = ? and user_id = ?",
      [shortUrl, req.user.id]
    );

    if (urlResult.length === 0) {
      return res.status(404).json({
        status: "ERROR",
        statusCode: 404,
        message: "URL not found",
      });
    }

    const urlId = urlResult[0].id;

    let data = await analysisUrlAnalytics(urlId);

    return res.status(200).json({
      status: "OK",
      statusCode: 200,
      message: "Analytics fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({
      status: "ERROR",
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};

// Function: Fetch URL analytics by topic
const getTopicWiseAnalytics = async (req, res) => {
  try {
    let { topic } = req.params;

    topic = topic.trim();

    // Fetch URL ID and check existence
    const urlResult = await runQuery(
      conn,
      "SELECT id FROM urls WHERE topic_id = (SELECT id FROM topic WHERE name = ? and user_id = ?)",
      [topic, req.user.id]
    );

    if (urlResult.length === 0) {
      return res.status(404).json({
        status: "ERROR",
        statusCode: 404,
        message: "No Topic found",
      });
    }

    const urlId = urlResult.map((item) => item.id).join(",");

    console.log("urlId", urlId);

    let data = await analysisUrlWiseAnalytics(urlId);

    return res.status(200).json({
      status: "OK",
      statusCode: 200,
      message: "Analytics fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({
      status: "ERROR",
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};

// Exporting the functions
module.exports = {
  getOverallAnalytics,
  getUrlAnalytics,
  getTopicWiseAnalytics,
};
