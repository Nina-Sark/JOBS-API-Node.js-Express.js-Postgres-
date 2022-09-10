const AuthServices = require("../services/AuthServices");
const { StatusCodes } = require("http-status-codes");
const PasswordServices = require("../services/PasswordServices");
const TokenServices = require("../services/TokenServices");
const { excludePassword } = require("../utils/excludePassword");

class AuthControllers {
  static async register(req, res) {
    const {
      email,
      password,
      first_name,
      last_name,
      role = "Freelancer",
    } = req.body;

    try {
      const userEmailInUse = await AuthServices.findUserByEmail(email);

      if (userEmailInUse) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error(`Email <${email}> is already is use.`);
      }

      const { user, token } = await AuthServices.createUser({
        email,
        password,
        first_name,
        last_name,
        role,
      });

      res.status(StatusCodes.CREATED).json({ user, token });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error(error);
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    const user = await AuthServices.findUserByEmail(email);

    if (!user) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Invalid credentials.");
    }

    console.log(user)

    const isPasswordValid = await PasswordServices.comparePassword(
      password,
      user?.password
    );

    if (!isPasswordValid) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Invalid credentials.");
    }

    const token = TokenServices.generateToken({
      id: user?.user_id,
      role: user?.role,
    });

    const userData = excludePassword(user);

    res.status(StatusCodes.OK).json({ user: userData, token });
  }
}

module.exports = AuthControllers;
