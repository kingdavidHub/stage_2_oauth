import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: `${process.cwd()}/.ENV` });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error("Error executing query:", error.message);
    throw error;
  }
};

export default {
  query,
};
