const fs = require("fs");
const path = require("path");

function configApp() {
  const jsonFolder = 'json';
  const configFilePath = path.join(jsonFolder, 'config.json');

  // Check if the config.json file exists
  if (fs.existsSync(configFilePath)) {
    // Read the contents of the config.json file
    fs.readFile(configFilePath, (error, data) => {
      if (error) throw error;
      
      // Parse the JSON data
      const configData = JSON.parse(data);
      
      // Display the configuration
      console.log("Current Configuration:");
      console.log(configData);
    });
  } else {
    console.log("Config file not found.");
  }
}

module.exports = 
{ configApp };
