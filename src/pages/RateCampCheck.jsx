import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function RateCampCheck() {
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submitRating() {
    if (!rating) return;

    localStorage.setItem(
      "campcheckRating",
      JSON.stringify({
        rating,
        feedback: feedback.trim(),
        submittedAt: new Date().toISOString(),
      })
    );

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rate-page">
        <div className="rate-card rate-success">
          <div className="rate-success-icon">⭐</div>

          <h1>Thanks for rating CampCheck!</h1>

          <p>
            Your feedback helps us make CampCheck better for campers.
          </p>

          <button
            className="rate-submit-btn"
            onClick={() => navigate("/settings")}
          >
            Back to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rate-page">
      <div className="rate-header">
        <h1>Rate CampCheck</h1>
        <p>We'd love to hear what you think.</p>
      </div>

      <div className="rate-card">
        <h2>How are you enjoying CampCheck?</h2>

        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`star-btn ${star <= rating ? "selected" : ""}`}
              onClick={() => setRating(star)}
              aria-label={`Rate ${star} out of 5`}
            >
              <FaStar />
            </button>
          ))}
        </div>

        <p className="rating-label">
          {rating === 0 && "Tap a star to rate"}
          {rating === 1 && "Poor"}
          {rating === 2 && "Could be better"}
          {rating === 3 && "It's good"}
          {rating === 4 && "Really good"}
          {rating === 5 && "Love it!"}
        </p>

        <label className="rate-feedback-label">
          Tell us more <span>(optional)</span>
        </label>

        <textarea
          className="rate-feedback"
          placeholder="What do you like about CampCheck? What could we improve?"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <button
          className="rate-submit-btn"
          onClick={submitRating}
          disabled={!rating}
        >
          Submit Rating
        </button>

        <button
          className="rate-back-btn"
          onClick={() => navigate("/settings")}
        >
          Back
        </button>
      </div>
    </div>
  );
}