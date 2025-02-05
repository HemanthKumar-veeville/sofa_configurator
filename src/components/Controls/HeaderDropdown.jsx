import React, { useState } from "react";
import "./Controlls.css";
import { FaChevronDown } from "react-icons/fa";

const HeaderDropdown = () => {
  const [selectedOption, setSelectedOption] = useState("Vesta");
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown-container">
      <div
        className={`dropdown-button ${isOpen ? "active" : ""}`}
        onClick={toggleDropdown}
      >
        <span className="dropdown-label">CAR MODEL</span>
        <span className="dropdown-selected">{selectedOption}</span>
        <FaChevronDown className="dropdown-icon" />
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {["Vesta", "Model X", "Civic", "Accord"].map((option, index) => (
            <div
              key={index}
              className={`dropdown-option ${
                selectedOption === option ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderDropdown;
