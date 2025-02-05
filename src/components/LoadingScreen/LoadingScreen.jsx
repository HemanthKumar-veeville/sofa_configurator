import React from "react";
import "./LoadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loader"></div>
      <p>Loading 3D Environment...</p>
    </div>
  );
};

export default LoadingScreen;
