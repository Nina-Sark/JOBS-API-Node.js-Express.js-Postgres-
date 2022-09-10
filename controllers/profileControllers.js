const ProfileServices = require("../services/ProfileServices");
const { StatusCodes } = require("http-status-codes");

class ProfileControllers {
  static async createProfile(req, res) {
    const {
      user: { id },
      body,
    } = req;

    const profile = await ProfileServices.insertDataIntoProfile({
      user_id: id,
      ...body,
    });

    res.status(StatusCodes.CREATED).json({ profile });
  }

  static async updateProfile(req, res) {
    const {
      user: { id },
      params: { profileId },
      body,
    } = req;

    const profile = await ProfileServices.update([
      ...Object.values(body),
      profileId,
      id,
    ]);

    res.status(StatusCodes.OK).json({ profile });
  }

  static async getProfileData(req, res) {
    const {
      user: { id },
      params: { profileId },
    } = req;

    const profile = await ProfileServices.getProfile(id, profileId);
    res.status(StatusCodes.OK).json({ profile });
  }
}

module.exports = ProfileControllers;
