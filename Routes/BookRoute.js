    // BookRoute.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const requireAuth = require('../Middleware/requireAuth');
const borrowLogger = require('../Middleware/borrowLog');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

const {
    createBook,
    getBooks,
    getSingleBook,
    updateBook,
    deleteBook,
    filterBooksByAuthor,
    borrowBook, // New
    returnBook  // New
} = require("../Controllers/BookController");

router.post('/', upload.single('cover'), createBook);
router.get('/', getBooks);
router.get("/filter", filterBooksByAuthor);
router.get("/:id", getSingleBook);
router.patch("/:id", upload.single('cover'), updateBook);
router.delete("/:id", deleteBook);

// Apply requireAuth and borrowLogger middleware to borrow and return routes
router.post('/borrow/:bookId', requireAuth, borrowLogger, borrowBook);
router.post('/return/:bookId', requireAuth, borrowLogger, returnBook);

module.exports = router;

