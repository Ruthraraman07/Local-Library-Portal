    // BookModel.js
    const mongoose = require("mongoose");

    const BookSchema = new mongoose.Schema({
      title: { type: String, required: true },
      author: { type: String, required: true },
      genre: { type: String },
      genreCode: { type: String }, // New field
      readerLevel: { type: String }, // New field
      yearPublished: { type: String },
      cover: { type: String },
      rating: { type: Number, min: 1, max: 5 }, // New field
    }, { timestamps: true });

    module.exports = mongoose.model("Book", BookSchema);


    