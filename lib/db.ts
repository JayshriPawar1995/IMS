// lib/db.ts
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost", // or your DB host
  user: "root",      // your DB user
  password: "",      // your DB password
  database: "zaytoon_lms", // your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool; 
 