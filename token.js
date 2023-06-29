// *********************************
// Filename: token.js
// Author: Jonah Greening
// Purpose: Code for the token command
// Date: 06-22-2023
// Date revised: 06-23-2023
// Date revised: 06-23-2023
// **********************************

const fs = require("fs");
const path = require("path");
const rtg = require("random-token-generator");
const logEvents = require("./logEvents.js");

const jsonFolder = "json";
const tokensFilePath = path.join(jsonFolder, "tokens.json");

const myArgs = process.argv.slice(3);
const command = myArgs[0]?.toLowerCase();

const username = myArgs[1];
const email = myArgs[1];
const phone = myArgs[1];

// Function to get the count of tokens
function getTokenCount() {
  // Check if the tokens.json file exists
  if (fs.existsSync(tokensFilePath)) {
    try {
      // Read the existing tokens from the file
      const fileContent = fs.readFileSync(tokensFilePath, "utf8");
      const tokensData = JSON.parse(fileContent);
      const tokenCount = tokensData.tokens.length;
      console.log(`Number of tokens: ${tokenCount}`);
      logEvents("token", "info", `number of tokens: ${tokenCount}`);
    } catch (error) {
      console.error("Error occurred while reading the tokens file:", error);
      logEvents("token", "error", "error occurred while reading the tokens file: " + error);
    }
  } else {
    console.log("tokens.json file not found.");
    logEvents("token", "info", "tokens.json file not found.");
  }
}

// Function to generate a new token
function generateToken() {
  // Check if the tokens.json file exists
  if (fs.existsSync(tokensFilePath)) {
    try {
      // Read the existing tokens from the file
      const existingTokens = JSON.parse(fs.readFileSync(tokensFilePath, "utf8"));

      // Find the token object for the specified username, email, or phone number
      const userToken = existingTokens.tokens.find(
        (token) =>
          token.username === username || token.email === email || token.phone === phone
      );

      if (userToken) {
        // If the token exists, check if it has expired
        if (hasTokenExpired(userToken)) {
          // Generate a new token
          rtg.generateKey(
            {
              len: 6,
              string: true,
              strong: false,
              retry: false,
            },
            function (err, newToken) {
              if (err) {
                console.error("Error occurred while generating the token:", err);
                logEvents("token", "error", "error occurred while generating the token: " + err);
                return;
              }

              // Update the token properties
              userToken.token = newToken;
              userToken.timestamp = Date.now(); // Set the current timestamp

              // Write the updated tokens back to the file
              fs.writeFileSync(tokensFilePath, JSON.stringify(existingTokens, null, 2));

              console.log("New token generated for", username + ":", newToken);
              logEvents("token", "info", `new token generated for ${username}: ${newToken}`);
            }
          );
        } else {
          // Token exists but has not expired, prompt to change the token
          console.log("Token already exists and has not expired. Do you want to change it? (Y/N)");

          // Manually resume the input stream to allow further input
          process.stdin.resume();

          // Listen for user input
          process.stdin.once("data", (input) => {
            // Pause the input stream again to process the input
            process.stdin.pause();

            const choice = input.toString().trim().toLowerCase();
            if (choice === "y" || choice === "yes") {
              // Generate a new token
              rtg.generateKey(
                {
                  len: 6,
                  string: true,
                  strong: false,
                  retry: false,
                },
                function (err, newToken) {
                  if (err) {
                    console.error("Error occurred while generating the token:", err);
                    logEvents("token", "error", "error occurred while generating the token: " + err);
                    return;
                  }

                  // Update the token properties
                  userToken.token = newToken;
                  userToken.timestamp = Date.now(); // Set the current timestamp

                  // Write the updated tokens back to the file
                  fs.writeFileSync(tokensFilePath, JSON.stringify(existingTokens, null, 2));

                  console.log("Token changed for", username + ":", newToken);
                  logEvents("token", "info", `token changed for ${username}: ${newToken}`);
                }
              );
            } else if (choice === "n" || choice === "no") {
              console.log("Token remains unchanged.");
              logEvents("token", "info", "token remains unchanged.");
            } else {
              console.log("Invalid choice. Token remains unchanged.");
              logEvents("token", "info", "invalid choice. token remains unchanged.");
            }
          });
        }
      } else {
        // If the token does not exist, generate a new token
        generateNewToken(existingTokens);
      }
    } catch (error) {
      console.error("Error occurred while generating the token:", error);
      logEvents("token", "error", "error occurred while generating the token: " + error);
    }
  } else {
    console.log("tokens.json file not found.");
    logEvents("token", "info", "tokens.json file not found.");
  }
}

// Function to generate a new token when no existing token is found
function generateNewToken(existingTokens) {
  rtg.generateKey(
    {
      len: 6,
      string: true,
      strong: false,
      retry: false,
    },
    function (err, newToken) {
      if (err) {
        // Token generation error when no existing token is found
        console.error("Error occurred while generating the token:", err);
        logEvents("token", "error", "error occurred while generating the token: " + err);
        return;
      }

      const expirationTimestamp = Date.now() + 3 * 24 * 60 * 60 * 1000; // Set expiration to 3 days
      const newTokenObj = {
        username,
        email,
        phone,
        token: newToken, // Set the new token
        timestamp: Date.now(), // Set the current timestamp
        expiration: expirationTimestamp, // Set the expiration timestamp
      };
      
      existingTokens.tokens.push(newTokenObj);

      // Write the updated tokens back to the file
      fs.writeFileSync(tokensFilePath, JSON.stringify(existingTokens, null, 2));

      console.log("New token generated for", username + ":", newToken);
      logEvents("token", "info", `new token generated for ${username}: ${newToken}`);
    }
  );
}

// Function to check if a token has expired
function hasTokenExpired(token) {
  const tokenExpiration = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
  return Date.now() - token.timestamp >= tokenExpiration;
}

// Function to update an existing token
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
            // Update the phone field
            tokenObject.phone = newValue;
            break;
          case "e":
            // Update the email field
            tokenObject.email = newValue;
            break;
          default:
            // Invalid field option
            console.log("Invalid field option.");
            logEvents("token", "info", "invalid field option.");
            return;
        }
        // Write the updated tokens back to the file
        fs.writeFileSync(tokensFilePath, JSON.stringify(existingTokens, null, 4));

        console.log(`Token updated successfully. New value: ${newValue}`);
        logEvents("token", "info", `token updated successfully. New value: ${newValue}`);
      } else {
        console.log(`Token not found for username: ${username}`);
        logEvents("token", "info", `token not found for username: ${username}`);
      }
    } catch (error) {
      console.error("Error occurred while updating the token:", error);
      logEvents("token", "error", "error occurred while updating the token: " + error);
    }
  } else {
    console.log("tokens.json file not found.");
    logEvents("token", "info", "tokens.json file not found.");
  }
}

// Function to fetch a token
function fetchToken() {
  const optionToken = myArgs[1];
  const valueToken = myArgs[2];

  // Check if the tokens.json file exists
  if (fs.existsSync(tokensFilePath)) {
    try {
      // Read the existing tokens from the file
      const existingTokens = JSON.parse(fs.readFileSync(tokensFilePath, "utf8"));

      let token;
      // Find the token based on the specified option
      switch (optionToken) {
        case "u":
          // Find the token by username
          token = existingTokens.tokens.find((token) => token.username === valueToken);
          break;
        case "e":
          // Find the token by email
          token = existingTokens.tokens.find((token) => token.email === valueToken);
          break;
        case "p":
          // Find the token by phone number
          token = existingTokens.tokens.find((token) => token.phone === valueToken);
          break;
        default:
          // Invalid option
          console.log("Invalid option.");
          logEvents("token", "info", "invalid option.");
          return;
      }

      if (token) {
        if (hasTokenExpired(token)) {
          // Token has expired
          console.log(`Token for ${valueToken} has expired.`);
          logEvents("token", "info", `token for ${valueToken} has expired.`);
        } else {
          // Token found and not expired
          console.log(`Token for ${valueToken}: ${token.token}`);
          logEvents("token", "info", `token for ${valueToken}: ${token.token}`);
        }
      } else {
        // Token not found
        console.log(`Token not found for the specified ${optionToken}: ${valueToken}`);
        logEvents("token", "info", `token not found for the specified ${optionToken}: ${valueToken}`);
      }
    } catch (error) {
      // Error occurred while fetching the token
      console.error("Error occurred while fetching the token:", error);
      logEvents("token", "error", "error occurred while fetching the token: " + error);
    }
  } else {
    // tokens.json file not found
    console.log("tokens.json file not found.");
    logEvents("token", "info", "tokens.json file not found.");
  }
}

// Function to handle the token application
function tokenApp() {
  switch (command) {
    case "--count":
      // Execute getTokenCount function
      getTokenCount();
      logEvents("token", "info", "getTokenCount command executed.");
      break;
    case "--new":
      // Execute generateToken function
      generateToken();
      logEvents("token", "info", "generating new token.");
      break;
    case "--update":
      // Execute updateToken function
      updateToken();
      logEvents("token", "info", "updating token.");
      break;
    case "--fetch":
      // Execute fetchToken function
      fetchToken();
      logEvents("token", "info", "fetching token.");
      break;
    case "--help":
      console.log("Displaying the help file:");
      const helpFilePath = path.join(__dirname, "help/tokenhelp.txt");
      // Read and display the help file
      fs.readFile(helpFilePath, (error, data) => {
        if (error) {
          console.error("Error occurred while reading the help file:", error);
          logEvents("token", "error", "error occurred while reading the help file: " + error);
          return;
        }
        console.log(data.toString());
        logEvents("token", "info", "displaying the help file");
      });
      logEvents("token", "info", "--help command executed.");
      break;
    default:
      console.log("Displaying the usage file:");
      const usageFilePath = path.join(__dirname, "usage.txt");
      // Read and display the usage file
      fs.readFile(usageFilePath, (error, data) => {
        if (error) {
          console.error("Error occurred while reading the usage file:", error);
          logEvents("token", "error", "error occurred while reading the usage file: " + error);
          return;
        }
        console.log(data.toString());
        logEvents("token", "info", "displaying the usage file:\n" + data.toString());
      });
      logEvents("token", "info", "unknown command executed.");
      break;
  }
}


module.exports = {
  tokenApp,
};



