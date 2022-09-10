const { StatusCodes } = require("http-status-codes");
const BidServices = require("../services/BidServices");

class BidControllers {
  static async postBid(req, res) {
    const {
      user: { id },
      query: { jobId },
      body,
    } = req;

    try {
      const bid = await BidServices.createBid([
        jobId,
        id,
        ...Object.values(body),
      ]);
      res.status(StatusCodes.CREATED).json({ bid });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error(error);
    }
  }

  static async deleteBid(req, res) {
    const {
      user: { id },
      params: { bidId },
      query: { jobId },
    } = req;
    try {
      const bid = await BidServices.removeBid(jobId, id, bidId);
      res
        .status(StatusCodes.OK)
        .json({ message: "Bid successfully removed.", bid });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error(error);
    }
  }

  static async getAllBids(req, res) {
    const { jobId } = req.query;
    try {
      const bids = await BidServices.getBids(jobId);
      res.status(StatusCodes.OK).json({ bids });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error(error);
    }
  }
}

module.exports = BidControllers;
