const mysql = require("mysql2");
const express = require('express');

// // Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());


// const PORT = process.env.PORT || 3001;
// const app = express();

//connect to db
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jon1234",
  database: "employees_db"
});


connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
