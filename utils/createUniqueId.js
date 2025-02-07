const crypto = require("crypto");

const createUniqueId = (length = 8) => {
  return crypto.randomBytes(length).toString("hex");
};

module.exports = createUniqueId;