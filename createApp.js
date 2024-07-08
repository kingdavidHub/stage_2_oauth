import dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.ENV` });
import express from "express";
import db from "./db/index.js";
import mainRoute from "./routes/routes.js";
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

  app.use("/api", mainRoute);

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
