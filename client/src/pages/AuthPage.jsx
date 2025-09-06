import React, { useState } from "react";
import "../styles/Authpage.css";
import signupside from "../images/signupside.jpg";
import loginside from "../images/loginside.jpg";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  

  return (
    <>
      {isSignup ? (
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
              Already have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(false); }}>
                Sign In
              </a>
            </p>
          </div>
        </div>
      ) : (
        <div className="login_Container">
          <div className="left_side_img">
            <img src={loginside} alt="Login Side" />
          </div>
          <div className="signup_form_section">
            <h1>Sign In</h1>
            <form>
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">Sign In</button>
            </form>
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(true); }}>
                Sign Up
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthPage;
