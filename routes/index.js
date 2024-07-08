import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from "../db/index.js";
import authorizeToken from "../middleware/authorizeToken.js";
import generateToken from "../utils/generateToken.js";
import {
  login_validation,
  register_validation,
} from "../middleware/combinedValidation.js";
import { matchedData } from "express-validator";

// console.log(uuid());

const router = express.Router();

router.post("/register", register_validation, async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password: plainTextPassword,
  } = matchedData(req);
  const { phone } = req.body;
  const orgName = `${firstName}'s Organization`;

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPassword = bcrypt.hashSync(plainTextPassword, salt);

  try {
    //Create user
    const user = await db.query(
      "INSERT INTO users (userId, firstName, lastName, email, password, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [uuid(), firstName, lastName, email, hashPassword, phone]
    );

    //Create organization
    const organization = await db.query(
      "INSERT INTO organization(orgId, name, description) VALUES ($1, $2, $3) RETURNING *",
      [uuid(), orgName, `${firstName}'s Organization`]
    );

    // MANY TO MANY RELATIONSHIP between userId and orId  to user_organization
    const { userid } = user.rows[0];
    const { orgid } = organization.rows[0];

    await db.query(
      "INSERT INTO user_organization (userId, orgId) VALUES ($1, $2)",
      [userid, orgid]
    );

    const token = generateToken({
      user: {
        id: userid,
        email: user.rows[0].email,
      },
    });

    // unsuccessful registration
    if (!(user.rows.length > 0)) {
      return res.status(400).json({
        status: "Bad request",
        message: "Registration unsuccessful",
        statusCode: 400,
      });
    }

    const {
      userid: user_id,
      firstname,
      lastname,
      email: userEmail,
      phone: my_phone,
    } = user.rows[0];

    return res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          userId: user_id,
          firstName: firstname,
          lastName: lastname,
          email: userEmail,
          phone: my_phone,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
      statusCode: 500,
    });
  }
});

router.post("/login", login_validation, async (req, res) => {
  const { email, password: plainTextPassword } = matchedData(req);

  try {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (
      !(rows.length > 0) ||
      !bcrypt.compareSync(plainTextPassword, rows[0].password)
    ) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    const token = generateToken({
      user: {
        id: rows[0].userid,
        email: rows[0].email,
      },
    });

    const { userid, firstname, lastname, email: userEmail, phone } = rows[0];

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          userId: userid,
          firstName: firstname,
          lastName: lastname,
          email: userEmail,
          phone,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
      statusCode: 500,
    });
  }
});


export default router;
