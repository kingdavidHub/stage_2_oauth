// End-to-End Test Requirements for the Register Endpoint
// The goal is to ensure the POST /auth/register endpoint works correctly by performing end-to-end tests. The tests should cover successful user registration, validation errors, and database constraints.

// tests/auth.spec.js
// const request = require("supertest");
import request from "supertest";
import { Pool } from "pg";
import { createApp } from "../createApp.js";

jest.mock("pg", () => {
  const mClient = {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn(),
      release: jest.fn(),
    }),
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mClient) };
});

const pool = new Pool();

describe("register endpoint /auth/register", () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register user successfully with default organisation", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "123456789",
    };

    // 3 queries should be called for user, organization and user_organization so we wont have 500 error
    pool.query
      .mockResolvedValueOnce({ rows: [{ userid: "1", ...userData }] })
      .mockResolvedValueOnce({
        rows: [{ orgid: "1", name: "John's Organisation", description: null }],
      })
      .mockResolvedValueOnce({});

    const response = await request(app)
      .post("/auth/register")
      .send(userData)
      .expect(201);

    const {
      data: { user, accessToken },
    } = response.body;

    // getting user successfully
    // console.log(user);

    expect(user).toEqual(
      expect.objectContaining({
        userid: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "123456789",
      })
    );
    expect(accessToken).toBeDefined();
    // db query for user, organization and user_organization
    expect(pool.query).toHaveBeenCalledTimes(3);
  });

  it("should return validation error for missing fields", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ firstName: "John" })
      .expect(422);
    expect(response.body.status).toBe(
      "Validation error: Missing required fields"
    );
  });

  it("should return error for database constraint violations", async () => {
    // remove default console error calls
    const originalConsoleError = console.error;

    console.error = jest.fn();

    pool.query.mockRejectedValueOnce(
      new Error("duplicate key value violates unique constraint")
    );

    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.oe@example.com",
      password: "password123",
      phone: "123456789",
    };

    const response = await request(app)
      .post("/auth/register")
      .send(userData)
      .expect(500);

    expect(response.body.message).toBe(
      "duplicate key value violates unique constraint"
    );

    console.error = originalConsoleError;
  });
});
