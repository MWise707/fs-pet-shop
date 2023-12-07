"use strict";

const http = require("http");
// const { runInNewContext } = require("vm");
const port = process.env.PORT || 8000;
const fs = require("fs");
const regex = /^\/pets\/(\d+)$/; // matches url where index is positive integer

const server = http.createServer(function (req, res) {
  console.log(req.url);

  const match = req.url.match(regex);
  if (!match) {
    console.log("invalid URL!");
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("not found");
  }

  const index = parseInt(match[1]);

  // use this index in the pets.json to read that specific pet data in that object
  fs.readFile("../pets.json", "utf8", function (error, data) {
    if (error) {
      console.log("Error!");
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("not found");
    } else if (isNaN(index) || index < 0) {
      // not fo
      console.log("Error!");
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("not found");
    } else if (JSON.parse(data)[index] === undefined) {
      console.log("Error!");
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("not found");
    } else {
      console.log(JSON.parse(data)[index]);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(JSON.parse(data)[index]));
    }
  });
});

server.listen(port, function () {
  console.log("Listening on port", port);
});
