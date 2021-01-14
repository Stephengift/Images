const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const{isLoggedin, isAuthor, validateCampground} = require("../middleware");

const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const campground = require("../models/campground");


router.get("/",async (req,res) =>{
    const campgrounds = await Campground.find({});
     res.render("campgrounds/index", {campgrounds})
});

router.get("/new", isLoggedin, (req,res) =>{
    res.render("campgrounds/new")
});

router.post("/", isLoggedin, /*validateCampground*/ async (req,res, next)=>{
    const campground = new  Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Succesfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`)
});

router.get("/:id", async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate({
        path :"reviews",
        populate: {
            path: "author",
        }
    }).populate("author");
    console.log(camp);

    if(!campground){
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {camp});
});

router.get("/:id/edit", isLoggedin, isAuthor, async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {camp})
});

router.put('/:id', isLoggedin, isAuthor,/*validateCampground*/ async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.camp });
    req.flash("success", "Succesfully made a new campground");
    res.redirect(`/campgrounds/${camp._id}`)
});

router.delete('/:id', isLoggedin, isAuthor, async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Succesfully deleted a new campground");
    res.redirect('/campgrounds');
});

module.exports = router;