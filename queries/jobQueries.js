exports.CREATE_JOB =
  "INSERT INTO jobs (employer_id, job_title, job_description, required_skills, job_price) VALUES ($1, $2, $3, $4, $5) RETURNING job_id, employer_id, job_title, job_description, required_skills, job_price, number_of_bids, created_at";
exports.GET_JOBS =
  "SELECT j.job_id, j.job_title, j.job_description, j.required_skills, j.job_price, j.number_of_bids, j.created_at, u.user_id AS employer_id, u.first_name || ' ' || u.last_name AS employer_fullname, u.rating, u.number_of_reviews, pd.country AS employer_country, pd.city AS employer_city FROM jobs j JOIN users u ON j.employer_id = u.user_id JOIN profile_details pd USING (user_id) ORDER BY created_at DESC";
exports.UPDATE_JOB = "CALL update_job ($1, $2, $3, $4, $5, $6)";
exports.DELETE_JOB = "CALL delete_job ($1, $2)";
exports.SEARCH_JOB = "SELECT * FROM jobs WHERE job_title LIKE $1 OR required_skills && $2"