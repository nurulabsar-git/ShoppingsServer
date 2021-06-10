const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
require('dotenv').config()


const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9ncf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
client.connect(err => {
  console.log("error:", err);
  const collection = client.db("myCommerce").collection("commerce");
  const orderCollection = client.db("myCommerce").collection("orders");
  console.log("Connection successfully done");
  // console.log(orderCollection);
  // console.log(collection);

app.post('/addProductInMongoDb', (req, res) =>{
  const newData = req.body;
  collection.insertOne(newData)
  .then(result => {
    res.send(result.insertedCount > 0)
  })

})


app.get('/getProduct', (req, res) => {
  collection.find()
  .toArray((err, product) =>{
    res.send(product);
  })
})

app.get('/getCertainProduct/:id', (req, res) => {
const id = ObjectID(req.params.id)
// console.log(id);
collection.find({_id: id})
.toArray((err, orders) => {
  // console.log(orders[0]);
  res.send(orders[0])
})
})


app.post('/addOrders', (req, res) => {
  const newProduct = req.body;
  orderCollection.insertOne(newProduct)
  .then(result => {
    res.send(result.insertedCount > 0)
  })
})

app.get('/getOrder', (req, res) => {
  orderCollection.find({})
  .toArray((err, order) => {
    console.log(order);
    console.log(err);
    res.send(order);
  })
})

app.delete('/deleteOrderItem:id', (req, res) => {

  const objectId = ObjectID(req.params.id);
  console.log(objectId);

  orderCollection.deleteOne({_id: objectId})
  .then((err, document) => res.send({
    success : true
  }))

})

});








app.get('/', (req, res) => {
  res.send('Hello World!, This is server side')
})

app.listen(process.env.PORT || 9000, () => {
  console.log("http://localhost:9000")
})