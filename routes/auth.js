require("express-async-errors");
const { Router } = require("express");
const AuthControllers = require("../controllers/authControllers");
const authRouter = Router();

authRouter.post("/register", AuthControllers.register);
authRouter.post("/login", AuthControllers.login)

module.exports = authRouter;
