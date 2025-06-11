import React, { useState } from "react";
import { Button, Card, Elevation } from "@blueprintjs/core";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from '../context/AuthContext'; // Import the auth context

const placeholderImage = "/placeholder.jpg";

const BookItem = ({ book, setEditingBook }) => {
  const { auth } = useAuth(); // Get the authentication state and user info

  if (!book) {
    return null; // or return a placeholder UI
  }

  const { _id, title, author, genre, genreCode, readerLevel, yearPublished, cover, rating } = book;

  const [borrowedUntil, setBorrowedUntil] = useState(null);

  const handleDelete = async () => {
    if (window.confirm("Delete this book?")) {
      await axios.delete(`/api/books/${_id}`);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholderImage;
    console.warn(`Failed to load image for book: ${title}`);
  };

const coverImageUrl = cover ? `http://localhost:4000/${cover}?t=${new Date().getTime()}` : placeholderImage;

  const handleBorrow = async () => {
    try {
      const response = await axios.post(`/api/books/borrow/${_id}`, {}, {
        headers: {
          Authorization: `Bearer ${auth.token}` // Include the token in the request
        }
      });
      setBorrowedUntil(response.data.borrowedUntil);
      alert(`Borrowed until: ${response.data.borrowedUntil}`);
    } catch (error) {
      alert("Borrowing failed: " + error.response.data.error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.5 }}
    >
      <Card elevation={Elevation.ONE} className="book-item">
        <div className="book-details">
          <img
            src={coverImageUrl}
            alt={title}
            onError={handleImageError}
            className="book-cover"
          />

          <div className="book-actions">
            <h3>{title}</h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <strong>Author:</strong> {author}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <strong>Genre:</strong> {genre}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <strong>Year:</strong> {yearPublished}
            </motion.p>
            <motion.p>
              <strong>Genre Code:</strong> {genreCode}
            </motion.p>
            <motion.p>
              <strong>Reader Level:</strong> {readerLevel}
            </motion.p>
            <motion.p>
              <strong>Rating:</strong> {rating}
            </motion.p>

            {auth?.token ? (
              <>
                <Button icon="edit" onClick={() => setEditingBook(book)} />
                <Button icon="trash" onClick={handleDelete} intent="danger" />
                <Button onClick={handleBorrow}>Borrow</Button>
                {borrowedUntil && <p>Borrowed until: {borrowedUntil}</p>}
              </>
            ) : null}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

    export default BookItem;
    