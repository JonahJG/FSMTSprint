// *********************************
// Filename: token.js
// Author: Jonah Greening
// Purpose: Code for the token command
// Date: 06-22-2023
// Date revised: 06-22-2023
// **********************************

//Global imports

const fs = require("fs");
const path = require("path");

// node package imports
var rtg = require("random-token-generator")

// Slicing the first arguments off the array, leaving only the arguments that are passed to the app
const myArgs = process.argv.slice(3);

// Using the first argument as the command
const command = myArgs[0]?.toLowerCase();

// Setting the username, email, and phone variables

// Declaring constants 
const jsonFolder = "json";
const tokensFilePath = path.join(jsonFolder, "tokens.json");

const username = myArgs[1];
const email = myArgs[1];
const phone = myArgs[1];

function tokenCount() {
    // const jsonFolder = 'json';
    // const tokensFilePath = path.join(jsonFolder, 'tokens.json');
  
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
      } catch (error) {
        console.error("Error occurred while reading the tokens file:", error);
      }
    } else {
      console.log("tokens.json file not found.");
    }
  }
  
  function generateToken() {
    // const jsonFolder = 'json';
    // const tokensFilePath = path.join(jsonFolder, 'tokens.json');
  
    // Check if the tokens.json file exists
    if (fs.existsSync(tokensFilePath)) {
      try {
        // Read the existing tokens from the file
        const existingTokens = JSON.parse(fs.readFileSync(tokensFilePath, "utf8"));
  
        // Find the token object for the specified username, email, or phone
        const userToken = existingTokens.tokens.find(
          token => token.username === username || token.email === email || token.phone === phone
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
            function(err, newToken) {
              if (err) {
                console.error("Error occurred while generating the token:", err);
                return;
              }
  
              // Update the token properties
              userToken.token = newToken;
  
              // Write the updated tokens to the file
              fs.writeFileSync(tokensFilePath, JSON.stringify(existingTokens, null, 2));
              console.log("New token generated for", username + ":", newToken);
            }
          );
        } else {
          console.log("Token not found for:", username || email || phone);
        }
      } catch (error) {
        console.error("Error occurred while generating the token:", error);
      }
    } else {
      console.log("tokens.json file not found.");
    }
  }
  

  

  function updateToken() {
    // const jsonFolder = 'json';
    // const tokensFilePath = path.join(jsonFolder, 'tokens.json');
    const field = myArgs[1];
    const tokenUsername = myArgs[2];
    const newValue = myArgs[3];
  
    // Check if the tokens.json file exists
    if (fs.existsSync(tokensFilePath)) {
      try {
        // Read the existing tokens from the file
        const existingTokens = JSON.parse(fs.readFileSync(tokensFilePath, 'utf8'));
  
        // Find the token object for the specified username
        const tokenObject = existingTokens.tokens.find(token => token.username === tokenUsername);
        if (tokenObject) {
          // Update the corresponding field based on the provided option
          switch (field) {
            case 'p':
              tokenObject.phone = newValue;
              break;
            case 'e':
              tokenObject.email = newValue;
              break;
            default:
              console.log('Invalid field option.');
              return;
          }
  
          // Write the updated tokens back to the file
          fs.writeFileSync(tokensFilePath, JSON.stringify(existingTokens, null, 4));
  
          console.log(`Token updated successfully. New value: ${newValue}`);
        } else {
          console.log(`Token not found for username: ${username}`);
        }
      } catch (error) {
        console.error('Error occurred while updating the token:', error);
      }
    } else {
      console.log('tokens.json file not found.');
    }
  }
  
  function tokenFetch() {
    const optionToken = myArgs[1];
    const valueToken = myArgs[2];
  
    // Check if the tokens.json file exists
    if (fs.existsSync(tokensFilePath)) {
      try {
        // Read the existing tokens from the file
        const existingTokens = JSON.parse(fs.readFileSync(tokensFilePath, 'utf8'));
  
        // Find the token based on the specified option and value
        let token;
        switch (optionToken) {
          case 'u':
            token = existingTokens.tokens.find(token => token.username === valueToken);
            break;
          case 'e':
            token = existingTokens.tokens.find(token => token.email === valueToken);
            break;
          case 'p':
            token = existingTokens.tokens.find(token => token.phone === valueToken);
            break;
          default:
            console.log('Invalid option.');
            return;
        }
  
        if (token) {
          // Display the token
          console.log(`Token for ${valueToken}: ${token.token}`);
        } else {
          console.log(`Token not found for the specified ${optionToken}: ${valueToken}`);
        }
      } catch (error) {
        console.error('Error occurred while fetching the token:', error);
      }
    } else {
      console.log('tokens.json file not found.');
    }
  }
  

// Using a switch statement to determine which command was passed to the app

function tokenApp() {
    switch (command) {
      case "--count":
        tokenCount();
        break;
      case "--new":
        generateToken();
        break;
      case "--update":
        updateToken();
        break;
    case "--fetch":
        tokenFetch();
        break;
      case "--help":
          console.log("Displaying the help file:");
          const helpFilePath = path.join(__dirname, "help/tokenhelp.txt");
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
        const usageFilePath = path.join(__dirname, "usage.txt");
        fs.readFile(usageFilePath, (error, data) => {
          if (error) throw error;
          console.log(data.toString());
        });
        break;
    }
  }


module.exports = { 
    tokenCount,
    generateToken,
    updateToken,
    tokenFetch,
    tokenApp,
};
