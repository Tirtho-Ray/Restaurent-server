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
    const favoriteFoodCollection= client.db('RestaurantFood').collection('favorites');
    const restaurantUserCollection= client.db('RestaurantFood').collection('users');
    const restaurantCart = client.db('RestaurantFood').collection('cart');
    
   


    //  Get list of all available foods on the restaurant
    app.post('/foods',async(req, res)=>{
      const foods = req.body;
      const result = await foodCollection.insertOne(foods);
      res.send(result);
    })

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

    app.put('/foods/:id', async (req, res) => {
      try {
          const id = req.params.id;
          const updatedFood = req.body;
  
          const result = await foodCollection.updateOne(
              { _id: new ObjectId(id) },
              { $set: updatedFood }
          );
  
          if (result.modifiedCount > 0) {
              res.json({ message: 'Food item updated successfully' });
          } else {
              res.status(404).json({ message: 'Food item not found' });
          }
      } catch (error) {
          console.error('Error updating food item:', error);
          res.status(500).send('Internal Server Error');
          res.send(results)
      }
  });

  app.delete('/foods/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const result = await foodCollection.deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: ' item not found' });
      }
  
      res.json({ message: ' item deleted successfully' });
    } catch (error) {
      console.error('Error deleting  item:', error);
      res.status(500).send('Internal Server Error');
    }
  });

    

    // Add favorites items 
    app.post('/favorites', async (req, res) => {
      try {
        const favorite = req.body;
        const result = await favoriteFoodCollection.insertOne(favorite);
        res.send(result);
      } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).send('Internal Server Error');
      }
    });
    app.get('/favorites',async (req, res)=>{
      const cursor = favoriteFoodCollection.find();
      const result =await cursor.toArray();
      res.send(result);
    })

    app.delete('/favorites/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await favoriteFoodCollection.deleteOne({ _id: new ObjectId(id) });
    
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Favorite item not found' });
        }
    
        res.json({ message: 'Favorite item deleted successfully' });
      } catch (error) {
        console.error('Error deleting favorite item:', error);
        res.status(500).send('Internal Server Error');
      }
    });

     // User Registration
    app.post('/users', async (req, res) => {
        try {
          const user = req.body;
          const result = await restaurantUserCollection.insertOne(user);
          res.send(result);
        } catch (error) {
          console.error('Error adding to user:', error);
          res.status(500).send('Internal Server Error');
        }
    });

    app.get('/users', async (req, res) => {
        try {
          const cursor = restaurantUserCollection.find();
          const result = await cursor.toArray();
          res.send(result);
        } catch (error) {
          console.error('Error fetching users:', error);
          res.status(500).send('Internal Server Error');
        }
    });


    // Add cart items to foods list 
    app.post('/cart', async (req, res) => {
      try {
        const favorite = req.body;
        const result = await restaurantCart.insertOne(favorite);
        res.send(result);
      } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).send('Internal Server Error');
      }
    });
    app.get('/cart',async (req, res)=>{
      const cursor = restaurantCart.find();
      const result =await cursor.toArray();
      res.send(result);
    })

    app.delete('/cart/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await restaurantCart.deleteOne({ _id: new ObjectId(id) });
    
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Favorite item not found' });
        }
    
        res.json({ message: 'Favorite item deleted successfully' });
      } catch (error) {
        console.error('Error deleting favorite item:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    

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

