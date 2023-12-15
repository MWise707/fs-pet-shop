"use strict";
//set up the server
const express = require("express");
const fs = require("fs");
const port = process.env.PORT || 8000;
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
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
    } else if (isNaN(index) || JSON.parse(data)[index] === undefined) {
      // this is the !truth
      console.error("nope. that is not a valid entry");
      res.set("Content-Type", "text/plain");
      res.status(404).send("Index not valid");
      // check index is NaN && pets.json[index] exists
    } else {
      console.log("Single pet at index");
      res.send(JSON.parse(data)[index]);
    }
  });
});

app.post("/pets/:id/:age/:kind/:name", function (req, res) {
  // for create requests
  // handle errors
  const url = req.url;
  const { id } = req.params;
  const { age } = req.params;
  const { kind } = req.params;
  const { name } = req.params;

  const ageNum = parseInt(age);

  const options = /(create|read|update|delete)/i;
  let matchOption = url.match(options);
  let command = id.toLowerCase();

  fs.readFile("../pets.json", "utf8", (err, data) => {
    let petShop = JSON.parse(data);
    const newPet = {
      age: ageNum,
      kind: kind,
      name: name,
    };
    petShop.push(newPet);
    if (err) {
      console.log("post error");
      res.send(err);
    } else if (!matchOption || isNaN(ageNum)) {
      console.log("Invalid URL");
      res.set("Content-Type", "text/plain");
      res.status(404).send("Bad Request");
    } else if (command === "create") {
      let updatedPetShop = JSON.stringify(petShop);
      fs.writeFile("../pets.json", updatedPetShop, "utf8", (err) => {
        if (err) {
          console.log("Write File Error: ", err);
          res.send(err);
        } else {
          console.log("New Pet Added: ", newPet);
        }
        res.send(newPet);
      });
    }
  });
});

// app.use((err))

//start the server listening
app.listen(port, function () {
  console.log("the port is using port ", port);
});
