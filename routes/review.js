const express = require("express");
const router = express.Router({ mergeParams: true }); // ✅ this is required

const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const reviews = require("../Models/review.js");
const Listing = require("../Models/listing.js");


const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new reviews(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log(listing);
    res.redirect(`/listings/${listing._id}`);
  })
);

//delete review rout
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await reviews.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;