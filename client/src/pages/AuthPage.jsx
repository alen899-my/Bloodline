import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Authpage.css";
import signupside from "../images/signupside.jpg";
import loginside from "../images/loginside.jpg";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          username: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Please login.");
        setIsSignup(false);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          confirm_password: "",
          phone: "",
        });
      } else {
        alert(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      {isSignup ? (
        <div className="signup_container">
          <div className="left_side_img">
            <img src={signupside} alt="Signup Side" />
          </div>
          <div className="signup_form_section">
            <h1>Sign Up</h1>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <button type="submit">Sign Up</button>
            </form>
            <p>
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignup(false);
                }}
              >
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
            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="submit">Sign In</button>
            </form>
            <p>
              Don't have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignup(true);
                }}
              >
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
