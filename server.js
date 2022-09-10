require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorHandler");
const { notFound } = require("./middlewares/notFound");
const { authRouter, profileRouter, jobsRouter } = require("./routes/index");
const auth = require("./middlewares/auth");
const hasAccess = require("./middlewares/rolesHandler");
const bidRouter = require("./routes/bids");

const app = express();
const PORT = process.env.PORT || 7070;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${process.env.API_URL}/auth`, authRouter);
app.use(`${process.env.API_URL}/profile`, auth, profileRouter);
app.use(
  `${process.env.API_URL}/jobs`,
  auth,
  hasAccess(["Employer"]),
  jobsRouter
);
app.use(`${process.env.API_URL}/bids`, auth, hasAccess(["Freelancer"]),bidRouter);

app.use(errorHandler);
app.use(notFound);

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
  } catch (error) {
    process.exit(1);
    throw new Error(error);
  }
};

start();
