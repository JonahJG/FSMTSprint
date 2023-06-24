// *********************************
// Filename: server.js
// Author: Jonah Greening
// Purpose: Server for creating new users
// Date: 06-22-2023
// Date revised: 06-23-2023
// **********************************

// Import required modules
const http = require("http");
const fs = require("fs");
const rtg = require("random-token-generator");
const { logEvents } = require("./logEvents.js");
const expirationTimestamp = Date.now() + 3 * 24 * 60 * 60 * 1000;

// Create an HTTP server
// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    // Serve the index.html file for GET requests
    fs.readFile("index.html", (err, content) => {
      if (err) {
        // Error occurred while reading the file
        logEvents("server", "error", "error reading file: " + err);
        res.statusCode = 500;
        res.end("Internal Server Error");
        logEvents("server", "error", "error reading file: " + err);
        return;
      }

      // Send the HTML content as the response
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content, "utf-8");
    });
  } else if (req.method === "POST") {
    // Handle form submission for POST requests
    // Handle form submission for POST requests
    let data = "";

    // Accumulate the data from the request
    req.on("data", (chunk) => {
      data += chunk;
    });

    // Processing the complete request data
    req.on("end", () => {
      // Parse the form data from the request body
      const formData = new URLSearchParams(data);
      const username = formData.get("username");
      const email = formData.get("email");
      const phone = formData.get("phone");

      // Generate a new token using random-token-generator module
      rtg.generateKey(
        {
          len: 6,
          string: true,
          strong: false,
          retry: false,
        },
        (err, newToken) => {
          if (err) {
            // Error occurred while generating the token
            logEvents("server", "error", "error occurred while generating the token: " + err);
            res.statusCode = 500;
            res.end("Internal Server Error");
            logEvents("server", "error", "error generating token: " + err);
            return;
          }

          // Create a new user object with form data and generated token
          const newUser = {
            username,
            email,
            phone,
            token: newToken,
            timestamp: Date.now(),
            expiration: expirationTimestamp
          };

          // Read the existing JSON file containing tokens
          fs.readFile("json/tokens.json", "utf8", (err, jsonString) => {
            if (err) {
              // Error occurred while reading the file
              logEvents("server", "error", "error reading file: " + err);
              res.statusCode = 500;
              res.end("Internal Server Error");
              logEvents("server", "error", "error reading file: " + err);
              return;
            }

            let tokens = { tokens: [] };

            try {
              // Parse the JSON data from the file
              tokens = JSON.parse(jsonString);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              logEvents("server", "error", "error parsing JSON: " + error);
            }

            // Add the new user to the tokens array
            tokens.tokens.push(newUser);

            // Write the updated JSON back to the file
            fs.writeFile("json/tokens.json", JSON.stringify(tokens, null, 2), (err) => {
              if (err) {
                // Error occurred while writing the file
                logEvents("server", "error", "error writing file: " + err);
                res.statusCode = 500;
                res.end("Internal Server Error");
                logEvents("server", "error", "error writing file: " + err);
                return;
              }

              // User created successfully
              logEvents("server", "info", "user created successfully");
              res.statusCode = 200;
              res.end("user created successfully");

              // Log the user creation event
              logEvents("server", "info", "user created: " + JSON.stringify(newUser));
            });
          });
        }
      );
    });
  } else {
    // For any other request method, respond with 404 Not Found
    res.statusCode = 404;
    res.end("Not Found");
    logEvents("server", "error", "invalid request method");
  }
});

// Start the server and listen on port 3000
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
  logEvents("server", "info", "server is listening on port 3000");
});
