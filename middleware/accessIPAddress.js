const requestIp = require("request-ip");

const getUserIpAddress = (req, res, next) => {
  const clientIp = requestIp.getClientIp(req);
  console.log("Client IP Address:", clientIp);
  // Append clientIp to req object
  req.clientIpAddress = clientIp;
  next();
};

module.exports = getUserIpAddress;
