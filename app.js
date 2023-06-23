// *********************************
// Filename: app.js
// Author: Jonah Greening
// Purpose: Main code to run the initialization application CLI
// Date: 06-20-2023
// Date revised: 06-22-2023
// **********************************

const fs = require("fs");
const path = require("path");
const { initApp } = require("./init.js");
const { configApp } = require("./config.js");
const { tokenApp } = require("./token.js");
const logEvents = require("./logEvents");

global.DEBUG = true;

// Slicing the first two arguments off the array, leaving only the arguments that are passed to the app
const myArgs = process.argv.slice(2);

// Using the first argument as the command and ? to check if it is null or undefinedS
const command = myArgs[0]?.toLowerCase();

// Using a switch statement to determine which command was passed to the app
switch (command) {
  // If the command is init or i, run the initializeApp() function
  case "init":
  case "i":
    if (DEBUG) console.log(myArgs[0], "- initialize the app.");
    initApp();
    break;

  // If the command is config or c, run the configApp() function
  case "config":
  case "c":
    if (DEBUG) console.log(myArgs[0], "- display the configuration file.");
    configApp();
    break;

  // If the command is token or t, run the tokenApp() function
  case "token":
  case "t":
    if (DEBUG) console.log(myArgs[0], "- handle user tokens.");
    tokenApp();
    break;

  case "--help":
  case "--h":
    if (DEBUG) console.log(myArgs[0], "- display the help file.");
    // display the help.txt file
    const helpFilePath = path.join(__dirname, "apphelp.txt");
    fs.readFile(helpFilePath, (error, data) => {
      if (DEBUG && error) throw error;
      if (!error) console.log(data.toString());
    });
    break;

  default:
    if (DEBUG) console.log("Invalid command:", myArgs[0]);
    const usageFilePath = path.join(__dirname, "usage.txt");
    fs.readFile(usageFilePath, (error, data) => {
      if (DEBUG && error) throw error;
      if (!error) console.log(data.toString());
    });
    break;
}
