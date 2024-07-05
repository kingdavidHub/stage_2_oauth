import pg from "pg";
const { Pool } = pg;

const pool = new Pool();


export default {
  query: (text, params) => pool.query(text, params),
};
