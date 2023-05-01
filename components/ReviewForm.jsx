import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const ReviewForm = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <form>
          <label for="freeform">Leave a review for this location:</label>
          <br />
          <textarea id="freeform" name="freeform" rows="4" cols="50">
            Enter review here...
          </textarea>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
     ) 
    } else {
      return (
          <div>
            <p>You are not signed in. Please sign in to submit a review for this location.</p>
            <button onClick={() => signIn()}>Sign in</button>
          </div>
          
        );
    }
}

export default ReviewForm;