const inquirer = require("inquirer");


function displayAllDepartments(data){
  console.log("\n");
  console.table(data);
}


function viewDepartments(data) {
  console.log("\n");
  console.table(data);
  }

module.exports = {
  displayAllDepartments
}