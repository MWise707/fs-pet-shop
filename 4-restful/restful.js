import express from "express";
import petsData from "../pets.json" assert { type: "json" };
import pg from "pg";

const port = 8000;
const db = new pg.Pool({
  connectionString: "postgres://localhost/petshop",
});

const app = express();

app.use(express.json());

app.use(logger);

//get all pets
app.get("/pets", (req, res) => {
  db.query("SELECT * FROM petshop;")
    .then((inventory) => {
      res.send(inventory.rows);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

//get specific pet
app.get("/pets/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM petshop WHERE pet_id = ($1)", [id])
    .then((pet) => {
      if (pet === undefined) {
        console.log("Pet is undefined");
        res.status(404).send("Not found");
      } else {
        console.log("Successfully read pet: ", pet.rows);
        res.send(pet.rows);
      }
    })
    .catch((error) => {
      console.error("Error reading specific pet", error);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/pets", (req, res) => {
  const { name, kind, age } = req.body;
  const newPet = req.body;
  if (!name || !kind || !age || !Number.isInteger(Number(age))) {
    res.status(400).set("Content-Type", "text/plain").send("Bad Request");
  } else {
    db.query(
      "INSERT INTO petshop (pet_id, name, kind, age) VALUES (default, $1, $2, $3)",
      [name, kind, age]
    )
      .then((newPet) => {
        console.log("Added new pet: ", name, kind, age);
        res.send([name, kind, age]);
      })
      .catch((error) => {
        console.error("Error adding new Pet: ", error);
        res.status(500).send("Internal Server Error");
      });
  }
});

app.patch("/pets/:id", (req, res) => {
  const { id } = req.params;
  const { name, kind, age } = req.body;

  if (!name || !kind || !age || !Number.isInteger(Number(age))) {
    console.log("Request body not properly formatted");
    res.status(400).set("Content-Type", "text/plain").send("Bad Request");
  } else {
    db.query(
      "UPDATE petshop SET name = $2, kind = $3, age = $4 WHERE pet_id = $1",
      [id, name, kind, age]
    )
      .then((result) => {
        if (result.rowCount === 0) {
          console.log("Pet is undefined");
          res.status(404).send("Not found");
        } else {
          res.send({ id, name, kind, age });
        }
      })
      .catch((error) => {
        console.error("Error updating pet: ", error.message);
        res.status(500).send("Sorry - Error updating pet");
      });
  }
});

app.delete("/pets/:id", (req, res) => {
  const { id } = req.params;
  let oldPet = {};
  db.query("SELECT * FROM petshop WHERE pet_id = $1", [id])
  .then((pet) => {
    if (pet === undefined) {
      console.log("Pet is undefined");
      res.status(404).send("Not found");
    } else {
      const { name, age, kind } = pet.rows[0];
      oldPet = { id, name, age, kind };
      db.query("DELETE FROM petshop WHERE pet_id = $1", [id])
      .then((result) => {
          console.log("Deleted Pet: ", oldPet);
          res.send(oldPet);
      })
      .catch((error) => {
        console.error("Error deleting pet: ", error.message);
        res.status(500).send("Sorry - Error deleting pet");
      })
    }
  })
  .catch((error) => {
    console.error("Error deleting pet: ", error.message);
    res.status(500).send("Sorry - Error deleting pet");
  })
});4

app.use("/*", (req, res) => {
  res.status(404).set("Content-Type", "text/plain").send("Not Found");
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});

function logger(req, res, next) {
  console.log("Request Method: ", req.method);
  console.log("Request Path: ", req.url);
  next();
}
