const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");

const valaidateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
       
       if(error) {
        throw new ExpressError(400, error);
       } else {
        next();
       }
};

//Index Rout
router.get("/", 
    wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route
router.get(
    "/:id", 
    wrapAsync(async (req, res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id).populate("reviews");

   res.render("listings/show.ejs", {listing});
}));

//Create Route
router.post("/",
    valaidateListing, 
    wrapAsync(async (req, res, next) => {
       
        const newLisitng = new Listing(req.body.listing);
        await newLisitng.save();
        res.redirect("/listings");
    })
);
   


//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
   const listing = await Listing.findById(id); 
   res.render("listings/edit.ejs",{ listing});
}));

// Update Route
router.put("/:id",
    valaidateListing, 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    await 
    Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

module.exports = router;