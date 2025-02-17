const { Pool } = require("pg");

// Load .env file
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER, 
  host: process.env.POSTGRES_HOST, 
  database: process.env.POSTGRES_DB, 
  password: process.env.POSTGRES_PASSWORD, 
  port: process.env.POSTGRES_PORT,
});

const connectPostgresDB = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected successfully");
  }
  catch (error) {
    console.log("PostgreSQL connected failed", error);
  }
};

module.exports = connectPostgresDB;
