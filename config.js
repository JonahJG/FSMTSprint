// *********************************
// Filename: config.js
// Author: Jonah Greening
// Purpose: Code for the config command
// Date: 06-21-2023
// Date revised: 06-22-2023
// **********************************

const fs = require("fs");
const path = require("path");
global.DEBUG = true;

// Slicing the first arguments off the array, leaving only the arguments that are passed to the app
const myArgs = process.argv.slice(3);

// Using the first argument as the command
const command = myArgs[0]?.toLowerCase();

// Using the second and third arguments as the key and value
const key = myArgs[1];
const value = myArgs[2];

// Using a switch statement to determine which command was passed to the app

function displayApp() {
  const jsonFolder = 'json';
  const configFilePath = path.join(jsonFolder, 'config.json');

  // Check if the config.json file exists
  if (fs.existsSync(configFilePath)) {
    try {
      // Read the contents of the config.json file
      fs.readFile(configFilePath, (error, data) => {
        if (error) throw error;

        try {
          // Parse the JSON data
          const configData = JSON.parse(data);

          // Display the configuration
          console.log("Current Configuration:");
          console.log(configData);
        } catch (parseError) {
          console.error("Error occurred while parsing the configuration file:", parseError);
        }
      });
    } catch (readError) {
      console.error("Error occurred while reading the configuration file:", readError);
    }
  } else {
    console.log("Config file not found.");
  }
}

function resetConfig() {
  const jsonFolder = 'json';
  const configFilePath = path.join(jsonFolder, 'config.json');

  // Check if the config.json file exists
  if (fs.existsSync(configFilePath)) {
    try {
      // Delete the config.json file
      fs.unlinkSync(configFilePath);
      console.log("Configuration reset.");
    } catch (error) {
      console.error("Error occurred while resetting the configuration:", error);
    }
  } else {
    console.log("Config file not found.");
  }
}

function setConfig(key, value) {
  const jsonFolder = 'json';
  const configFilePath = path.join(jsonFolder, 'config.json');

  // Check if the config.json file exists
  if (fs.existsSync(configFilePath)) {
    try {
      // Read the contents of the config.json file
      fs.readFile(configFilePath, (error, data) => {
        if (error) throw error;

        try {
          // Parse the JSON data
          const configData = JSON.parse(data);

          // Update the specific configuration setting
          configData[key] = value;

          // Write the updated configuration back to the file
          fs.writeFile(configFilePath, JSON.stringify(configData, null, 4), (error) => {
            if (error) throw error;
            console.log("Configuration updated.");
          });
        } catch (parseError) {
          console.error("Error occurred while parsing the configuration file:", parseError);
        }
      });
    } catch (readError) {
      console.error("Error occurred while reading the configuration file:", readError);
    }
  } else {
    console.log("Config file not found.");
  }
}

function configApp() {
  switch (command) {
    case "--show":
      displayApp();
      break;
    case "--reset":
      resetConfig();
      break;
    case "--set":
      if (key && value) {
        setConfig(key, value);
      } else {
        console.log("Please provide a valid key-value pair to set a configuration setting.");
      }
      break;
    case "--help":
        console.log("Displaying the help file:");
        const helpFilePath = path.join(__dirname, "help/confighelp.txt");
              fs.readFile(helpFilePath, (error, data) => {
                if (error) {
                  console.error("Error occurred while reading the help file:", error);
                  return;
                }
                console.log(data.toString());
              });
              break;
    default:
      console.log("Displaying the usage file:");
      const usageFilePath = path.join(__dirname, "views/usage.txt");
      fs.readFile(usageFilePath, (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
      break;
  }
}

module.exports = {
    configApp 
}
