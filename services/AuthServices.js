const dbConfig = require("../config/db.config");
const { CREATE_USER, GET_USER_BY_EMAIL } = require("../queries/authQueries");
const { excludePassword } = require("../utils/excludePassword");
const PasswordServices = require("./PasswordServices");
const TokenServices = require("./TokenServices");

class AuthServices {
  static async findUserByEmail(email) {
    const user = await dbConfig.query(GET_USER_BY_EMAIL, [email]);
    return user?.rows?.[0];
  }

  static async createUser(data) {
    const userData = data;
    userData.password = await PasswordServices.hashPassword(userData.password);

    const user = await dbConfig.query(CREATE_USER, Object.values(userData));
    const token = TokenServices.generateToken({
      id: user?.rows?.[0]?.user_id,
      role: user?.rows?.[0]?.role,
    });

    return { user: excludePassword(user?.rows?.[0]), token };
  }
}

module.exports = AuthServices;
