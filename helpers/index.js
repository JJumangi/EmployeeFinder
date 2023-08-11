

/* 

Sometimes you will need to take an array of data from the database, and have inquirer 
display the results as choices for the user to choose from. For instance, you may provide a 
list of employees and the user must select one. Here's how you do that:

*/


// Let's say the variable below represents the data we got back from mysql 
const arrayOfStudents = [];

// Now let's make the inquirer part: 

inquirer.prompt([
  {
    type: "list", 
    message: "Choose a student from the list below:", 
    name: "selectedStudentId",
    choices: arrayOfStudents.map(({ id, name }) => ({
      name: name,
      value: id
    })).then( response => {
      // response.selectedStudentId = id of the student chosen by the user+
    })
  }
]);

/* 

  The code above takes the array of all the student info and makes a new array for inquirer; 
  for each student we display their name, and we also provide an id value. When the student 
  chooses by name, the id value is what gets put into the response object.