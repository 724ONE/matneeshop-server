const mysql = require("mysql2");

const isProduction = process.env.NODE_ENV === "production";
const initializeDatabase = () => {
  const db = mysql.createConnection({
    ...(isProduction
      ? {
          socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
        }
      : {
          host: process.env.DB_HOST,
          port: 3306,
        }),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db.connect((err) => {
    if (err) {
      console.error("MySQL connection error:", err);
      process.exit(1);
    }
    console.log("Connected to the MySQL database");
  });

  return db;
};

module.exports = { initializeDatabase };
