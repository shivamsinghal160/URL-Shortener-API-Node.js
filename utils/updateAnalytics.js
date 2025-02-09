const updateAnalytics = (req, urlId, userId) => {
  const { conn } = require("../db");
  const runQuery = require("../utils/queryHandler");
  let device_type;
  if (req.useragent.isMobile) {
    device_type = "Mobile";
  } else if (req.useragent.isDesktop) {
    device_type = "Desktop";
  } else if (req.useragent.isLinux) {
    device_type = "Linux";
  } else if (req.useragent.isMac) {
    device_type = "Mac";
  } else {
    device_type = "Other";
  }

  runQuery(
    conn,
    "INSERT INTO url_analytics (url_id, user_id, ip_address, user_agent, browser,os, device_type) VALUES (?, ?, ?, ?, ? ,?, ?)",
    [
      urlId,
      userId,
      req.clientIpAddress,
      req.useragent.source,
      req.useragent.browser,
      req.useragent.os,
      device_type,
    ]
  );
};

module.exports = updateAnalytics;
