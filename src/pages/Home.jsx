import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();


  const handleButtonClick = () => {
    navigate("/configurator");

  };

  return (
    <div className="home-container">
      {/* Centered Button */}
      <button className="configure-button" onClick={handleButtonClick}>
        CONFIGURE NOW
      </button>
      {/* SVG Arrow Mark */}
      <img
        src="src/assets/Arrow01.svg" /* Path to your SVG */
        alt="Arrow Mark"
        className="arrow-mark"
      />
    </div>
  );
};

export default Home;
