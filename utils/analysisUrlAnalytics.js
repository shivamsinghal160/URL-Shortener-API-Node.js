const analysisUrlAnalytics = async (urlId) => {
  const { conn } = require("../db");
  const runQuery = require("./queryHandler");
  // Run all queries in parallel
  const [totalAndUniqueClicks, last7DaysClicks, deviceClicks, osClicks] =
    await Promise.all([
      runQuery(
        conn,
        `SELECT 
            COUNT(id) AS totalClicks, 
            COUNT(DISTINCT(ip_address)) AS uniqueClicks 
          FROM url_analytics 
          WHERE find_in_set(url_id, ?)`,
        [urlId]
      ),

      runQuery(
        conn,
        `SELECT 
            DATE(created_at) AS date, 
            COUNT(id) AS total_clicks 
          FROM url_analytics 
          WHERE find_in_set(url_id, ?) 
            AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
          GROUP BY DATE(created_at)`,
        [urlId]
      ),

      runQuery(
        conn,
        `SELECT 
            device_type AS deviceName, 
            COUNT(id) AS uniqueClicks, 
            COUNT(DISTINCT ip_address) AS uniqueUsers 
          FROM url_analytics 
          WHERE find_in_set(url_id, ?) 
          GROUP BY device_type`,
        [urlId]
      ),

      runQuery(
        conn,
        `SELECT 
            os AS osName, 
            COUNT(id) AS uniqueClicks, 
            COUNT(DISTINCT ip_address) AS uniqueUsers 
          FROM url_analytics 
          WHERE find_in_set(url_id, ?) 
          GROUP BY os`,
        [urlId]
      ),
    ]);

  // Transform date format for last 7 days clicks
  last7DaysClicks.forEach((item) => {
    item.date = new Date(item.date).toISOString().split("T")[0];
  });

  const data = {
    ...totalAndUniqueClicks[0],
    ...(last7DaysClicks.length && { clicksByDate: last7DaysClicks }),
    ...(deviceClicks.length && { deviceType: deviceClicks }),
    ...(osClicks.length && { osType: osClicks }),
  };

  return data;
};

const analysisUrlWiseAnalytics = async (urlId) => {
  const { conn } = require("../db");
  const runQuery = require("./queryHandler");
  // Run all queries in parallel
  const [totalAndUniqueClicks, last7DaysClicks, urlWiseTotalAndUniqueClicks] =
    await Promise.all([
      runQuery(
        conn,
        `SELECT 
            COUNT(id) AS totalClicks, 
            COUNT(DISTINCT(ip_address)) AS uniqueClicks 
          FROM url_analytics 
          WHERE find_in_set(url_id, ?)`,
        [urlId]
      ),

      runQuery(
        conn,
        `SELECT 
            DATE(created_at) AS date, 
            COUNT(id) AS total_clicks 
          FROM url_analytics 
          WHERE find_in_set(url_id, ?) 
            AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
          GROUP BY DATE(created_at)`,
        [urlId]
      ),

      runQuery(
        conn,
        `SELECT 
            t2.short_url_id as shortUrl,
            COUNT(t1.id) AS totalClicks,
            COUNT(DISTINCT(t1.ip_address)) AS uniqueUsers 
          FROM url_analytics t1 
          INNER JOIN urls t2 ON t1.url_id = t2.id
          WHERE find_in_set(url_id, ?)
          GROUP BY t1.url_id`,
        [urlId]
      )
    ]);

  // Transform date format for last 7 days clicks
  last7DaysClicks.forEach((item) => {
    item.date = new Date(item.date).toISOString().split("T")[0];
  });

  urlWiseTotalAndUniqueClicks.forEach((item) => {
    item.shortUrl = `${process.env.PUBLIC_URL}/api/shorten/${item.shortUrl}`;
  });

  const data = {
    ...totalAndUniqueClicks[0],
    ...(last7DaysClicks.length && { clicksByDate: last7DaysClicks }),
    ...(urlWiseTotalAndUniqueClicks.length && { urls : urlWiseTotalAndUniqueClicks }),
  };

  return data;
};

module.exports = {analysisUrlAnalytics, analysisUrlWiseAnalytics};
