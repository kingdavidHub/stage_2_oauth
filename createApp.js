import dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.ENV` });
import express from "express";
import db from "./db/index.js";
import createRoute from "./routes/index.js";
import userRoute from "./routes/user.js";
import organizationRoute from "./routes/organisations.js";
import morgan from "morgan";

export function createApp() {
  const app = express();

  // Middleware
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", async (req, res) => {
    try {
      const { rows } = await db.query("SELECT * FROM users");
      return res.status(200).json({
        data: rows,
      });
    } catch (error) {
      console.log(error);
    }
  });

  app.use("/auth", createRoute);
  app.use("/api/users", userRoute);
  app.use("/api/organisations", organizationRoute);

  app.get("*", (req, res) => {
    return res.status(404).json({
      message: "Route not found",
    });
  });

  // global error handler
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
    next();
  });


  return app;
}
