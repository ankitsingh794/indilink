const mysql = require("mysql");
const dbConfig = require("./db.config.js");
const { table } = require("./table.js");

const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: 3306, 
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");

  function createTable(query) {
    const createTableSQL = query;

    connection.query(createTableSQL, (err) => {
      if (err) {
        console.error(`Error creating table:`, err);
      } else {
        console.log(`Table created successfully`);
      }
    });
  }

  function insertInitialData() {
    const query =
      "INSERT INTO `users` (`email`, `password`, `user_type`) VALUES ('admin@gmail.com', '$2a$10$4X0Vbh0SG2SZ9QnWoD67Muf/hFHO0nG31N7lbBnSwe39ZwF9lsYZK', 'admin');";
    const checkAdmin = "SELECT * FROM users WHERE email='admin@gmail.com'";
    connection.query(checkAdmin, (err, result) => {
      if (err) {
        console.error("Error checking admin user:", err);
      } else {
        if (result.length === 0) {
          connection.query(query, (err) => {
            if (err) {
              console.error("Error inserting admin user:", err);
            } else {
              console.log("Admin user inserted successfully");
            }
          });
        }
      }
    });
  }

  table.forEach((e) => {
    const checkTableSQL = `SHOW TABLES LIKE '${e.tableName}'`;

    connection.query(checkTableSQL, (err, results) => {
      if (err) {
        console.error(`Error checking ${e.tableName} table:`, err);
      } else {
        if (results.length === 0) {
          createTable(e.query);
        } else {
          console.log(`${e.tableName} table already exists`);
          if (e.tableName === 'users') {
            insertInitialData();
          }
        }
      }
    });
  });
});

module.exports = connection;
