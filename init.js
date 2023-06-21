// *********************************
// Filename: init.js
// Author: Jonah Greening
// Purpose: Initialize the application
// Date: 06-21-2023
// Date revised:
// **********************************

// Global imports
const fs = require("fs");
const path = require("path");
global.DEBUG = true;

// Slicing the first two arguments off the array, leaving only the arguments that are passed to the app
const myArgs = process.argv.slice(3);

// createFolders function to create the folders needed for the application
function createFolders() {
  const folders = ['json', 'logs', 'routes'];
  folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
      console.log(`Created folder: ${folder}`);
    }
  });
}

// createFile function to create the files needed for the application
function createFile() {
  const jsonFolder = 'json';
  const configFilePath = path.join(jsonFolder, 'config.json');
  const tokensFilePath = path.join(jsonFolder, 'tokens.json');

  // Create the config.json file if it doesn't exist
  if (!fs.existsSync(configFilePath)) {
    const configData = { name: "ConfigCLI", version: "1.0.0", description: "A simple CLI for the app", main: "app.js", superuser: "admin", database: 'Nothing found here ¯\_(ツ)_/¯ ' };
    fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 4));
    console.log(`Created file: ${configFilePath}`);
  }

  // Create the tokens.json file if it doesn't exist
  if (!fs.existsSync(tokensFilePath)) {
    const tokensData = { token: 'abc123' }; // Example data for tokens.json
    fs.writeFileSync(tokensFilePath, JSON.stringify(tokensData, null, 4));
    console.log(`Created file: ${tokensFilePath}`);
  }
}

// Using the first argument as the command and using ? to check if the argument is null or undefined
const command = myArgs[0]?.toLowerCase();

// Using a switch statement to determine which command was passed to the app
function initApp() {
  switch (command) {
    case "--all":
      console.log("Initializing application...");
      createFolders();
      createFile();
      console.log("Initialization complete.");
      break;

    case "--cat":
      console.log("Creating files...");
      createFile();
      console.log("Files created.");
      break;

    case "--mkdir":
      console.log("Creating folders...");
      createFolders();
      console.log("Folders created.");
      break;

    case "--help":
    case "--h":
      console.log("Displaying help file...");
      const helpFilePath = path.join(__dirname, "help.txt");
      fs.readFile(helpFilePath, (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
      break;

    default:
      console.log("Displaying usage file...");
      const usageFilePath = path.join(__dirname, "usage.txt");
      fs.readFile(usageFilePath, (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
  }
}

module.exports = {
  initApp,
  createFolders,
  createFile,
};
