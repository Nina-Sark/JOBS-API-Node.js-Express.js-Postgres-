const { StatusCodes } = require("http-status-codes");
const JobServices = require("../services/JobServices");

class JobControllers {
  static async createJobPost(req, res) {
    const {
      user: { id },
      body,
    } = req;

    try {
      const job = await JobServices.createJob([id, ...Object.values(body)]);
      res.status(StatusCodes.CREATED).json({ job });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error(error);
    }
  }

  static async listJobs(req, res) {
    try {
      const jobs = await JobServices.getJobs();
      res.status(StatusCodes.OK).json({ jobs });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error(error);
    }
  }

  static async editJob(req, res) {
    const {
      user: { id },
      params: { jobId },
      body,
    } = req;

    try {
      await JobServices.updateJob([jobId, id, ...Object.values(body)]);
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "Job post was successfully updated." });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error(error);
    }
  }

  static async deleteJob(req, res) {
    const {
      user: { id },
      params: { jobId },
      body,
    } = req;

    try {
      await JobServices.removeJob(jobId, id);
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "Job post was successfully deleted." });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error(error);
    }
  }

  static async searchForJob(req, res) {
    const { title, skills } = req.query;

    try {
      const jobs = await JobServices.search(title, skills);
      res.status(StatusCodes.OK).json({ jobs })
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error(error);
    }
  }
}

module.exports = JobControllers;
