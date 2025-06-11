import React, { useState } from "react";
import { Button } from "@blueprintjs/core";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import BookList from "./BookList";
import BorrowedBooks from "./BorrowedBooks";
import ReviewForm from "./ReviewForm";
import "./HomePage.css";

const HomePage = ({ onLoginSuccess }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
  };
  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    setShowLogin(false);
    setShowRegister(false);
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleSelectBookForReview = (bookId) => {
    setSelectedBookId(bookId);
    setShowReviewForm(true);
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setSelectedBookId(null);
  };

  return (
    <div className="home-page">
      <div className="navbar1">
        <h1>Book Library</h1>
        <div className="auth-buttons">
          {!loggedIn && (
            <>
              <Button onClick={handleRegisterClick}>Register</Button>
              <Button onClick={handleLoginClick}>Login</Button>
            </>
          )}
        </div>
      </div>
      <div className="form-container">
        {showRegister && <RegisterForm setShowRegister={setShowRegister} setShowLogin={setShowLogin} />}
        {showLogin && <LoginForm setShowLogin={setShowLogin} onLoginSuccess={handleLoginSuccess} setShowRegister={setShowRegister} />}
        {!showRegister && !showLogin && loggedIn && (
          <>
            <BookList onSelectBookForReview={handleSelectBookForReview} />
            <BorrowedBooks />
            {showReviewForm && selectedBookId && (
              <ReviewForm bookId={selectedBookId} onReviewSubmitted={handleReviewSubmitted} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
