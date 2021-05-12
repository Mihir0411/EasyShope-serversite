const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9n4k9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const port = 5000



client.connect(err => {
  const collection = client.db("esyShop").collection("esyShopCollection");

  app.get('/product', (req, res) => {
    collection.find({})
      .toArray((err, items) => {
        res.send(items)
        console.log(items)
      })
  })
 

  app.get('/products/:id', (req, res) => {
    collection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  app.post('/addProduct', (req, res) => {
    const newEvent = req.body;
    console.log('hello new event', newEvent)
    collection.insertOne(newEvent)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  console.log('Hello')
});


client.connect(err => {
  const selectedCollection = client.db("EasyShop").collection("selectedCollection");
  app.post('/selectProduct', (req, res) => {
    const selectProduct = req.body
    selectedCollection.insertOne(selectProduct)
     .then(selected =>{
      res.send(selected.insertedCount > 0)
     })
  })

  app.get('/selected', (req, res) => {
    selectedCollection.find({})
      .toArray((err, selectItems) => {
        res.send(selectItems)
      })
  })

  app.delete('/delete/:id',(req,res)=>{
    const id = ObjectID(req.params.id)
    selectedCollection.deleteOne({_id: id})
    .then( result =>{
      res.send(result.deletedCount > 0);
    })
    // console.log(req.params.id);
  })


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)