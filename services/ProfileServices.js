const db = require("../config/db.config");
const {
  INSERT_DATA_INTO_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILE_DATA,
  GET_USER_BY_EXPERTISE,
} = require("../queries/profileQueries");

class ProfileServices {
  static async insertDataIntoProfile(data) {
    const userProfile = await db.query(
      INSERT_DATA_INTO_PROFILE,
      Object.values(data)
    );
    return userProfile?.rows?.[0];
  }

  static async update(data) {
    const profile = await db.query(UPDATE_PROFILE, data);
    return profile?.rows?.[0];
  }

  static async getProfile(userId, profileId) {
    const profile = await db.query(GET_PROFILE_DATA, [userId, profileId]);
    return profile?.rows?.[0];
  }

  static async getByExpertise(expertise) {
    const users = await db.query(GET_USER_BY_EXPERTISE, [expertise]);
    return users?.rows
  }
}

module.exports = ProfileServices;
