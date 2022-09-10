const db = require("../config/db.config");
const { INSERT_INTO_BIDS, REMOVE_BID, GET_BIDS } = require("../queries/bidQueries");

class BidServices {
  static async createBid(data) {
    const bid = await db.query(INSERT_INTO_BIDS, data);
    return bid?.rows?.[0];
  }

  static async removeBid(jobId, userId, bidId) {
    const bid = await db.query(REMOVE_BID, [jobId, userId, bidId]);
    return bid?.rows?.[0];
  }

  static async getBids(jobId) {
    const bids = await db.query(GET_BIDS, [jobId]);
    return bids?.rows
  }
}

module.exports = BidServices;
