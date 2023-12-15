import express from "express";
import petsData from "../pets.json" assert {type: 'json'};

const app = express();

app.use(express.json());

app.use(logger);

//get all pets
app.get('/pets', (req, res) => {
    //TODO request from db
    res.send(petsData);
});

//get specific pet
app.get('/pets/:id', (req, res) => {
    //TODO request from db
    const { id } = req.params;

    if(petsData[id] === undefined) {
        console.error("Not Found")
        res.status(404).set("Content-Type", "text/plain").send("Not Found");
    } else {
        res.send(petsData[id]);
    }
})

app.post('/pets', (req, res) => {
    const {name, kind, age} = req.body;
    const newPet = req.body;
    if(!name || !kind || !age || !Number.isInteger((Number(age)))) {
        res.status(400).set("Content-Type", "text/plain").send("Bad Request");
    } else {
        //TODO write to db
        petsData.push(newPet);
        res.send(newPet);
    }
});

app.patch('/pets/:id', (req, res) => {
    const { id } = req.params;
    const {name, kind, age} = req.body;
    let currentPet = petsData[id];

    if(petsData[id] === undefined) {
        console.error("Not Found")
        res.status(404).set("Content-Type", "text/plain").send("Not Found");
    } else if (!name || !kind || !age || !Number.isInteger((Number(age)))) {
      // TODO - add to Dereks's file
      res.status(400).set("Content-Type", "text/plain").send("Bad Request");
    } else {

        res.send(currentPet)
        //res.send(currentPet[id]);
    }
});

app.listen(8002, ()=> {
    console.log("Listening on port 8002...");
})

function logger(req, res, next) {
    console.log("Request Method: ", req.method);
    console.log("Request Path: ", req.url);
    next();
}

//{"age":5,"kind":"snake","name":"Buttons"}