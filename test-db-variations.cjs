const { MongoClient } = require('mongodb');
require('dotenv').config();

const baseUri = "mongodb+srv://zetflix:kSBkY32TLEfXIUPV@cluster0.c6tlcfz.mongodb.net";
const variations = [
  `${baseUri}/zetflixtv?retryWrites=true&w=majority&appName=Cluster0`,
  `${baseUri}/?retryWrites=true&w=majority&appName=Cluster0`,
  `${baseUri}/zetflixtv?retryWrites=true&w=majority&appName=Cluster0&authSource=admin`,
  `${baseUri}/admin?retryWrites=true&w=majority&appName=Cluster0`
];

async function test(uri, index) {
  console.log(`\n--- Test Variation ${index + 1} ---`);
  console.log(`URI: ${uri.replace("kSBkY32TLEfXIUPV", "****")}`);
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    console.log("SUCCESS!");
    return true;
  } catch (err) {
    console.log(`FAILED: ${err.message}`);
    return false;
  } finally {
    await client.close();
  }
}

async function run() {
  for (let i = 0; i < variations.length; i++) {
    const success = await test(variations[i], i);
    if (success) {
      console.log(`\nSuccessfully connected with Variation ${i + 1}`);
      break;
    }
  }
}

run();
