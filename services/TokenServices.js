const jwt = require("jsonwebtoken");

class TokenServices {
  static generateToken(data) {
    const token = jwt.sign(data, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRE,
    });

    return token;
  }

  static verifyToken(token) {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET)
    return payload;
  }
}

module.exports = TokenServices;
