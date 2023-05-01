import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react";
import styles from '../styles/SignIn.module.css'


const SignIn = () => {
  const [latestReviews, setLatestReviews] = useState([])

  useEffect(() => {
    const fetchLatestReviews = async () => {
      const response = await fetch('/api/latestReviews')
      const data = await response.json()
      setLatestReviews(data)
    }

    fetchLatestReviews()
  }, [])

  return (
    <div className={styles.review}>      
      <h2>Check out the latest reviews from our users:</h2>
      {latestReviews.map((review) => (
        <div key={review.id}>
          <p>{review.userReview} - {review.locationName}</p>
        </div>
      ))}
      <div className={styles.signIn}>
        <h2>Sign in to review your favorite places to play pinball!</h2>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    </div>
  )
}

export default SignIn