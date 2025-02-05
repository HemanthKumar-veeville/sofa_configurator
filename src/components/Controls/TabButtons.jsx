import React, { useState } from "react";
import "./Controlls.css";
import { FaCar, FaGlobe, FaShareAlt } from "react-icons/fa";

const TabButtons = () => {
  const [activeTab, setActiveTab] = useState("CAR");

  const tabs = [
    { id: "CAR", label: "CAR", icon: <FaCar /> },
    { id: "SCENE", label: "SCENE", icon: <FaGlobe /> },
    { id: "SHARE", label: "SHARE", icon: <FaShareAlt /> },
  ];

  return (
    <div className="tab-buttons-container">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabButtons;
