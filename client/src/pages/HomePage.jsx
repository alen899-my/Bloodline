import React, { useState } from 'react';
import "../styles/Homepage.css";

const HomePage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
        <h1>Find Your Blood Line</h1>
      </div>
    </div>
  );
};

export default HomePage;
