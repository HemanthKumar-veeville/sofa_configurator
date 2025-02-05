import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { BsArrowUpShort } from "react-icons/bs";

const Home = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/configurator");
  };

  return (
    <div className="home-container">
      {/* Video Section */}
      <div className="video-section">
        <video className="background-video" autoPlay loop muted playsInline>
          <source
            src="https://nusense.s3.us-east-1.amazonaws.com/nu3d/video/ac6db061-d0aa-4d39-a234-bf56cbe2e0d5.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="content-overlay">
          <button className="configure-button" onClick={handleButtonClick}>
            CONFIGURE NOW
          </button>
          <BsArrowUpShort className="arrow-mark" />
        </div>
      </div>
    </div>
  );
};

export default Home;
