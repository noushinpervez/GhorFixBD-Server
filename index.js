const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9crls8f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const servicesCollection = client.db("homeRepairServiceDB").collection("services");
        const bookedServicesCollection = client.db("homeRepairServiceDB").collection("bookedServices");

        // Fetch services
        app.get("/services", async (req, res) => {
            const result = await servicesCollection.find().toArray();
            res.send(result);
        });

        // Add a new service
        app.post("/add-service", async (req, res) => {
            const serviceData = req.body;
            const result = await servicesCollection.insertOne(serviceData);
            res.send(result);
        });

        // Fetch services by id
        app.get("/services/:id", async (req, res) => {
            const result = await servicesCollection.findOne({ _id: new ObjectId(req.params.id) });
            res.send(result);
        });

        // Book a service
        app.post("/book-service", async (req, res) => {
            const serviceData = req.body;
            const result = await bookedServicesCollection.insertOne(serviceData);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server is running...");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});