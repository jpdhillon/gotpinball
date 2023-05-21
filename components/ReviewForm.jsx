import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../styles/ReviewForm.module.css";

const ReviewForm = ({ name, onReviewSubmitted }) => {
  const { data: session } = useSession();
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userReview: reviewText,
        locationName: name, // Use the received name prop
        // userName: session.user.name, // Assuming the user name is in session.user.name
      }),
    });

    if (response.ok) {
      setReviewText("");
      onReviewSubmitted(); // Call the callback function
      // Handle success, e.g. show a success message, refresh the reviews list, etc.
    } else {
      // Handle error, e.g. show an error message
      console.log("There was an error submitting the review");
    }
  };

  if (session) {
    return (
      <div className={styles.form}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="freeform">Leave a review for this location:</label>
          <br />
          <textarea
            id="freeform"
            name="freeform"
            rows="5"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <p>You are not signed in. Please sign in to submit a review for this location.</p>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }
};

export default ReviewForm;