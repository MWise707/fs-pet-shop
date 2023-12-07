"use strict";
//set up the server
const express = require("express");
const fs = require("fs");
const port = process.env.PORT || 9000;
const app = express();
const path = require('path');


app.use(express.json()); // Middleware to parse JSON requests

// const regex = /^\/pets\/(\d+)$/; // matches url where index is positive integer

//set up the routes endpoints
app.get("/pets", function (req, res) {
  fs.readFile(path.join(__dirname,"../pets.json"), "utf8", (err, data) => {
    console.log("Request url:", req.url);
    
    // throw new Error("this is the user requested index: ", indexString);
    if (err) {
        console.error("Error reading file:", err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("Handles request of full data:", data);
        res.send(data);
    }
  });
});

// app.use((err))

//start the server listening
app.listen(port, function () {
  console.log("the port is using port ", port);
});
