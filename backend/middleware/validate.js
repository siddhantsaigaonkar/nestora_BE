import ExpressError from "../utils/ExpressError.js";
import listingJoiSchema from "../joiSchema.js";

export default function validateListing(req, res, next) {
  const { error, value } = listingJoiSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, msg));
  }

  req.body = value;
  next();
}
