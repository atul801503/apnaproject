const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    location: String,
    country: String,
    image: {
        url: String,
        filename: String,
    },
    reviews: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Review' } // Ensure 'Review' matches the registered model name
    ],
});


module.exports = mongoose.model('Listing', listingSchema);
