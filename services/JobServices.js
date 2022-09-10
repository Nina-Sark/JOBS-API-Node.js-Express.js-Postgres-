const db = require("../config/db.config");
const {
  CREATE_JOB,
  GET_JOBS,
  UPDATE_JOB,
  DELETE_JOB,
  SEARCH_JOB,
} = require("../queries/jobQueries");

class JobServices {
  static async createJob(data) {
    const job = await db.query(CREATE_JOB, data);
    return job?.rows?.[0];
  }

  static async getJobs() {
    const jobs = await db.query(GET_JOBS);
    return jobs?.rows;
  }

  static async updateJob(data) {
    return await db.query(UPDATE_JOB, data);
  }

  static async removeJob(jobId, employerId) {
    return await db.query(DELETE_JOB, [jobId, employerId]);
  }

  static async search(title, skills) {
    const jobs = await db.query(SEARCH_JOB, [`%${title}%`, `{${skills}}`]);
    return jobs?.rows
  }
}

module.exports = JobServices;
