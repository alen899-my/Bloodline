import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import "../styles/Homepage.css";

const HomePage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate(); // Initialize navigate

  const clickfindbtn = () => {
    navigate("/auth"); // Redirect to AuthPage
  };

  const handleMouseMove = (e) => {
    setMousePos({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      setMousePos({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    }
  };

  return (
    <div 
      className="Homepage_container"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`
      }}
    >
      <div className="homepage_Content">
        <h1> Your <span className='blood'>Blood</span> Line is Here!</h1>
        <button className='find_btn' onClick={clickfindbtn}>Find my Line</button>
      </div>
    </div>
  );
};

export default HomePage;
