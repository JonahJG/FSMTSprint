// *********************************
// Filename: app.js
// Author: Jonah Greening
// Purpose: Main code to run the initialization application CLI
// Date: 06-20-2023
// Date revised:
// **********************************


// Global imports
const fs = require("fs");
const path = require("path");
const { initApp } = require("./init.js");
const { configApp } = require("./config.js");


global.DEBUG = true;

// Slicing the first two arguments off the array, leaving only the arguments that are passed to the app

const myArgs = process.argv.slice(2);


// Using the first argument as the command

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
    if (DEBUG) console.log(myArgs[0], "- generate a user token.");
    //tokenApp();
    break;

case "--help":
case "--h":
    if (DEBUG) console.log(myArgs[0], "- display the help file.");
    // display the help.txt file
    const helpFilePath = path.join(__dirname, "help.txt");
    fs.readFile(helpFilePath, (error, data) => {
        if (error) throw error;
        console.log(data.toString());
    });
    break;

    // If none of the previous cases are met, display the usage.txt file
  default:
    const usageFilePath = path.join(__dirname, "usage.txt");
    fs.readFile(usageFilePath, (error, data) => {
      if (error) throw error;
      console.log(data.toString());
    });
    break;
}

