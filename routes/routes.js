import express from "express";
import createRoute from "../routes/index.js";
import userRoute from "../routes/user.js";
import organizationRoute from "../routes/organisations.js";

const router = express.Router();

router.use("/auth", createRoute);
router.use("/auth", userRoute);
router.use("/auth", organizationRoute);

export default router;