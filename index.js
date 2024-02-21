const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT ||5000;
// console.log(process.env.DB_UserName + ' ' + process.env.DB_Password);

// middleware
app.use(cors());
app.use(express.json());

app.get('/',(req, res) =>{
    res.send("food is ready!");
});

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_UserName}:${process.env.DB_Password}@cluster0.thodmul.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const foodCollection= client.db('RestaurantFood').collection('foods');
    //  Get list of all available foods on the restaurant
    app.post('/foods',async(req, res)=>{
      const foods = req.body;
      const result = await foodCollection.insertOne(foods);
      res.send(result);
    })
    // app.get('/foods', async(req, res)=>{
    //   const cursor = foodCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result)
    // })

    app.get('/foods',async (req, res)=>{
      const cursor = foodCollection.find();
      const result =await cursor.toArray();
      res.send(result);
    })

    app.get('/foods/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await foodCollection.findOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port,()=>{
    console.log(`food is running on port${port}`)
});

