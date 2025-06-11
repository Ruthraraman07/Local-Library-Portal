    // ReviewController.js
    const mongoose = require("mongoose");
    const Review = require("../Models/ReviewModel");

    // Create a new review
    const createReview = async (req, res) => {
      const { bookId, rating, comment, learningReflection } = req.body;
      const userId = req.user.id; // Assuming user authentication middleware

      try {
        const newReview = await Review.create({ bookId, userId, rating, comment, learningReflection });
        res.status(201).json(newReview);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    };

    // Get reviews for a book
    const getReviewsForBook = async (req, res) => {
      const { bookId } = req.params;

      try {
        const reviews = await Review.find({ bookId }).populate('userId', 'name'); // Populate user name
        res.status(200).json(reviews);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

    module.exports = { createReview, getReviewsForBook };
