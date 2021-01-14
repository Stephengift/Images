const express = require("express");
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware");
const Review = require("../models/review");
const Campground = require("../models/campground");
const { reviewSchema } = require("../schemas.js");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

router.post("/", isLoggedin, validateReview, async(req,res) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Succesfully made a new review");
    res.redirect(`/campgrounds/${campground._id}`);
    //res.send("YOU MADE IT")
});

router.delete("/:reviewId", isLoggedin, isReviewAuthor, async(req,res) =>{
    const{id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Succesfully deleted a new review");
    res.redirect(`/campgrounds/${id}`);
});

module.exports = router;