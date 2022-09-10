const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const TokenServices = require("../services/TokenServices");

const auth = (req, res, next) => {
  const authToken = req.headers.authentication;

  if (!authToken) {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("Not authenticated");
  }

  const token = authToken.split(" ")[1];

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("Not authenticated");
  }

  const payload = TokenServices.verifyToken(token);

  if (!payload) {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("Token is invalid or has expired");
  }

  req.user = payload;
  next();
};

module.exports = auth;
