import express from "express";
import authorizeToken from "../middleware/authorizeToken.js";
import db from "../db/index.js";
const router = express.Router();

router.get("/:id", authorizeToken, async (req, res) => {
  const {
    user: { id },
  } = req.user;

  try {
    const { rows } = await db.query("SELECT * FROM users WHERE userid = $1", [id]);

    delete rows[0].password

    return res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: "hello"
      );
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
});

export default router;
