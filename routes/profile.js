require("express-async-errors");
const { Router } = require("express");
const ProfileControllers = require("../controllers/profileControllers");
const profileRouter = Router();

profileRouter.post("/", ProfileControllers.createProfile);
profileRouter.route("/:profileId").patch(ProfileControllers.updateProfile).get(ProfileControllers.getProfileData)

module.exports = profileRouter;
