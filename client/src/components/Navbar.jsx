import React, { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';  // Import hamburger icon
import logo from '../images/logo.png';
import "../styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // For toggling the menu

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navbar_container">
      <div className="logos">
        <img src={logo} alt="logo" className='logo'/>
        <h1>Blood<span className="logospan">Line</span></h1>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <GiHamburgerMenu size={25} color="red" />
      </div>

      {isOpen && (
        <div className="menu_links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      )}
    </div>
  )
}

export default Navbar;
