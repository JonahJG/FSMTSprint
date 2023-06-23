// *********************************
// Filename: config.js
// Author: Jonah Greening
// Purpose: Code for the config command
// Date: 06-21-2023
// Date revised: 06-22-2023
// **********************************

const fs = require("fs");
const path = require("path");
const logEvents = require("./logEvents");
global.DEBUG = true;

const myArgs = process.argv.slice(3);
const command = myArgs[0]?.toLowerCase();
const key = myArgs[1];
const value = myArgs[2];

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

async function displayApp() {
  await logEvents("command", "info", "displayed the configuration");

  const jsonFolder = "json";
  const configFilePath = path.join(jsonFolder, "config.json");

  if (fs.existsSync(configFilePath)) {
    try {
      const data = await readFileAsync(configFilePath);
      const configData = JSON.parse(data);

      console.log("Current Configuration:");
      console.log(configData);
    } catch (error) {
      await logEvents("command", "error", "error occurred while reading or parsing the configuration file");
      if (DEBUG) {
        console.error("Error occurred while reading or parsing the configuration file:", error);
      }
    }
  } else {
    console.log("Config file not found.");
  }
}

async function resetConfig() {
  await logEvents("command", "info", "resetting the configuration");

  const jsonFolder = "json";
  const configFilePath = path.join(jsonFolder, "config.json");

  if (fs.existsSync(configFilePath)) {
    try {
      await fs.promises.unlink(configFilePath);
      console.log("Configuration reset.");
    } catch (error) {
      await logEvents("command", "error", "error occurred while resetting the configuration");
      if (DEBUG) {
        console.error("Error occurred while resetting the configuration:", error);
      }
    }
  } else {
    console.log("Config file not found.");
  }
}

async function setConfig(key, value) {
  await logEvents("command", "info", `set configuration key: ${key}, value: ${value}`);

  const jsonFolder = "json";
  const configFilePath = path.join(jsonFolder, "config.json");

  if (fs.existsSync(configFilePath)) {
    try {
      const data = await readFileAsync(configFilePath);
      const configData = JSON.parse(data);

      configData[key] = value;

      await writeFileAsync(configFilePath, JSON.stringify(configData, null, 4));
      console.log("Configuration updated.");
    } catch (error) {
      await logEvents("command", "error", "error occurred while reading, parsing, or writing the configuration file");
      if (DEBUG) {
        console.error("Error occurred while reading, parsing, or writing the configuration file:", error);
      }
    }
  } else {
    console.log("Config file not found.");
  }
}

async function configApp() {
  switch (command) {
    case "--show":
      await logEvents("command", "info", "displayed the configuration");
      await displayApp();
      break;
    case "--reset":
      await logEvents("command", "info", "reset the configuration");
      await resetConfig();
      break;
    case "--set":
      if (key && value) {
        await logEvents("command", "info", `setting configuration key: ${key}, value: ${value}`);
        await setConfig(key, value);
      } else {
        console.log("Please provide a valid key-value pair to set a configuration setting.");
      }
      break;
    case "--help":
      await logEvents("command", "info", "displayed the help file");
      console.log("Displaying the help file:");
      try {
        const helpFilePath = path.join(__dirname, "help/confighelp.txt");
        const data = await readFileAsync(helpFilePath);
        console.log(data.toString());
      } catch (error) {
        await logEvents("command", "error", "error occurred while reading the help file");
        if (DEBUG) {
          console.error("Error occurred while reading the help file:", error);
        }
      }
      break;
    default:
      await logEvents("command", "info", "displayed the usage file");
      console.log("Displaying the usage file:");
      try {
        const usageFilePath = path.join(__dirname, "views/usage.txt");
        const data = await readFileAsync(usageFilePath);
        console.log(data.toString());
      } catch (error) {
        if (DEBUG) {
          console.error("Error occurred while reading the usage file:", error);
        }
      }
      break;
  }
}

module.exports = {
  configApp,
};



