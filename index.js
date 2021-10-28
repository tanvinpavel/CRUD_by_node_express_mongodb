const express = require('express');
require('dotenv').config()
var cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


//user: genius-car-mechanic
//pass: VAV2vTWNXzVPv66J

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.codto.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//mongodb connection
async function run(){
    try{
        await client.connect();

        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        //post api
        app.post('/services', async (req, res) => {
            const servicesData = req.body;
            console.log('server hitted', servicesData);
            
            const result = await servicesCollection.insertOne(servicesData);

            // console.log(result);
            console.log(result);
            res.json(result);
        });

        //get all services
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //delete services
        app.delete('/manageServices/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const result = await servicesCollection.deleteOne(query);
            
            console.log('delete hitted', result);
            res.send(result)
        })

        //get single services
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('single service id', id);

            const query = { _id: ObjectId(id) };

            const result = await servicesCollection.findOne(query);
            console.log("database hitted", result);

            res.send(result);
        })

    }finally{

    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('hello world');
})

app.listen(port, (req, res) => {
    console.log('listing to port', port);
})