// End-to-End Test Requirements for the Register Endpoint
// The goal is to ensure the POST /auth/register endpoint works correctly by performing end-to-end tests. The tests should cover successful user registration, validation errors, and database constraints.
const request = require('supertest');
const app = require('../server.js'); 
const { Pool } = require('pg');


jest.mock('pg', () => {
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
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("should register user successfully with default organisation", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "123456789"
    };

    pool.query
      .mockResolvedValueOnce({ rows: [{ userId: 1, ...userData }] })
      .mockResolvedValueOnce({
        rows: [{ orgid: 1, name: "John's Organisation", description: null }],
      }) 
      .mockResolvedValueOnce({});

    const response = await request(app)
      .post("/auth/register")
      .send(userData)
      .expect(201);

    // expect(response.body.user).toEqual(expect.objectContaining(userData));
    expect(response.body.organization.name).toBe("John's Organisation");
    // expect(response.body.token).toBeDefined();
  });
});
