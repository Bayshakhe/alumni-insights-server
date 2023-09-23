const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// const routes = require('./routes')

// app.use(routes);
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qlguchx.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const studentsCollections = client.db("alumni-insights").collection("students");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // get all students
    app.get("/students", async (req, res) => {
      const result = await studentsCollections.find().toArray();
      // console.log(result)
      res.send(result);
    });

    // post signup student data
    app.post("/students", async (req, res) => {
      const postBody = req.body;
      const query = { email: postBody?.email };
      const exist = await studentsCollections.findOne(query);
      if (exist) {
        return res.send(exist);
      } else {
        const result = await studentsCollections.insertOne(postBody);
        return res.send(result);
      }
    });

    // post login user data and find in database
    app.post("/login", async (req, res) => {
      const postBody = req.body;
      // console.log(postBody);
      const query = { email: postBody?.email, password: postBody?.password };
      const exist = await studentsCollections.findOne(query);
      console.log(exist);
      if (exist) {
        return res.send(exist);
      } else {
        return res.send({
          error: "Something wrong with your email or password",
        });
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Alumni insights is running.");
});

app.listen(port, (req, res) => {
  console.log("Alumni insights is running port", port);
});
