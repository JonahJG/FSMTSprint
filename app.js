// *********************************
// Filename: app.js
// Author: Jonah Greening
// Purpose: Main code to run the initialization application CLI
// Date: 06-20-2023
// Date revised: 06-23-2023
// **********************************

global.DEBUG = false;

const fs = require("fs");
const path = require("path");
const { initApp } = require("./init.js");
const { configApp } = require("./config.js");
const { tokenApp } = require("./token.js");
const logEvents = require("./logEvents.js");

global.DEBUG = false;

// Slicing the first two arguments off the array, leaving only the arguments that are passed to the app
const myArgs = process.argv.slice(2);

// Using the first argument as the command and ? to check if it is null or undefined
const command = myArgs[0]?.toLowerCase();

// Using a switch statement to determine which command was passed to the app
try {
  switch (command) {
    // If the command is init or i, run the initializeApp() function
    case "init":
    case "i":
      if (DEBUG) console.log(myArgs[0], "- initialize the app.");
      logEvents("app", "info", `Command received: ${myArgs[0]}`);
      initApp();
      break;

    // If the command is config or c, run the configApp() function
    case "config":
    case "c":
      if (DEBUG) console.log(myArgs[0], "- display the configuration file.");
      logEvents("app", "info", `Command received: ${myArgs[0]}`);
      configApp();
      break;

    // If the command is token or t, run the tokenApp() function
    case "token":
    case "t":
      if (DEBUG) console.log(myArgs[0], "- handle user tokens.");
      logEvents("app", "info", `Command received: ${myArgs[0]}`);
      tokenApp();
      break;

// If the command is server or s, log the server initialization event and serve the index.html file
case "server":
case "s":
      if (DEBUG) console.log(myArgs[0], "- executing server.js");
      logEvents("app", "info", "server has been initialized");
      require("./server.js");
      break;

  case "help":
  case "h":
    if (DEBUG) console.log(myArgs[0], "- display the help file.");
    // display the apphelp.txt file
    const helpFilePath = path.join(__dirname, "help/apphelp.txt");
    fs.readFile(helpFilePath, (error, data) => {
      if (DEBUG && error) throw error;
      if (!error) console.log(data.toString());
      logEvents("app", "info", "displaying the help file.");
    });
    break;

    // If the command is --server, execute server.js
    case "--server":
    case "--s":
      if (DEBUG) console.log(myArgs[0], "- executing server.js");
      logEvents("app", "info", `Command received: ${myArgs[0]}`);
      require("./server.js");
      break;

    // Default case for invalid commands
    default:
      if (DEBUG) console.log("Invalid command:", myArgs[0]);
      logEvents("app", "error", `Invalid command: ${myArgs[0]}`);
      const usageFilePath = path.join(__dirname, "usage.txt");
      try {
        const data = fs.readFileSync(usageFilePath, "utf8");
        console.log(data.toString());
        logEvents("app", "info", "Usage file displayed");
      } catch (error) {
        // error handling for when an error occurs while reading the usage file
        console.error("Error occurred while reading the usage file:", error);
        logEvents("app", "error", "Error occurred while reading the usage file: " + error);
      }
      break;
  }
} catch (error) {
  // error handling for when an unexpected error occurs 
  console.error("An unexpected error occurred:", error);
  logEvents("app", "error", "An unexpected error occurred: " + error);
}
