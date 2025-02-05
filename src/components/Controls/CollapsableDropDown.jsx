import React, { useState } from "react";
import "./Controlls.css";
import { floorTextures } from "../../constants/floorTextures";
import { ceilingTextures } from "../../constants/ceilingTextures";
import { sofaColors } from "../../constants/sofaColors";

const CollapsableDropDown = ({
  onFloorTextureChange,
  onCeilingTextureChange,
  onSofaColorChange,
}) => {
  // State to manage the visibility of dropdowns
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(floorTextures[0].name);
  const [selectedCeiling, setSelectedCeiling] = useState(
    ceilingTextures[0].name
  );
  const [selectedSofaColor, setSelectedSofaColor] = useState(
    sofaColors[0].name
  );

  // Toggle the dropdown
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Handle floor texture selection
  const handleFloorSelection = (texture) => {
    console.log("Selected floor texture:", texture);
    setSelectedFloor(texture.name);
    onFloorTextureChange(texture);
    setOpenDropdown(null); // Close dropdown after selection
  };

  // Handle ceiling texture selection
  const handleCeilingSelection = (texture) => {
    try {
      console.log("Selected ceiling texture:", texture);
      setSelectedCeiling(texture.name);
      if (onCeilingTextureChange) {
        onCeilingTextureChange(texture);
      }
      setOpenDropdown(null);
    } catch (error) {
      console.error("Error selecting ceiling texture:", error);
    }
  };

  // Handle sofa color selection
  const handleSofaColorSelection = (color) => {
    setSelectedSofaColor(color.name);
    onSofaColorChange(color.color);
    setOpenDropdown(null);
  };

  // Dropdown labels and content
  const dropdowns = [
    {
      label: "Sofa Color",
      content: sofaColors.map((color) => ({
        name: color.name,
        onClick: () => handleSofaColorSelection(color),
      })),
      selected: selectedSofaColor,
    },
    { label: "Texture", content: ["Option A", "Option B", "Option C"] },
    { label: "Color", content: ["Choice 1", "Choice 2", "Choice 3"] },
  ];

  return (
    <div className="collapsable-dropdown-container">
      {dropdowns.map((dropdown, index) => (
        <div key={index} className="dropdown-wrapper">
          <button
            className="dropdown-button"
            onClick={() => toggleDropdown(index)}
          >
            <span className="button-label">{dropdown.label}</span>
            {dropdown.selected && (
              <span className="selected-value">{dropdown.selected}</span>
            )}
            <span className="dropdown-icon">
              {openDropdown === index ? "▲" : "▼"}
            </span>
          </button>
          {openDropdown === index && (
            <div className="dropdown-content">
              {dropdown.content.map((item, i) => (
                <div
                  key={i}
                  className={`dropdown-item ${
                    item.name === dropdown.selected ? "selected" : ""
                  }`}
                  onClick={item.onClick || undefined}
                >
                  {item.name || item}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CollapsableDropDown;
