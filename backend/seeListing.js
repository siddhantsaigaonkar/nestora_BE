import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "./models/listing.js";
import sampleListings from "./init/data.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const seedListings = async () => {
  try {
    await Listing.deleteMany(); // optional: clear existing listings
    const inserted = await Listing.insertMany(sampleListings);
    console.log(`Inserted ${inserted.length} listings`);
    mongoose.connection.close();
  } catch (err) {
    console.error("Error inserting listings:", err);
  }
};

seedListings();
