require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.knvnnno.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
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

    const spotCollection = client.db('TrekTravels').collection('touristSpot');
    const countryCollection = client.db('TrekTravels').collection('countries');

    app.get('/touristspots', async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/touristspots/sort/:type', async (req, res) => {
      const type = req.params.type;
      if (type == "asc") {
        const cursor = spotCollection.find().sort({ "average_cost": -1 })
        const result = await cursor.toArray();
        res.send(result);
      }
      if (type == "desc") {
        const cursor = spotCollection.find().sort({ "average_cost": 1 })
        const result = await cursor.toArray();
        res.send(result);
      }
      else return;
    })

    app.get('/countries', async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/touristspots/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await spotCollection.findOne(query);
      res.send(result);
    })

    app.get('/touristspots/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const cursor = await spotCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/touristspots/country/:countryname', async (req, res) => {
      const country = req.params.countryname;
      const query = { country_name: country }
      const cursor = await spotCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.delete('/touristspots/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    })

    app.post('/touristspots', async (req, res) => {
      const newSpot = req.body;
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    })

    app.put('/touristspots/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const updatedSpot = req.body;

      const spot = {
        $set: {
          image: updatedSpot.image,
          tourists_spot_name: updatedSpot.tourists_spot_name,
          country_name: updatedSpot.country_name,
          location: updatedSpot.location,
          short_description: updatedSpot.short_description,
          average_cost: updatedSpot.average_cost,
          seasonality: updatedSpot.seasonality,
          travel_time: updatedSpot.travel_time,
          total_visitors_per_year: updatedSpot.total_visitors_per_year,
          email: updatedSpot.email,
          username: updatedSpot.username,
        }
      }

      const result = await spotCollection.updateOne(query, spot);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("API server for Trek Travels.")
})

app.listen(port, () => {
  console.log("Listening to Port: ", port)
})

