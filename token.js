// *********************************
// Filename: token.js
// Author: Jonah Greening
// Purpose: Code for the token command
// Date: 06-22-2023
// Date revised: 06-23-2023
// **********************************

// Import required modules
const fs = require("fs");
const path = require("path");
const logEvents = require("./logEvents");
const rtg = require("random-token-generator");

// Extract command line arguments
const myArgs = process.argv.slice(3);
const command = myArgs[0]?.toLowerCase();

// Define file paths and folder name
const jsonFolder = "json";
const tokensFilePath = path.join(jsonFolder, "tokens.json");

// Extract command line arguments for username, email, and phone
const username = myArgs[1];
const email = myArgs[1];
const phone = myArgs[1];

// Function to count the number of tokens
function tokenCount() {
  // Check if the tokens.json file exists
  if (fs.existsSync(tokensFilePath)) {
    try {
      // Read the contents of the tokens.json file
      const fileContent = fs.readFileSync(tokensFilePath, "utf8");

      // Parse the JSON data
      const tokensData = JSON.parse(fileContent);

      // Count the number of tokens
      const tokenCount = tokensData.tokens.length;

      console.log(`Number of tokens: ${tokenCount}`);
      logEvents("tokens", "info", `Number of tokens: ${tokenCount}`);
    } catch (error) {
      console.error("Error occurred while reading the tokens file:", error);
      logEvents("tokens", "error", "Error occurred while reading the tokens file: " + error);
    }
  } else {
    console.log("tokens.json file not found.");
    logEvents("tokens", "info", "tokens.json file not found.");
  }
}

// Function to generate a new token
function generateToken() {
  // Check if the tokens.json file exists
  if (fs.existsSync(tokensFilePath)) {
    try {
      // Read the existing tokens from the file
      const existingTokens = JSON.parse(fs.readFileSync(tokensFilePath, "utf8"));

      // Find the token object for the specified username, email, or phone
      const userToken = existingTokens.tokens.find(
        (token) => token.username === username || token.email === email || token.phone === phone
      );

      if (userToken) {
        // Generate a new token
        rtg.generateKey(
          {
            len: 6,
            string: true,
            strong: false,
            retry: false
          },
          function (err, newToken) {
            if (err) {
              console.error("Error occurred while generating the token:", err);
              logEvents("tokens", "error", "Error occurred while generating the token: " + err);
              return;
            }

            // Update the token properties
            userToken.token = newToken;

            // Write the updated tokens to the file
            fs.writeFileSync(tokensFilePath, JSON.stringify(existingTokens, null, 2));
            console.log("New token generated for", username + ":", newToken);
            logEvents("tokens", "info", `New token generated for ${username}: ${newToken}`);
          }
        );
      } else {
        console.log("Token not found for:", username || email || phone);
        logEvents("tokens", "info", `Token not found for: ${username || email || phone}`);
      }
    } catch (error) {
      console.error("Error occurred while generating the token:", error);
      logEvents("tokens", "error", "Error occurred while generating the token: " + error);
    }
  } else {
    console.log("tokens.json file not found.");
    logEvents("tokens", "info", "tokens.json file not found.");
  }
}

// Function to update a token's email or phone number
function updateToken() {
  const field = myArgs[1];
  const tokenUsername = myArgs[2];
  const newValue = myArgs[3];

  // Check if the tokens.json file exists
  if (fs.existsSync(tokensFilePath)) {
    try {
      // Read the existing tokens from the file
      const existingTokens = JSON.parse(fs.readFileSync(tokensFilePath, "utf8"));

      // Find the token object for the specified username
      const tokenObject = existingTokens.tokens.find((token) => token.username === tokenUsername);

      if (tokenObject) {
        // Update the corresponding field based on the provided option
        switch (field) {
          case "p":
            tokenObject.phone = newValue;
            break;
          case "e":
            tokenObject.email = newValue;
            break;
          default:
            console.log("Invalid field option.");
            return;
        }

        // Write the updated tokens back to the file
        fs.writeFileSync(tokensFilePath, JSON.stringify(existingTokens, null, 4));

        console.log(`Token updated successfully. New value: ${newValue}`);
        logEvents("tokens", "info", `Token updated successfully. New value: ${newValue}`);
      } else {
        console.log(`Token not found for username: ${tokenUsername}`);
        logEvents("tokens", "info", `Token not found for username: ${tokenUsername}`);
      }
    } catch (error) {
      console.error("Error occurred while updating the token:", error);
      logEvents("tokens", "error", "Error occurred while updating the token: " + error);
    }
  } else {
    console.log("tokens.json file not found.");
    logEvents("tokens", "info", "tokens.json file not found.");
  }
}

// Function to fetch a token based on username, email, or phone number
function tokenFetch() {
  const optionToken = myArgs[1];
  const valueToken = myArgs[2];

  // Check if the tokens.json file exists
  if (fs.existsSync(tokensFilePath)) {
    try {
      // Read the existing tokens from the file
      const existingTokens = JSON.parse(fs.readFileSync(tokensFilePath, "utf8"));

      // Find the token based on the specified option and value
let token;
switch (optionToken) {
  case "u":
    // If the optionToken is "u" (username), find the token with a matching username
    token = existingTokens.tokens.find((token) => token.username === valueToken);
    break;
  case "e":
    // If the optionToken is "e" (email), find the token with a matching email
    token = existingTokens.tokens.find((token) => token.email === valueToken);
    break;
  case "p":
    // If the optionToken is "p" (phone), find the token with a matching phone number
    token = existingTokens.tokens.find((token) => token.phone === valueToken);
    break;
  default:
    // If none of the above options match, log an error and return
    console.log("Invalid option.");
    return;
}


      if (token) {
        // Display the token
        console.log(`Token for ${valueToken}: ${token.token}`);
        logEvents("tokens", "info", `Token for ${valueToken}: ${token.token}`);
      } else {
        console.log(`Token not found for the specified ${optionToken}: ${valueToken}`);
        logEvents(
          "tokens",
          "info",
          `Token not found for the specified ${optionToken}: ${valueToken}`
        );
      }
    } catch (error) {
      console.error("Error occurred while fetching the token:", error);
      logEvents("tokens", "error", "Error occurred while fetching the token: " + error);
    }
  } else {
    console.log("tokens.json file not found.");
    logEvents("tokens", "info", "tokens.json file not found.");
  }
}

// Main function to execute the token-related commands
function tokenApp() {
  switch (command) {
    case "--count":
      // If the command is "--count", execute the tokenCount function
      tokenCount();
      break;
    case "--new":
      // If the command is "--new", execute the generateToken function
      generateToken();
      break;
    case "--update":
      // If the command is "--update", execute the updateToken function
      updateToken();
      break;
    case "--fetch":
      // If the command is "--fetch", execute the tokenFetch function
      tokenFetch();
      break;
    case "--help":
      // If the command is "--help", read and display the contents of the help file
      console.log("Displaying the help file:");
      const helpFilePath = path.join(__dirname, "help/tokenhelp.txt");
      fs.readFile(helpFilePath, (error, data) => {
        if (error) {
          // If there is an error while reading the help file, log the error and return
          console.error("Error occurred while reading the help file:", error);
          logEvents(
            "tokens",
            "error",
            "Error occurred while reading the help file: " + error
          );
          return;
        }
        // Print the contents of the help file
        console.log(data.toString());
        logEvents("tokens", "info", "Help file displayed.");
      });
      break;
    default:
      // For any other command, assume it is invalid and display the usage file
      console.log("Displaying the usage file:");
      const usageFilePath = path.join(__dirname, "usage.txt");
      fs.readFile(usageFilePath, (error, data) => {
        if (error) {
          // If there is an error while reading the usage file, log the error and return
          console.error("Error occurred while reading the usage file:", error);
          logEvents(
            "tokens",
            "error",
            "Error occurred while reading the usage file: " + error
          );
          return;
        }
        // Print the contents of the usage file
        console.log(data.toString());
        logEvents("tokens", "info", "Usage file displayed.");
      });
      break;
  }
}


// Exporting the functions to be used by other modules
module.exports = {
  tokenCount,
  generateToken,
  updateToken,
  tokenFetch,
  tokenApp,
};

