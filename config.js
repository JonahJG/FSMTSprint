// *********************************
// Filename: config.js
// Author: Jonah Greening
// Purpose: Code for the config command
// Date: 06-21-2023
// Date revised: 06-23-2023
// **********************************

const fs = require("fs");
const path = require("path");
const logEvents = require("./logEvents");

// Slicing the first arguments off the array, leaving only the arguments that are passed to the app
const myArgs = process.argv.slice(3);

// Using the first argument as the command and ? to check if it is null or undefined
const command = myArgs[0]?.toLowerCase();

// Using the second and third arguments as the key and value
const key = myArgs[1];
const value = myArgs[2];

// Function to display the current configuration
function displayApp() {
  // Logging the event
  logEvents("displayApp", "info", "displayed the configuration");

  const jsonFolder = "json";
  const configFilePath = path.join(jsonFolder, "config.json");

  // Check if the config.json file exists
  if (fs.existsSync(configFilePath)) {
    try {
      // Read the contents of the config.json file
      fs.readFile(configFilePath, (error, data) => {
        if (error) {
          // Error occurred while reading the configuration file
          logEvents("displayApp", "error", "error occurred while reading the configuration file");

          if (DEBUG) {
            console.error("Error occurred while reading the configuration file:", error);
          }

          throw error;
        }

        try {
          // Parse the JSON data
          const configData = JSON.parse(data);

          // Display the configuration
          console.log("Current Configuration:");
          console.log(configData);
        } catch (parseError) {
          // Error occurred while parsing the configuration file
          logEvents("displayApp", "error", "error occurred while parsing the configuration file");

          if (DEBUG) {
            console.error("Error occurred while parsing the configuration file:", parseError);
          }
        }
      });
    } catch (readError) {
      // Error occurred while reading the configuration file
      logEvents("displayApp", "error", "error occurred while reading the configuration file");

      if (DEBUG) {
        console.error("Error occurred while reading the configuration file:", readError);
      }
    }
  } else {
    console.log("Config file not found.");
  }
}

// Function to reset the configuration
function resetConfig() {
  // Logging the event
  logEvents("resetConfig", "info", "reset the configuration");

  const jsonFolder = "json";
  const configFilePath = path.join(jsonFolder, "config.json");

  // Check if the config.json file exists
  if (fs.existsSync(configFilePath)) {
    try {
      // Delete the config.json file
      fs.unlinkSync(configFilePath);
      console.log("Configuration reset.");
    } catch (error) {
      // Error occurred while resetting the configuration
      logEvents("resetConfig", "error", "error occurred while resetting the configuration");

      if (DEBUG) {
        console.error("Error occurred while resetting the configuration:", error);
      }
    }
  } else {
    console.log("Config file not found.");
  }
}

// Function to set a specific configuration setting
function setConfig(key, value) {
  // Logging the event
  logEvents("setConfig", "info", `set configuration key: ${key}, value: ${value}`);

  const jsonFolder = "json";
  const configFilePath = path.join(jsonFolder, "config.json");

  // Check if the config.json file exists
  if (fs.existsSync(configFilePath)) {
    try {
      // Read the contents of the config.json file
      fs.readFile(configFilePath, (error, data) => {
        if (error) {
          // Error occurred while reading the configuration file
          logEvents("setConfig", "error", "error occurred while reading the configuration file");

          if (DEBUG) {
            console.error("Error occurred while reading the configuration file:", error);
          }

          throw error;
        }

        try {
          // Parse the JSON data
          const configData = JSON.parse(data);

          // Update the specific configuration setting
          configData[key] = value;

          // Write the updated configuration back to the file
          fs.writeFile(configFilePath, JSON.stringify(configData, null, 4), (error) => {
            if (error) {
              // Error occurred while writing the configuration file
              logEvents("setConfig", "error", "error occurred while writing the configuration file");

              if (DEBUG) {
                console.error("Error occurred while writing the configuration file:", error);
              }

              throw error;
            }
            console.log("Configuration updated.");
          });
        } catch (parseError) {
          // Error occurred while parsing the configuration file
          logEvents("setConfig", "error", "error occurred while parsing the configuration file");

          if (DEBUG) {
            console.error("Error occurred while parsing the configuration file:", parseError);
          }
        }
      });
    } catch (readError) {
      // Error occurred while reading the configuration file
      logEvents("setConfig", "error", "error occurred while reading the configuration file");

      if (DEBUG) {
        console.error("Error occurred while reading the configuration file:", readError);
      }
    }
  } else {
    console.log("Config file not found.");
  }
}

// Function to handle the configuration app
function configApp() {
  switch (command) {
    case "--show":
      // Display the configuration
      logEvents("configApp", "info", "displaying the configuration");
      displayApp();
      break;
    case "--reset":
      // Reset the configuration
      logEvents("configApp", "info", "resetting the configuration");
      resetConfig();
      break;
    case "--set":
      if (key && value) {
        // Set a specific configuration setting
        logEvents("configApp", "info", `setting configuration key: ${key}, value: ${value}`);
        setConfig(key, value);
      } else {
        console.log("Please provide a valid key-value pair to set a configuration setting.");
      }
      break;
    case "--help":
      // Display the help file
      logEvents("configApp", "info", "displaying the help file");
      console.log("Displaying the help file:");
      const helpFilePath = path.join(__dirname, "help/confighelp.txt");
      fs.readFile(helpFilePath, (error, data) => {
        if (error) {
          // Error occurred while reading the help file
          logEvents("command", "error", "error occurred while reading the help file");

          if (DEBUG) {
            console.error("Error occurred while reading the help file:", error);
          }

          return;
        }
        console.log(data.toString());
      });
      break;
    default:
      // Display the usage file
      logEvents("configApp", "info", "displaying the usage file");
      console.log("Displaying the usage file:");
      const usageFilePath = path.join(__dirname, "views/usage.txt");
      fs.readFile(usageFilePath, (error, data) => {
        if (error) throw error;

        if (DEBUG) {
          console.error("Error occurred while reading the usage file:", error);
        }

        console.log(data.toString());
      });
      break;
  }
}

module.exports = {
  configApp,
};



