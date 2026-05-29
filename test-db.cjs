const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DATABASE;
if (!uri) {
  console.error("Error: DATABASE environment variable not defined in .env");
  process.exit(1);
}

console.log("Attempting to connect to MongoDB...");
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("SUCCESS: Successfully connected to MongoDB!");
    const db = client.db();
    console.log(`Connected database name: ${db.databaseName}`);
  } catch (err) {
    console.error("ERROR: Failed to connect to MongoDB:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
