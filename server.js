import dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.ENV` });
import express from "express";
import morgan from "morgan";

import createRoute from "./routes/index.js";
import userRoute from "./routes/user.js";
import organizationRoute from "./routes/organisations.js";
import catchAsync from "./utils/catchAsync.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorHandler.js";
//import mainRoute from "./routes/routes.js";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  return res.status(200).json({
    message: "Hello, World!, HNG stage 2 OAuth",
    date: new Date().toDateString(),
  });
});

//app.use("/api", mainRoute);
app.use("/auth", createRoute);
app.use("/api/users", userRoute);
app.use("/api/organisations", organizationRoute);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    // STEP 1 method to handle global async error
    // const err = new Error("Route not found " + req.baseUrl);
    // err.status = 404;
    // return next(err);

    // STEP 2 using the catchAsync wrapper
    // throw new Error("Route not found " + req.baseUrl);

    // STEP 3 using the catchAsync wrapper and Custom error handler
    const url = req.baseUrl || req.originalUrl;
    throw new AppError(`Can't find ${url} on this server`, 404);

    // return res.status(404).json({
    //   message: "Route not found " + req.baseUrl,
    // });

    // throwing error that the middleware docent use async
    // throw new Error("Route not found " + req.baseUrl)
  })
);

// global error handler
app.use(globalErrorHandler);

const PORT = process.env.SERVER_PORT || 6060;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
