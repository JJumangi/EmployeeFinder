const inquirer = require("inquirer");
const fs = require('fs');
const mysql = require("mysql2");
const express = require('express');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jon1234",
  database: "employees"
},
console.log('database: employee, connected'));

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
        viewDepartments();
        break;
      case "view_roles":
       viewRoles();
        break;
      case "view_employees":
       viewEmployees();
        break;
      case "add_department":
       addDepartment();
        break;
      case "add_role":
       addRole();
        break;
      case "add_employee":
        addEmployee();
        break;
      case "update_employee":
        updateEmployee();
      default:
        exit();
    }
  })
};

//VIEW SECTION
//all departments
async function viewDepartments() {
  try {
    const [rows] = await connection.promise().query('SELECT * FROM department');
    console.log('Departments:');
    console.table(rows);
    start();
  } catch (error) {
    console.error('Error', error);
    start();
  }
};

//all roles
async function viewRoles() {
  try {
    const [rows] = await connection.promise().query('SELECT * FROM role');
    console.log('Roles:');
    console.table(rows);
    start();
  } catch (error) {
    console.error('Error', error);
    start();
  }
};

//all employees
async function viewEmployees() {
  try {
    const [rows] = await connection.promise().query('SELECT * FROM role');
    console.log('Employee:');
    console.table(rows);
    start();
  }catch (error) {
    console.error('Error', error);
    start();
  }
};

//ADD SECTION

//add department
async function addDepartment() {
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
    await connection.promise().query('INSERT INTO department SET ?', { name: answer.name });
    console.log('Department added successfully!');
    start();
  } catch (error) {
    console.error('Error adding department:', error);
    start();
  }
}

//add role
async function addRole() {
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
    await connection.promise().query('INSERT INTO role SET ?', {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.departmentId,
    });
    console.log('Role added successfully!');
    start();
  } catch (error) {
    console.error('Error adding role:', error);
    start();
  }
}

//add an employee
async function addEmployee() {
  try {
    const [roles] = await connection.promise().query('SELECT * FROM role');
    const [employees] = await connection.promise().query('SELECT * FROM employee');
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
      await connection.promise().query('INSERT INTO employee SET?'), {
        first_name: answer.firstName,
        last_name: answer.lastName,
        role_id: answer.role_id,
      }]);
      console.log('This employee has been added to the system.');
      start();
  } catch (error) {
    console.error('Error, cannot add employee.', error);
    start();
  }
}
//update employee
async function updateEmployee() {
  try {
    const [employees] = await connection.promise().query('SELECT * FROM employee');
    const [role] = await connection.promise().query('SELECT * FROM role');
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
    await connection.promise().query('UPDATE employee SET role_id = ? WHERE id = ?', [answer.role_id, answer.employee_id]);
    console.log('Employees role has been updated.');
    start();
  } catch (error) {
    console.error('Error, try again', error);
    start();
  }
};    
      start();