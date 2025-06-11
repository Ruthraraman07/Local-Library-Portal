
import React, { useEffect, useState } from "react";
import { Button, InputGroup, Toaster, Position } from "@blueprintjs/core";
import axios from "axios";
import io from "socket.io-client";
import BookForm from "./components/BookForm";
import BookItem from "./components/BookItem";
import HomePage from "./components/HomePage"; // Import the HomePage component
import "./App.css";

const AppToaster = Toaster.create({ position: Position.TOP });
const socket = io("http://localhost:4000");

const App = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [filterAuthor, setFilterAuthor] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false); // New state for filter active
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for authentication

  const fetchBooks = async () => {
    try {
      const res = await axios.get("/api/books");
      setBooks(res.data);
    } catch (err) {
      AppToaster.show({ message: "Failed to fetch books", intent: "danger" });
    }
  };

  const handleFilter = async () => {
    if (!filterAuthor) return fetchBooks();
    try {
      const res = await axios.get(`/api/books/filter?author=${filterAuthor}`);
      setBooks(res.data);
      setIsFilterActive(true); // Set filter active to true
    } catch (err) {
      AppToaster.show({ message: "Failed to filter books", intent: "danger" });
    }
  };

  // New function to handle canceling the author filter
  const handleCancelFilter = () => {
    setFilterAuthor(""); // Reset the filter
    fetchBooks(); // Fetch all books again
    setEditingBook(null); // Reset editingBook to show the add book form
    setIsFilterActive(false); // Set filter active to false
  };

// Handle logout functionality
  const handleLogout = () => {
    setIsAuthenticated(false); // Reset authentication state
    setBooks([]); // Clear the books list
    setEditingBook(null); // Reset editingBook
    setFilterAuthor(""); // Reset filter
    setIsFilterActive(false); // Reset filter active state
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();

      socket.on("bookCreated", (book) => {
        if (isFilterActive) {
          handleFilter();
        } else {
          setBooks((prev) => {
            // Avoid adding duplicate book if it already exists
            if (prev.some(b => b._id === book._id)) {
              return prev;
            }
            return [book, ...prev];
          });
        }
      });

      socket.on("bookUpdated", (updatedBook) => {
        if (isFilterActive) {
          handleFilter();
        } else {
          setBooks((prev) =>
            prev.map((b) => (b._id === updatedBook._id ? updatedBook : b))
          );
        }
      });

      socket.on("bookDeleted", (id) => {
        if (isFilterActive) {
          handleFilter();
        } else {
          setBooks((prev) => prev.filter((b) => b._id !== id));
        }
      });

      // Cleanup function to disconnect socket on component unmount
      return () => {
        socket.off("bookCreated");
        socket.off("bookUpdated");
        socket.off("bookDeleted");
        socket.disconnect();
      };
    }
  }, [isAuthenticated]);

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {isAuthenticated ? (
        <>
          <div className="navbar">
            <h1 className="shiny-text">Book Library App</h1>
            <div className="filter-container">
              <InputGroup 
                className="filter-bar"
                value={filterAuthor}
                onChange={(e) => setFilterAuthor(e.target.value)}
                placeholder="Enter author's name"
                rightElement={<Button icon="filter" onClick={handleFilter} />}
              />
              {isFilterActive && (
                <Button
                  icon="cross"
                  onClick={handleCancelFilter}
                  className="cancel-button"
                >
                  Cancel
                </Button>
              )}
                <Button
                icon="log-out"
                onClick={handleLogout} // Call handleLogout on click
                className="logout-button"
              >
                Logout
              </Button>
            </div>
          </div>

          <div className="app-container">
          <BookForm editingBook={editingBook} setEditingBook={setEditingBook} setBooks={setBooks} />
          <div className="book-list">
            {books.map((book) => (
              <BookItem key={book._id} book={book} setEditingBook={setEditingBook} setBooks={setBooks} />
            ))}
          </div>
          </div>
        </>
      ) : (
        <HomePage onLoginSuccess={handleLoginSuccess} /> // Pass the login success handler
      )}
    </div>
  );
};

export default App;
