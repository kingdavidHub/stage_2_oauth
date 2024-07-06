import dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.ENV` });
import pg from "pg";
const { Pool } = pg;

// lOCAL DB
// const pool = new Pool();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});



export default {
  query: (text, params) => pool.query(text, params),
};
