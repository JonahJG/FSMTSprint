// *********************************
// Filename: config.js
// Author: Jonah Greening
// Purpose: Code for the config command
// Date: 06-21-2023
// Date revised: 06-22-2023
// **********************************

// Import modules
const fs = require("fs");
const path = require("path");
const logEvents = require("./logEvents");


// Retrieve command-line arguments
const myArgs = process.argv.slice(3);
const command = myArgs[0]?.toLowerCase();
const key = myArgs[1];
const value = myArgs[2];

// Function to asynchronously read a file
function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

// Function to asynchronously write data to a file
function writeFileAsync(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Function to display the application's configuration
async function displayApp() {
  await logEvents("config", "info", "displayed the configuration");

  const jsonFolder = "json";
  const configFilePath = path.join(jsonFolder, "config.json");

  // Check if the configuration file exists
  if (fs.existsSync(configFilePath)) {
    try {
      // Read the configuration file
      const data = await readFileAsync(configFilePath);
      const configData = JSON.parse(data);

      console.log("Current Configuration:");
      console.log(configData);
    } catch (error) {
      // Log and handle any errors that occur during file reading or parsing
      await logEvents("config", "error", "error occurred while reading or parsing the configuration file");
      if (DEBUG) {
        console.error("Error occurred while reading or parsing the configuration file:", error);
      }
    }
  } else {
    console.log("Config file not found.");
  }
}

// Function to reset the configuration
async function resetConfig() {
  await logEvents("config", "info", "resetting the configuration");

  const jsonFolder = "json";
  const configFilePath = path.join(jsonFolder, "config.json");

  // Check if the configuration file exists
  if (fs.existsSync(configFilePath)) {
    try {
      // Delete the configuration file
      await fs.promises.unlink(configFilePath);
      console.log("Configuration reset.");
    } catch (error) {
      // Log and handle any errors that occur while resetting the configuration
      await logEvents("config", "error", "error occurred while resetting the configuration");
      if (DEBUG) {
        console.error("Error occurred while resetting the configuration:", error);
      }
    }
  } else {
    console.log("Config file not found.");
  }
}

// Function to set a configuration key-value pair
async function setConfig(key, value) {
  await logEvents("config", "info", `set configuration key: ${key}, value: ${value}`);

  const jsonFolder = "json";
  const configFilePath = path.join(jsonFolder, "config.json");

  // Check if the configuration file exists
  if (fs.existsSync(configFilePath)) {
    try {
      // Read the configuration file
      const data = await readFileAsync(configFilePath);
      const configData = JSON.parse(data);

      // Update the specified key with the new value
      configData[key] = value;

      // Write the updated configuration data back to the file
      await writeFileAsync(configFilePath, JSON.stringify(configData, null, 4));
      console.log("Configuration updated.");
    } catch (error) {
      // Log and handle any errors that occur during file reading, parsing, or writing
      await logEvents("config", "error", "error occurred while reading, parsing, or writing the configuration file");
      if (DEBUG) {
        console.error("Error occurred while reading, parsing, or writing the configuration file:", error);
      }
    }
  } else {
    console.log("Config file not found.");
  }
}

// Main function to handle the configuration commands
async function configApp() {
  // Switch statement to handle different command options
  switch (command) {
    case "--show":
      // Display the application's configuration
      await logEvents("config", "info", "displaying the configuration");
      await displayApp();
      break;
    case "--reset":
      // Reset the configuration
      await logEvents("config", "info", "resetting the configuration");
      await resetConfig();
      break;
    case "--set":
      // Set a configuration key-value pair
      if (key && value) {
        await logEvents("config", "info", `setting configuration key: ${key}, value: ${value}`);
        await setConfig(key, value);
      } else {
        console.log("Please provide a valid key-value pair to set a configuration setting.");
      }
      break;
    case "--help":
      // Display the help file
      await logEvents("config", "info", "displaying the help file");
      console.log("Displaying the help file:");
      try {
        // Read and display the help file
        const helpFilePath = path.join(__dirname, "help/confighelp.txt");
        const data = await readFileAsync(helpFilePath);
        console.log(data.toString());
      } catch (error) {
        // Log and handle any errors that occur while reading the help file
        await logEvents("config", "error", "error occurred while reading the help file");
        if (DEBUG) {
          console.error("Error occurred while reading the help file:", error);
        }
      }
      break;
    default:
      // Display the usage file
      await logEvents("config", "info", "displayed the usage file");
      console.log("Displaying the usage file:");
      try {
        // Read and display the usage file
        const usageFilePath = path.join(__dirname, "views/usage.txt");
        const data = await readFileAsync(usageFilePath);
        console.log(data.toString());
      } catch (error) {
        // Log and handle any errors that occur while reading the usage file
        if (DEBUG) {
          console.error("Error occurred while reading the usage file:", error);
        }
      }
      break;
  }
}

// Export the configApp function as a module
module.exports = {
  configApp,
};




