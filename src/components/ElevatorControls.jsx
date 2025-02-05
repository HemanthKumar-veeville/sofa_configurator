import React, { useState } from "react";
import "./ElevatorControls.css";
// Import icons from react-icons
import { BsEyeFill, BsGrid1X2 } from "react-icons/bs";
import { FaChartArea } from "react-icons/fa";

const ElevatorControls = ({
  onOpenDoor,
  onCloseDoor,
  isDoorOpen,
  onTakeSnapshot,
  onViewChange,
}) => {
  const [activeView, setActiveView] = useState("front");

  const handleDoorToggle = () => {
    if (isDoorOpen) {
      onCloseDoor();
    } else {
      onOpenDoor();
    }
  };

  const views = [
    { id: "isometric", label: "Isometric view", icon: <BsEyeFill /> },
    { id: "front", label: "Front View", icon: <BsGrid1X2 /> },
    { id: "inside", label: "Inside View", icon: <BsEyeFill /> },
    { id: "scene", label: "Scene View", icon: <FaChartArea /> },
  ];

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
    onViewChange(viewId);
  };

  return (
    <div className="elevator-controls">
      <div className="view-controls">
        {views.map((view) => (
          <button
            key={view.id}
            className={`view-btn ${activeView === view.id ? "active" : ""}`}
            onClick={() => handleViewChange(view.id)}
          >
            <span className="view-icon">{view.icon}</span>
            {view.label}
          </button>
        ))}
      </div>
      <div className="action-controls">
        <button className="elevator-btn" onClick={handleDoorToggle}>
          {isDoorOpen ? "Close Door" : "Open Door"}
        </button>
        <button className="elevator-btn snapshot-btn" onClick={onTakeSnapshot}>
          Take Snapshot
        </button>
      </div>
    </div>
  );
};

export default ElevatorControls;
