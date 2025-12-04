



import express from "express";
import upload from "../multer.js";


import {
  getAllListings,
  showNewForm,
  createListing,
  updateListing,
  deleteListing,
  getListingBySlug,
} from "../controllers/listingController.js";

import validateListing from "../middleware/validate.js";
import isLoggedIn from "../middleware/isLoggedIn.js";

const router = express.Router();

router
  .route("/")
  .get(getAllListings)
  .post(isLoggedIn, upload.single("image"), validateListing, createListing);

router.route("/new").get(isLoggedIn, showNewForm);

router
  .route("/:slug")
  .get(getListingBySlug)
  .put(isLoggedIn, upload.single("image"), updateListing);

router.route("/:slug/delete").delete(isLoggedIn, deleteListing);

export default router;
