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


function start(){
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
        updateEmployee(connection);
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
    //get department info
    const answer = await inquirer.prompt([
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
    //get role info
    const answer = await inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter title for new role',
        validate: (value) => {
          if (value.trim()) {
            return true;
          }
          return 'Must enter a role tile.';
        },
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter a salary for this role',
        validate: (value) => {
          const valid = !isNan(parseFloat(value));
          return valid || 'enter a salary for this role.'
        },
      },
      {
        name: 'department',
        type: 'list',
        message: 'which department will this role fall under?',
        choices: departments.map((department) => ({
          name: department.name,
          value: department.id,
        })),
      },
    ]);

    //add new role to db
    await connection.query('INSERT INTO roles SET ?', {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.departmentId,
    });
    console.log('Role added successfully!');
    start(connection);
  } catch (error) {
    console.error('Error adding role:', error);
    start(connection);
  }
}

//add an employee
async function addEmployee(connection) {
  try {
    const [roles] = await connection.query('SELECT * FROM roles');
    const [employees] = await connection.query('SELECT * FROM employees');
    //get employee info
    const answer = await inquirer.prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'Enter first name:',
        validate: (value) => {
          if (value.trim()) {
            return true;
          }
          return 'Enter first name.';
        },
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'Enter last name:',
        validate: (value) => {
          if (value.trim()) {
            return true;
          }
          return 'Enter last name.';
        },
      },
      {
        name: 'roleId',
        type: 'list',
        messaging: 'Which role does this employee have?',
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
      })),
      },
    //add new employee to db
      await connection.query('INSERT INTO employees SET?'), {
        first_name: answer.firstName,
        last_name: answer.lastName,
        role_id: answer.role_id,
      }]);
      console.log('This employee has been added to the system.');
      start(connection);
  } catch (error) {
    console.error('Error, cannot add employee.', error);
    start(connection);
  }
}
//update employee
async function updateEmployee(connection) {
  try {
    const [employees] = await connection.query('SELECT * FROM employees');
    const [roles] = await connection.query('SELECT * FROM roles');
    const answer = await inquirer.prompt([
      {
        name: 'employee_id',
        type: 'list',
        message: 'Which employee do you want to update?',
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      },
      {
        name: 'role_id',
        type: 'list',
        message: 'What is this employees new role?',
        choices: role.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
    ]);
    //update employees new role
    await connection.query('UPDATE employees SET role_id = ? WHERE id = ?', [answer.role_id, answer.employee_id]);
    console.log('Employees role has been updated.');
    start(connection);
  } catch (error) {
    console.error('Error, try again', error);
    start(connection);
  }
};    
      start();