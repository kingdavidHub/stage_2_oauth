import express from "express";
import { v4 as uuid } from "uuid";
import authorizeToken from "../middleware/authorizeToken.js";
import db from "../db/index.js";
const router = express.Router();

// gets all your organisations the user belongs to or created. If a user is logged in properly, they can get all their organisations. They should not get another user’s organisation [PROTECTED].

// SELECT c.course_name, c.description
// FROM courses c
// JOIN enrollments e ON c.course_id = e.course_id
// WHERE e.student_id = 1;

// GET: All organisations a login user belongs to
router.get("/", authorizeToken, async (req, res) => {
  const {
    user: { id },
  } = req.user;

  try {
    const query = `
        SELECT organization.orgid, organization.name, organization.description FROM organization
        JOIN user_organization ON organization.orgid = user_organization.orgId WHERE user_organization.userId = $1
        `;
    const { rows } = await db.query(query, [id]);
    // const { rows } = await db.query(
    //   "SELECT organization.orgid, organization.name, organization.description FROM organization JOIN user_organization ON organization.orgid = user_organization.orgId WHERE user_organization.userId = $1",
    //   [id]
    // );

    return res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: {
        organisations: rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:orgId", authorizeToken, async (req, res) => {
  const { orgId } = req.params;
  const {
    user: { id },
  } = req.user;

  try {
    const query = `
      SELECT organization.orgid, organization.name, organization.description FROM organization
      JOIN user_organization ON organization.orgid = $1 WHERE user_organization.userId = $2
      `;

    const { rows } = await db.query(query, [orgId, id]);

    return res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", authorizeToken, async (req, res) => {
  const { name, description } = req.body;
  const {
    user: { id },
  } = req.user;

  try {
    const { rows } = await db.query(
      "INSERT INTO organization(orgId ,name, description) VALUES ($1, $2, $3) RETURNING *",
      [uuid(), `${name}'s Organization`, description]
    );

    // Insert to user_organizations
    await db.query(
      "INSERT INTO user_organization(userid, orgid) VALUES ($1, $2)",
      [id, rows[0].orgid]
    );

    return res.status(201).json({
      status: "success",
      message: "Organisations created successfully",
      data: rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:orgId/users", authorizeToken, async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  try {
    await db.query(
      "INSERT INTO user_organization(userid, orgid) VALUES ($1, $2)",
      [userId, orgId]
    );

    return res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
