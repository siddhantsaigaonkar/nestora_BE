// index.js
import express from "express";
import mongoose from "mongoose";
import Listing from "../models/listing.js"; // your existing model
import sampleListing from "./data.js"
const app = express();
const port = 3002;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

async function main() { 
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL);
    console.log("Database connected");

    // Show database name
    console.log("Connected to database:", mongoose.connection.name);

    // List all collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Collections in database:",
      collections.map((c) => c.name)
    );

    // Fetch and print all listings
    const listings = await Listing.find({});
    console.log("Listings in DB:", listings);
  } catch (err) {
    console.error(err);
  }
}

main();




const ownerId = "6926ef4afc3a9f2dc1279b61";

async function update() {




  await Listing.updateMany({}, { owner: ownerId });
  console.log("Updated all!");
  mongoose.connection.close();
}

update();

app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
