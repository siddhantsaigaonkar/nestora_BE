// import express from "express"
// const router = express.Router();
// import Listing from "../models/listing.js";
// import Review from "../models/review.js";
// import isLoggedIn from "../middleware/isLoggedIn.js";
// import isAuthor from "../middleware/isAuthorized.js";



// router.post("/listings/:slug/reviews",isLoggedIn ,async (req, res) => {
//   try {
//     const { comment, rating } = req.body;

//     const listing = await Listing.findOne({ slug: req.params.slug }).populate({
//       path: "reviews",
//       populate: {
//         path: "author",
//         select: "username email", // only send needed fields
//       },
//     });

    
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }

//     const review = await Review.create({ comment, rating: Number(rating) });


//     review.author = req.user._id
//     listing.reviews.push(review._id);
//     await listing.save();
//         await review.save();

//     res.status(201).json({ message: "Review added successfully!", review });

//   } catch (err) {
//     console.error(err);
      
//     res.status(500).json({ message: "Server error during review creating" });
//   }
// });


// router.delete("/reviews/:id", isLoggedIn, isAuthor, async (req, res) => {
//   try {
//     const reviewId = req.params.id;

//     // Delete the review (already authorized)
//     await Review.findByIdAndDelete(reviewId);

//     // Remove review reference from listings
//     await Listing.updateMany(
//       { reviews: reviewId },
//       { $pull: { reviews: reviewId } }
//     );

//     res.json({ message: "Review deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// export default router


// import express from "express";
// import { createReview, deleteReview } from "../controllers/reviewController.js";
// import isLoggedIn from "../middleware/isLoggedIn.js";
// import isAuthor from "../middleware/isAuthorized.js";

// const router = express.Router();

// // CREATE REVIEW
// router.post("/listings/:slug/reviews", isLoggedIn, createReview);

// // DELETE REVIEW
// router.delete("/reviews/:id", isLoggedIn, isAuthor, deleteReview);

// export default router;


import express from "express";
import { createReview, deleteReview } from "../controllers/reviewController.js";
import isLoggedIn from "../middleware/isLoggedIn.js";
import isAuthor from "../middleware/isAuthorized.js";

const router = express.Router();

// CREATE REVIEW (on a listing)
router.route("/listings/:slug/reviews").post(isLoggedIn, createReview);

// DELETE REVIEW (by id)
router.route("/reviews/:id").delete(isLoggedIn, isAuthor, deleteReview);

export default router;

