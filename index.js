const inquirer = require("inquirer");
const connection = require("./config/connection");

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
        updateEmployeeManager();
      default:
        exit();
    }
  })
}

function viewDepartments() {
  var query = connection.query(
      "SELECT name as 'Department Name', deptId as 'Department ID' from department ORDER BY name",
      function (err, data) {
          if (err) throw err;
          console.table(data);
          continuePrompt();
      }
  )
}

function viewRoles () {
  var query = connection.query(
    "SELECT roleId as 'Role ID', title as 'Role', salary as 'Salary', department_id as 'Department ID' from role",
    function (err, data) {
        if (err) throw err;
        console.table(data);
        continuePrompt();
    })
}


// start();