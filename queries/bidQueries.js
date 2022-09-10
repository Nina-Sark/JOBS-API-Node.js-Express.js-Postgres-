exports.INSERT_INTO_BIDS = "SELECT * FROM post_bid($1, $2, $3, $4, $5);";
exports.REMOVE_BID = "SELECT * FROM remove_bid($1, $2, $3)";
exports.GET_BIDS =
  "SELECT b.*, u.email AS user_email, u.first_name || ' ' || u.last_name AS fullname, u.rating AS user_rating, u.number_of_reviews AS user_number_of_reviews FROM bids b JOIN users u USING (user_id) WHERE job_id = $1 ORDER BY user_number_of_reviews DESC";
