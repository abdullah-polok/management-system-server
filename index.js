require('dotenv').config();
const express = require('express')
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

///middleware
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0veicth.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection

        const alltaskCollections = client.db("taskManagement").collection("tasks")

        app.get('/alltasks', async (req, res) => {
            const cursor = alltaskCollections.find();
            const result = await cursor.toArray();
            res.send(result)
        })



        ////post add task  data into the database
        app.post('/alltasks', async (req, res) => {
            const task = req.body;
            const result = await alltaskCollections.insertOne(task)
            res.send(result)
        })


        ///Delete a specific data and store into database
        app.delete('/alltasks/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await alltaskCollections.deleteOne(query);
            res.send(result)
        })



        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Task Management system server is running')
})

app.listen(port, () => {
    console.log(`Task Management system server is running on ${port}`)
})