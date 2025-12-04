import Review from "../models/review.js";

export default async function isAuthor(req, res, next) {
  const { id } = req.params; // review id
  const review = await Review.findById(id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  if (!review.author.equals(req.user._id)) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this review" });
  }

  next();
}
