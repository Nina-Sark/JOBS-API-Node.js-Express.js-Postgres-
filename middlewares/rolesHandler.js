const AuthServices = require("../services/AuthServices");
const { StatusCodes } = require("http-status-codes");

const hasAccess = (roles) => {
  return async (req, res, next) => {
    const { role } = req.user;

    if (!roles.includes(role)) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("You don't have access to these resources.");
    }

    next();
  };
};

module.exports = hasAccess;
