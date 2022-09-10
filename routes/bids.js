require("express-async-errors");
const { Router } = require("express");
const BidControllers = require("../controllers/bidControllers");
const bidRouter = Router();

bidRouter
  .route("/")
  .post(BidControllers.postBid)
  .get(BidControllers.getAllBids);
bidRouter.route("/:bidId").delete(BidControllers.deleteBid);

module.exports = bidRouter;
