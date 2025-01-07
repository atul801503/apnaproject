// models/review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Register the schema with Mongoose and create the model
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
