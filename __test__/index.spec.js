//  npm i --D @types/jest for typeAcquisitionglobally
import dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.ENV` });
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken";

// Token generation - Ensure token expires at the correct time and correct user details is found in token.
describe("token generation", () => {
  const user = { user: { id: "123", email: "test@example.com" } };
  const secret = process.env.JWTSECRET;

  it("should generate token", () => {
    const token = generateToken(user);
    expect(token).toBeDefined();

    const decoded = jwt.verify(token, secret);
    expect(decoded).toMatchObject(user);
    expect(decoded).toBeDefined();

    // user details found in token
    expect(decoded.user.id).toBe(user.user.id);
    expect(decoded.user.email).toBe(user.user.email);
  });

  it("token should expire at the correct time", (done) => {
    // dummy expiryToken
    const expires_sec_token = jwt.sign(user, secret, {
      expiresIn: "1s",
    });

    // token should expire at the correct time using setTimeout
    setTimeout(() => {
      expect(() => {
        jwt.verify(expires_sec_token, secret);
      }).toThrow(jwt.JsonWebTokenError);
      done();
      // Timeout exceed the expiry time
    }, 2000);
  });
});

jest.mock("pg", () => {
  const mClient = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mClient) };
});

import { Pool } from "pg";
import checkOrgAccess from "../middleware/checkOrganization";
const pool = new Pool();

// Organisation - Ensure users can’t see data from organisations they don’t have access to.
describe("organisations", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      const dummyUserId = "1"; // mock user id
      req.user = { user: { id: dummyUserId } };
      next();
    });
    app.get("/organizations/:orgId", checkOrgAccess, (req, res) => {
      res.status(200).json({ message: "Success" });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should allow access if user is part of organization", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          userid: "1",
          orgid: "2",
        },
      ],
    });

    const response = await request(app).get("/organizations/2");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Success" });
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM user_organization WHERE userid = $1 AND orgid = $2",
      ["1", "2"]
    );
  });

  it("should deny access if user is not part of the organization", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get("/organizations/2");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Access denied" });
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM user_organization WHERE userid = $1 AND orgid = $2",
      ["1", "2"]
    );
  });
});

