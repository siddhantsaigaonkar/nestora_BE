import Listing from "../models/listing.js";
import Review from "../models/review.js";

// ==========================================
// CREATE REVIEW
// ==========================================
export const createReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;

    const listing = await Listing.findOne({ slug: req.params.slug }).populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "username email",
      },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const review = await Review.create({
      comment,
      rating: Number(rating),
      author: req.user._id,
    });

    listing.reviews.push(review._id);
    await listing.save();
    await review.save();

    res.status(201).json({
      message: "Review added successfully!",
      review,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error during creating review",
    });
  }
};

// ==========================================
// DELETE REVIEW
// ==========================================
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    await Review.findByIdAndDelete(reviewId);

    await Listing.updateMany(
      { reviews: reviewId },
      { $pull: { reviews: reviewId } }
    );

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error during deleting review",
    });
  }
};
