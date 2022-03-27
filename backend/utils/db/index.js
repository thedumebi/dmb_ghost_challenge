const mysql = require("mysql2/promise");
const db = require("../../models");

const connectDB = (callback) => {
  mysql
    .createConnection({
      user: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || "3306",
      user: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "ABcd12..",
    })
    .then((connection) => {
      connection
        .query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE};`)
        .then((res) => {
          console.info("Database created or successfully checked");
          db.sequelize
            .sync()
            .then(() => {
              console.log("Database Connected");

              callback();
            })
            .catch((err) => console.log("\x1b[31m%s\x1b[0m", err));
        });
    });
};

module.exports = connectDB;
