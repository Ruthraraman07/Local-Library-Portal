import React, { useState, useEffect } from "react";
import axios from "axios";
import BookItem from "./BookItem";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    genre: "",
    author: "",
    rating: ""
  });

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchBooks = async () => {
    try {
      let url = "/api/books";
      const params = {};
      if (filters.author) params.author = filters.author;
      // For genre and rating, filter client-side after fetching all books
      const response = await axios.get(url, { params });
      let filteredBooks = response.data;

      if (filters.genre) {
        filteredBooks = filteredBooks.filter(book =>
          book.genre.toLowerCase().includes(filters.genre.toLowerCase())
        );
      }
      if (filters.rating) {
        filteredBooks = filteredBooks.filter(book =>
          book.rating >= parseInt(filters.rating)
        );
      }
      setBooks(filteredBooks);
    } catch (error) {
      console.error("Failed to fetch books", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Available Books</h2>
      <div className="filters">
        <input
          type="text"
          name="genre"
          placeholder="Filter by genre"
          value={filters.genre}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Filter by author"
          value={filters.author}
          onChange={handleFilterChange}
        />
        <select
          name="rating"
          value={filters.rating}
          onChange={handleFilterChange}
        >
          <option value="">Filter by rating</option>
          {[1,2,3,4,5].map(r => (
            <option key={r} value={r}>{r} and above</option>
          ))}
        </select>
      </div>
      <div className="book-list">
        {books.filter(book => book != null).map(book => (
          <BookItem key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookList;
