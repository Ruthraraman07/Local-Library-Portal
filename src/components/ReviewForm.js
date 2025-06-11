import React, { useState } from "react";
import axios from "axios";

const ReviewForm = ({ bookId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [learningReflection, setLearningReflection] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/reviews",
        { bookId, rating, comment, learningReflection },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRating(1);
      setComment("");
      setLearningReflection("");
      if (onReviewSubmitted) onReviewSubmitted();
      alert("Review submitted successfully");
    } catch (error) {
      alert("Failed to submit review: " + error.response?.data?.error || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Write a Review</h3>
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Comment:
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
      <br />
      <label>
        Learning Reflection (required):
        <textarea
          value={learningReflection}
          onChange={(e) => setLearningReflection(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
