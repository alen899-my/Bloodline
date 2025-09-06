import React from "react";
import "../styles/Authpage.css";
import signupside from "../images/signupside.jpg";

const AuthPage = () => {
  return (
    
      <div className="signup_container">
        <div className="left_side_img">
          <img src={signupside} alt="Signup Side" />
        </div>
        <div className="signup_form_section">
          <h1>Sign Up</h1>
          <form>
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />
            <button type="submit">Sign Up</button>
          </form>
          <p>
            Already have an account? <a href="#">Sign In</a>
          </p>
        </div>
      </div>
   
  );
};

export default AuthPage;
