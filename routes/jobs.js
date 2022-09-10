require("express-async-errors");
const { Router } = require("express");
const JobControllers = require("../controllers/jobControllers");
const jobsRouter = Router();

jobsRouter
  .route("/")
  .post(JobControllers.createJobPost)
  .get(JobControllers.listJobs);

jobsRouter
  .route("/:jobId")
  .patch(JobControllers.editJob)
  .delete(JobControllers.deleteJob);

jobsRouter.get("/search", JobControllers.searchForJob)

module.exports = jobsRouter;
