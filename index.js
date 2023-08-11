const inquirer = require("inquirer");
const fs = require('fs');
const mysql = require("mysql2");
const express = require('express');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jon1234",
  database: "employees_db"
},
console.log('database: employee_db, connected'));

connection.connect(function (err) {
  if (err) throw err;
});

/*
  There are a lot of menu items presented to users in this app. The only real way you cam manage them 
  is by creating a function to handle each one.

  I'm giving you a bit of starter code below.
*/ 


function start(connection){
  inquirer
    .prompt([
    {   
      type: "list",
      message: "Choose an item from the list below:",
      name: "option", 
      choices: [
      {
        name:"View all departments",
        value: "view_departments"
      },
      {
        name: "View all roles",
        value: "view_roles"
      },
      {
        name: "View all employees",
        value: "view_employees"
      },
      {
        name: "Add a department",
        value: "add_department"
      },
      {
        name: "Add a role",
        value: "add_role"
      },
      {
        name: "Add an employee",
        value: "add_employee"
      },
      {
        name: "Update employee role",
        value: "update_employee"
      },
      {
      name: "Exit program",
      value: "exit"
      }
      ]
    }
  ]).then( response => {
    switch(response.option){
      case "view_departments":
        viewDepartments(connection);
        break;
      case "view_roles":
       viewRoles(connection);
        break;
      case "view_employees":
       viewEmployees(connection);
        break;
      case "add_department":
       addDepartment(connection);
        break;
      case "add_role":
       addRole(connection);
        break;
      case "add_employee":
        addEmployee(connection);
        break;
      case "update_employee":
        updateEmployeeManager(connection);
      default:
        exit();
    }
  })
};

//VIEW SECTION
//all departments
async function viewDepartments(connection) {
  try {
    const [rows] = await connection.query('SELECT * FROM departments');
    console.log('Departments:');
    console.table(rows);
    start(connection);
  } catch (error) {
    console.error('Error', error);
    start(connection);
  }
};

//all roles
async function viewRoles(connection) {
  try {
    const [rows] = await connection.query('SELECT * FROM roles');
    console.log('Roles:');
    console.table(rows);
    start(connection);
  } catch (error) {
    console.error('Error', error);
    start(connection);
  }
};

//all employees
async function viewEmployees(connection) {
  try {
    const [rows] = await connection.query('SELECT * FROM roles');
    console.log('Employyes:');
    console.table(rows);
    start(connection);
  }catch (error) {
    console.error('Error', error);
    start(connection);
  }
};

//ADD SECTION

//add department
async function addDepartment(connection) {
  try {
    const input = await inquirer.prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Enter the name of department you want to add:',
        validate: (value) => {
          if (value.trim()) {
            return true;
          }
          return 'Enter department name.';
        },
      },
    ]);

    //add new department to db
    await connection.query('INSERT INTO departments SET ?', { name: answer.name });
    console.log('Department added successfully!');
    start(connection);
  } catch (error) {
    console.error('Error adding department:', error);
    start(connection);
  }
}

//add role
async function addRole(connection) {
  try {
    const input = await inquirer.prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Enter role name',
        validate: (value) => {

        }
      }
    ])
  }
}
start()