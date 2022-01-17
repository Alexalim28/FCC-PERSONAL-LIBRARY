const { MongoClient } = require("mongodb");
require("dotenv").config();

// Connection URI
const URI = process.env.MONGO_URI;

// Create a new Mongo client
const client = new MongoClient(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = async function run(callback) {
  try {
    // Connect the client on the server
    await client.connect();
    // Establish connection
    await callback(client);
    console.log("Connected to the database");
  } catch (error) {
    console.log("Cannot connect to the database ");
  }
};
