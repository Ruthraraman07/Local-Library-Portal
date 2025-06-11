// BookController.js
const mongoose = require("mongoose");
const Book = require("../Models/BookModel");
const User = require("../Models/UserModel");
const fs = require("fs");
const path = require("path");

// Create a new book
const createBook = async (req, res) => {
  const { title, author, genre, genreCode, readerLevel, yearPublished } = req.body;
  let { rating } = req.body; // Allow rating to be undefined

  if (!title || !author || !genre || !genreCode || !readerLevel || !yearPublished) {
    return res.status(400).json({ error: "Please fill in all required fields" });
  }

  // Validate rating
  if (rating === undefined || rating === null || rating === "") {
    rating = 1; // Set default rating to 1 if not provided
  } else {
    rating = parseInt(rating, 10); // Parse rating to integer
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    }
  }

  try {
    const bookData = {
      title,
      author,
      genre,
      genreCode,
      readerLevel,
      yearPublished,
      rating,
    };

    if (req.file) {
      bookData.cover = req.file.filename;
    }

    const book = await Book.create(bookData);
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single book
const getSingleBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid book ID" });
  }

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a book
const updateBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid book ID" });
  }

  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.cover = req.file.filename;
    }

    const book = await Book.findByIdAndUpdate({ _id: id }, updateData, { new: true }); // Return updated document
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid book ID" });
  }

  try {
    const book = await Book.findByIdAndDelete({ _id: id });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Filter books by author
const filterBooksByAuthor = async (req, res) => {
  const { author } = req.query;

  try {
    const books = await Book.find({ author: { $regex: author, $options: "i" } }); // Case-insensitive search
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Borrow a book
const dateFormat = require('../utils/dateFormat');

const borrowBook = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.id; // Assuming you have middleware to authenticate user and attach user object to req

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: "Invalid book ID" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.borrowedBooks.length >= 3) {
      return res.status(400).json({ error: "Cannot borrow more than 3 books" });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // Check genre restriction
    const borrowedGenreCodes = [];
    // Clean up invalid borrowedBooks entries and collect genreCodes
    const validBorrowedBooks = [];
    for (const borrowedBook of user.borrowedBooks) {
      const borrowedBookData = await Book.findById(borrowedBook.bookId);
      if (borrowedBookData) {
        borrowedGenreCodes.push(borrowedBookData.genreCode);
        validBorrowedBooks.push(borrowedBook);
      }
    }
    // Optional: update user's borrowedBooks to remove invalid entries
    if (validBorrowedBooks.length !== user.borrowedBooks.length) {
      user.borrowedBooks = validBorrowedBooks;
      await user.save();
    }

    if (borrowedGenreCodes.includes(book.genreCode)) {
      return res.status(400).json({ error: "Cannot borrow two books from the same genre" });
    }

    // Set borrow until date (e.g., 3 weeks from now)
    const borrowedUntil = new Date();
    borrowedUntil.setDate(borrowedUntil.getDate() + 21);

    user.borrowedBooks.push({ bookId: bookId, borrowedUntil: borrowedUntil });
    await user.save();

    res.status(200).json({ message: "Book borrowed successfully", borrowedUntil: dateFormat(borrowedUntil) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Return a book
const returnBook = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: "Invalid book ID" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Remove the book from borrowedBooks array
    user.borrowedBooks = user.borrowedBooks.filter(borrowedBook => borrowedBook.bookId.toString() !== bookId);
    await user.save();

    res.status(200).json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    createBook,
    getBooks,
    getSingleBook,
    updateBook,
    deleteBook,
    filterBooksByAuthor,
    borrowBook,
    returnBook
};
