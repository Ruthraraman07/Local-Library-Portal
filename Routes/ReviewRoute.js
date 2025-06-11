    // ReviewRoute.js
    const express = require('express');
    const router = express.Router();
    const { createReview, getReviewsForBook } = require("../Controllers/ReviewController");
    const requireAuth = require('Backend\middleware\requireAuth.js'); // Assuming you have an auth middleware

    router.use(requireAuth); // Protect review routes

    router.post('/', createReview);
    router.get('/:bookId', getReviewsForBook);

    module.exports = router;
    