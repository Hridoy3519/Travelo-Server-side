const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.voagd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('travel-guide');
        const destinationCollections = database.collection('tour-destination');
        const orderCollections = database.collection('orders');


        //GET Tour Destination using API
        app.get('/tourDestinations', async(req,res) => {
            const cursor = destinationCollections.find({});
            const destinations = await cursor.toArray();

            res.send(destinations);
        })

        //Get API to load a single tour destination using ID
        app.get('/tourDestinations/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const destination = await destinationCollections.findOne(query);

            res.send(destination);
        })

        //Post API to post new Tour Destinations
        app.post('/addTourDestination', async(req,res) => {
            const destination = req.body;

            const result = await destinationCollections.insertOne(destination);
            res.json(result);

        })

        //Add Order Api
        app.post('/orders', async(req,res) => {
            const order = req.body;

            const result = await orderCollections.insertOne(order);

            res.json(result);
        })
    }
    finally{
        //await client.close();
    }    
}

run().catch(console.dir);

app.get("/", (req,res) => {
    res.send("Travel Guide Server is Running");
})

app.listen(port, () => {
    console.log("Listening to server at port", port);
})