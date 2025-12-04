import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Helper function to generate slug from title
function slugify(text) {
  return (
    text
     .toString()
      .toLowerCase()
      .trim()
      .split(" ") // break by spaces
      .filter((word) => word !== "") // remove extra spaces
      .join("-") // join with dash
      .replace(/[^a-z0-9\-]/gi, "")
  ); // still need for symbols (optional)
}

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  image: {
    url: String,
    filename:String
  },
  price: Number,
  location: String,
  country: String,
  slug: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      // Generate slug from title + timestamp to ensure uniqueness
      return slugify(this.title);
    },
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  
  },
});

// Pre-save hook (optional, still works)
listingSchema.pre("save", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title) ;
  }
  next();
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;

export { slugify };
