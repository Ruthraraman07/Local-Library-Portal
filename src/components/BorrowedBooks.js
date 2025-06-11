import React, { useEffect, useState } from "react";
import axios from "axios";

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      const response = await axios.get("/api/users/me/borrowedBooks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setBorrowedBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch borrowed books", error);
    }
  };

  return (
    <div>
      <h2>My Borrowed Books</h2>
      {borrowedBooks.length === 0 ? (
        <p>You have no borrowed books currently.</p>
      ) : (
        <ul>
          {borrowedBooks.map(({ book, borrowedUntil }) => (
            <li key={book._id}>
              <strong>{book.title}</strong> - Return by: {borrowedUntil}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BorrowedBooks;
