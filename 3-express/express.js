"use strict";
//set up the server
const express = require("express");
const fs = require("fs");
const port = process.env.PORT || 9000;
const app = express();

app.use(express.json()); // Middleware to parse JSON requests

// const regex = /^\/pets\/(\d+)$/; // matches url where index is positive integer

//set up the routes endpoints
app.get("/pets", function (req, res) {
  fs.readFile("../pets.json", "utf8", (err, data) => {
    console.log("Request url:", req.url);
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Handles request of full data:", data);
      res.send(data);
    }
  });
});

app.get("/pets/:id", function (req, res) {
  //   const urlArr = req.url.split("/");
  const { id } = req.params;
  const index = parseInt(id);

  console.log("pet Index: ", id);
  console.log("type of", typeof id);

  fs.readFile("../pets.json", "utf8", (err, data) => {
    // throw new Error("this is the user requested index: ", indexString);
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
    } else if (isNaN(index) || JSON.parse(data)[index] === undefined) {
      // this is the !truth
      console.error("nope. that is not a valid entry");
      res.set('Content-Type', 'text/plain')
      res.status(404).send("Index not valid");
      // check index is NaN && pets.json[index] exists
    } else {
      console.log("Single pet at index");
      res.send(JSON.parse(data)[index]);
    }
  });
});

// app.use((err))

//start the server listening
app.listen(port, function () {
  console.log("the port is using port ", port);
});
