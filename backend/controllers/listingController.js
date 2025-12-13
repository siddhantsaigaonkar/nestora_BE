import Listing from "../models/listing.js";
import { slugify } from "../models/listing.js";

// =============================
// GET ALL LISTINGS
// =============================
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// SHOW NEW LISTING PAGE
// =============================
export const showNewForm = (req, res) => {
  return res.json({ message: "OK" });
};

// =============================
// CREATE LISTING
// =============================
export const createListing = async (req, res) => {
  try {
    // console.log("=== STEP 1: Route hit ===");

    // // Log request body
    // console.log("REQ.BODY:", req.body);

    // // Log multer file
    // console.log("REQ.FILE:", req.file);

    const { title, description, price, location, country } = req.body;

    if (!title) {
      // console.log("STEP 2: Missing title");
      return res.status(400).json({ message: "Title is required" });
    }

    // STEP 3: Declare imageData BEFORE using
    let imageData = {
      url: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.1.0&w=3000",
      filename: "default-image",
    };

    // console.log("STEP 3a: INITIAL imageData:", imageData);

    if (req.file) {
      // console.log("STEP 3b: File detected — using Cloudinary uploaded file");

      imageData = {
        url: req.file.path,
        filename: req.file.filename || req.file.originalname,
      };

      // console.log("STEP 3c: UPDATED imageData (Cloudinary):", imageData);
    } else {
      // console.log("STEP 3b: No file uploaded, using default image");
    }

    console.log("STEP 4: Creating listing in DB...");
    const newListing = await Listing.create({
      title,
      description,
      price: Number(price) || 0,
      location,
      country,
      owner: req.user?._id,
      image: imageData,
      slug: slugify(title),
    });

    // console.log("STEP 5: Listing created successfully!", newListing);

    return res.status(201).json({
      success: true,
      message: "Listing created successfully!",
      listing: newListing,
    });
  } catch (err) {
    // console.error("STEP 6: CREATE LISTING ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during listing creation",
      error: err.message,
    });
  }
};





export const updateListing = async (req, res) => {
  try {


    const slug = req.params.slug;
    const existing = await Listing.findOne({ slug });

    if (!existing) {
      // console.log("Listing not found for slug:", slug);
      return res.status(404).json({ message: "Listing not found" });
    }

    if (req.body.title && req.body.title !== existing.title) {
      req.body.slug = slugify(req.body.title);
    }

    if (req.file) {
      req.body.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    } else {
      req.body.image = existing.image;
    }

    const updated = await Listing.findOneAndUpdate({ slug }, req.body, {
      new: true,
      runValidators: true,
    });

    console.log("Updated listing:", updated?._id);
    return res.json({
      success: true,
      message: "Listing updated successfully!",
      listing: updated,
    });
  } catch (err) {
    console.error("UPDATE LISTING ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server error while updating listing",
      stack: err?.stack,
    });
  }
};


// =============================
// DELETE LISTING
// =============================
export const deleteListing = async (req, res) => {
  try {
    const slug = req.params.slug;
    const deleted = await Listing.findOneAndDelete({ slug });

    if (!deleted) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json({ message: "Listing deleted successfully", deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// SHOW SINGLE LISTING
// =============================
export const getListingBySlug = async (req, res) => {
  try {
    const listing = await Listing.findOne({ slug: req.params.slug })
      .populate("reviews")
      .populate("owner", "username email")
      .populate({
        path: "reviews",
        populate: {
          path: "author",
          select: "username email",
        },
      });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json({
      listing,
      currentUserId: req.user ? req.user._id.toString() : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
