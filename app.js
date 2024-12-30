const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path  = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js")
const Review = require("./models/review.js")
const listings = require("./routes/listing.js");
const listing = require("./models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log("Error connecting to DB:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res) => { 
    res,send("Hi, I am root");
});



const valaidateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
       let errMsg = error.details.map((el) => el.message).join(",");
       if(error) {
        throw new ExpressError(400, errMsg);
       } else {
        next();
       }
};

app.use("/listings", listings);




//Reviews 
// Post Route

app.post('/listings/:id/reviews', async (req, res) => {
    try {
        const { error } = reviewSchema.validate(req.body);
        if (error) {
            throw new Error(error.details[0].message); // Log the exact validation issue
        }
        const listing = await Listing.findById(req.params.id);
        const newReview = new Review(req.body.review);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error(err.message);
        res.status(400).send(err.message);
    }
});


app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    // Route Parameters
    let { id, reviewId } = req.params;
  
    // Remove the review from the Listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
    // Delete the Review document itself
    await Review.findByIdAndDelete(reviewId);
  
    // Redirect the user back to the listing page
    res.redirect(`/listings/${id}`);
  }));
  



app.get("/listings/:id", wrapAsync(async (req, res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("listings/show.ejs", {listing});
}));

// app.get("/testListing", async (req, res) => {
//    let sampleListing = new Listing({
//             title: "My Sweet Patna",
//             description: "By the Town",
//             price: 1000,
//             location: "JD Women Hostel",
//             country: "India",
//         });

//         await sampleListing.save();
//         console.log("Sample was saved");
//         res.send("Successful testing");
    
// });

// Catch-all route for undefined routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err, statusCode, message });
});



app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});