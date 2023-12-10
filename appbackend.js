var express = require("express");
var cors = require("cors");
// var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

// Mongo
const url = "mongodb://127.0.0.1:27017";
const dbName = "fakestoredata";
const client = new MongoClient(url);
const db = client.db(dbName);




const PORT = "8081";
const host = "localhost";




const app = express();


app.use(bodyParser.json());
// const PORT = 4000;
app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.use("/images", express.static("images"));

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});


app.get("/api/get", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await db
    .collection("fakestore")
    .find(query)
    .limit(100)
    .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
});




app.get("/:id", async (req, res) => {
    const fakeid = Number(req.params.id);
    console.log("Product to find :", fakeid);

    await client.connect();
    console.log("Node connected successfully to GET-id MongoDB");
    const query = {"id": fakeid };

    const results = await db.collection("fakestore")
        .findOne(query);

    console.log("Results :", results);
    if (!results) res.send("Not Found").status(404);
    else res.send(results).status(200);
});
// /getFromId





app.post("/addProduct", async (req, res) => {

    await client.connect();
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);

    const id            = values[0];
    const title         = values[1];
    const price         = values[2];
    const description   = values[3];
    const category      = values[4];
    const image         = values[5];
    const rating        = values[6];

    console.log(id, title, price, description, category, image, rating);

    const newDocument = {
        "id" : id,
        "title" : title,
        "price" : price,
        "description" : description,
        "category" : category,
        "image" : image,
        "rating" : rating

    };

    const results = await db.collection("fakestore").insertOne(newDocument);
    res.status(200);
    res.send(results);



});




app.delete("/deleteProduct", async (req, res) => {
    await client.connect();
    // const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const id = values[0]; // id
    console.log("Product to delete :",id);
    const query = { id: id };
    const results = await db.collection("fakestore").deleteOne(query);
    res.status(200);
    res.send(results);
});



// // Route for update a post
// app.put("/api/update", (req, res) => {
//     const id = req.body.id;
//     const title = req.body.title;
//     const price = req.body.price;
//     const description = req.body.description;
//     const category = req.body.category;
//     const image = req.body.image;
//     const rating = req.body.rating;
//     console.log(id, title, price, description, category, image, rating);
//     db.query(
//     "UPDATE fakestore_catalog SET title=?, price=?, description=?, category=?, image=?, rating=? WHERE id=?",
//     [title, price, description, category, image, rating, id],
//     (err, result) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('Internal Server Error');
//         } else {
//             console.log(result);
//             res.status(200).send('Resource Updated');
//         }
//     }
//     );
// });