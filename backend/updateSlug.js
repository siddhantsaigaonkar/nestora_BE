import mongoose from "mongoose";
import Listing from "./models/listing.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

const updateSlugs = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("DB connected");

    const listings = await Listing.find({ slug: { $exists: false } });
    for (const listing of listings) {
      listing.slug = slugify(listing.title);
      await listing.save();
      console.log(`Updated slug for: ${listing.title}`);
    }

    console.log("All slugs updated!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateSlugs();
