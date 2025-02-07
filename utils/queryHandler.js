const runQuery = (pool, query, params) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        return reject({
          status: "ERROR",
          statusCode: 500,
          message: "Database Connection Failed",
        });
      }

      conn.query(query, params, (err, result) => {
        conn.release(); // Release connection back to pool
        if (err) {
          return reject({
            status: "ERROR",
            statusCode: 500,
            message: "Query Execution Failed",
            error: err,
          });
        }
        resolve(result);
      });
    });
  });
};

module.exports = runQuery;
