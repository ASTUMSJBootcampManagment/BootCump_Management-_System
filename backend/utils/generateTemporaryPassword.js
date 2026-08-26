const crypto = require("crypto");

const generateTemporaryPassword = () => {
  return crypto.randomBytes(6).toString("base64url");
};

module.exports = generateTemporaryPassword;
