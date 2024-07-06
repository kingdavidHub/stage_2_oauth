import dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.ENV` });
import express from "express";
import createRoute from "./routes/index.js";
import userRoute from "./routes/user.js";
import organizationRoute from "./routes/organisations.js";
import morgan from "morgan";
import db from "./db/index.js";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  return res.status(200).json({
    message: "Hello, World!, HNG stage 2 OAuth",
  });
});

app.use("/auth", createRoute);
app.use("/api/users", userRoute);
app.use("/api/organisations", organizationRoute);

// test endpoint
app.get("/test", (req, res) => {
  try {
    const { rows } = db.query("SELECT * FROM users");
    return res.status(200).json({
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

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

const PORT = process.env.SERVER_PORT || 6060;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
