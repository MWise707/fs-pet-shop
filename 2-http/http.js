"use strict";

const http = require("http");
// const { runInNewContext } = require("vm");
const port = process.env.PORT || 8000;
const fs = require("fs");

const server = http.createServer(function (req, res) {
  console.log(req.url);
  const pets = req.url.split("/");
  console.log("Checking index before changing to number: ", pets[2]);
  console.log("Type of index before changing: ", typeof pets[2]);
  // console.log("length of index: ", pets[2].length);
  const index = parseInt(pets[2]);
  console.log("Index line 13 is:", typeof index);
  console.log(isNaN(index));

  // use this index in the pets.json to read that specific pet data in that object
  fs.readFile("../pets.json", "utf8", function (error, data) {
    if (error) {
      console.log("This is my internal server error", error);
      res.statusCode = 500;
      res.end(error);
    } else if (isNaN(index) && req.method === "GET") {
      // check if pets[2] === undefined
      if (pets[2] !== undefined) {
        console.log("Did not have valid index");
        res.setHeader = ("Content-Type", "text/plain");
        res.end("Not Found");
      } else {
        res.statusCode = 200;
        res.setHeader = ("Content-Type", "application/JSON");
        console.log(JSON.parse(data));
        res.end(data);
      }
    } else if (index >= 0 && req.method === "GET") {
      if (JSON.parse(data)[index] === undefined) {
        // if index at petObj is undefined
        console.log("Pet does not exist");
        res.statusCode = 404;
        res.setHeader = ("Content-Type", "text/plain");
        res.end("Not Found");
      } else {
        console.log(JSON.parse(data)[index]);
        res.statusCode = 200;
        res.setHeader = ("Content-Type", "application/JSON");
        res.end(JSON.stringify(JSON.parse(data)[index]));
      }
    } else if (index < 0 && req.method === "GET") {
      console.log("Negative index sent");
      res.statusCode = 404;
      res.setHeader = ("Content-Type", "text/plain");
      res.end("Not Found");
    }
  });
});

server.listen(port, function () {
  console.log("Listening on port", port);
});
