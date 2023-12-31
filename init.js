// *********************************
// Filename: init.js
// Author: Jonah Greening
// Purpose: Main code to run the initialization application CLI
// Date: 06-20-2023
// Date revised: 06-23-2023
// **********************************

// Global imports
const fs = require("fs");
const path = require("path");
const logEvents = require("./logEvents")
const expirationTimestamp = Date.now() + 3 * 24 * 60 * 60 * 1000; // Set expiration to 3 days

// Slicing the first two arguments off the array, leaving only the arguments that are passed to the app
const myArgs = process.argv.slice(3);

// createFolders function to create the folders needed for the application
function createFolders() {
  const folders = ["json", "logs", "routes", "views"];
  let createdCount = 0;

  folders.forEach((folder) => {
    try {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
        logEvents("init", "info", `created folder: ${folder}`);
        createdCount++;
      }
    } catch (error) {
      logEvents("init", "error", `error occurred while creating folder: ${folder}`);
      if (global.DEBUG) {
        logEvents("init", "error", error);
      }
    }
  });

  logEvents("init", "info", `total folders created: ${createdCount}`);
}

// createFile function to create the files needed for the application
function createFile() {
  const jsonFolder = "json";
  const configFilePath = path.join(jsonFolder, "config.json");
  const tokensFilePath = path.join(jsonFolder, "tokens.json");

  let createdCount = 0;

  // Create the config.json file if it doesn't exist
  try {
    if (!fs.existsSync(configFilePath)) {
      const configData = {
        name: "ConfigCLI",
        version: "1.0.0",
        description: "A simple CLI for the app",
        main: "app.js",
        superuser: "admin",
        database: "Nothing found here ¯\\_(ツ)_/¯ ",
      };
      fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 4));
      logEvents("init", "info", `created file: ${configFilePath}`);
      createdCount++;
    }
  } catch (error) {
    logEvents("init", "error", `error occurred while creating file: ${configFilePath}`);
    if (global.DEBUG) {
      logEvents("init", "error", error);
    }
  }

  // Create the tokens.json file if it doesn't exist
  try {
    if (!fs.existsSync(tokensFilePath)) {
      const tokensData = {
        tokens: [
          {
            username: "admin",
            email: "admin@example.com",
            token: "a6hf6s",
            phone: "11231231234",
            timestamp: Date.now(),
            expiration: expirationTimestamp
          },
        ],
      };
      fs.writeFileSync(tokensFilePath, JSON.stringify(tokensData, null, 4));
      logEvents("init", "info", `created file: ${tokensFilePath}`);
      createdCount++;
    }
  } catch (error) {
    logEvents("init", "error", `error occurred while creating file: ${tokensFilePath}`);
    if (global.DEBUG) {
      logEvents("init", "error", error);
    }
  }

  logEvents("init", "info", `total files created: ${createdCount}`);
}

// Using the first argument as the command and using ? to check if the argument is null or undefined
const command = myArgs[0]?.toLowerCase();

// Using a switch statement to determine which command was passed to the app
function initApp() {
  switch (command) {
    case "--all":
      // If the command is "--all", initialize the application by creating both folders and files
      logEvents("init", "info", "initializing application");
      createFolders();
      createFile();
      break;

    case "--cat":
      // If the command is "--cat", create only the necessary files
      logEvents("init", "info", "creating files");
      createFile();
      break;

    case "--mkdir":
      // If the command is "--mkdir", create only the necessary folders
      logEvents("init", "info", "creating folders");
      createFolders();
      break;

    case "--help":
      // If the command is "--help", display the help file
      logEvents("init", "info", "displaying help file");
      const helpFilePath = path.join(__dirname, "help/inithelp.txt");
      try {
        const data = fs.readFileSync(helpFilePath, "utf8");
        console.log(data);
      } catch (error) {
        logEvents("init", "error", "error occurred while reading the help file");
        if (global.DEBUG) {
          logEvents("initApp", "error", error);
        }
      }
      break;

    default:
      // For any other command, display the usage file
      logEvents("init", "info", "displaying usage file");
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


