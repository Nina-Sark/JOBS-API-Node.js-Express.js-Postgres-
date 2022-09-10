exports.CREATE_USER =
  "INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, email, first_name, last_name, role, rating, number_of_reviews";
exports.GET_USER_BY_EMAIL =
  "SELECT user_id, email, password, first_name, last_name, role, rating, number_of_reviews as reviews FROM users WHERE email = $1";
