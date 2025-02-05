import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import jsPDF from "jspdf";
import CollapsableDropDown from "./CollapsableDropDown";
import ActionButtons from "./ActionButtons";
import "./Controls.css"; // Fixed typo in import
import { floorTextures } from "../../constants/floorTextures";
import { sofaColors } from "../../constants/sofaColors";

function Controls({
  onTakeSnapshot,
  onFloorTextureChange,
  onCeilingTextureChange,
  onSofaColorChange,
  onSofaTextureChange,
  currentSofaColor,
  currentSofaTexture,
}) {
  const navigate = useNavigate();

  const handleSofaTextureChange = (texture) => {
    // Reset color when texture is selected
    if (texture) {
      onSofaColorChange("original");
    }
    onSofaTextureChange(texture);
  };

  const generatePDF = async () => {
    const doc = new jsPDF();

    // Take a snapshot first
    let snapshotDataUrl = null;
    if (onTakeSnapshot) {
      snapshotDataUrl = await onTakeSnapshot(true); // Pass true to get data URL instead of downloading
    }

    // Add title
    doc.setFontSize(20);
    doc.text("Sofa Configuration Details", 20, 20);

    // Add configuration details
    doc.setFontSize(12);
    doc.text("Configuration Summary:", 20, 40);
    doc.text(`Sofa Color: ${currentSofaColor || "Original"}`, 20, 55);
    doc.text(`Sofa Texture: ${currentSofaTexture || "Default"}`, 20, 70);

    // Add date and time
    const date = new Date().toLocaleString();
    doc.text(`Generated on: ${date}`, 20, 85);

    // Add snapshot if available
    if (snapshotDataUrl) {
      doc.addImage(snapshotDataUrl, "PNG", 20, 100, 170, 100); // Adjust size as needed
    }

    // Save the PDF
    doc.save("sofa-configuration.pdf");
  };

  return (
    <div className="controls-sidebar">
      {/* Header Section */}
      <div className="controls-header">
        <button className="back-button" onClick={() => navigate("/")}>
          <IoArrowBack />
          <span>Back</span>
        </button>
        <h3 className="section-title">Sofa Configurator</h3>
      </div>

      {/* Tabs and Dropdown */}
      <div className="controls-content">
        {/* Collapsible Dropdown Sections */}
        <div className="control-sections">
          <CollapsableDropDown
            onFloorTextureChange={onFloorTextureChange}
            onCeilingTextureChange={onCeilingTextureChange}
            onSofaColorChange={onSofaColorChange}
            onSofaTextureChange={handleSofaTextureChange}
          />
        </div>

        {/* Footer Action Buttons */}
        <div className="controls-footer">
          <ActionButtons
            onTakeSnapshot={onTakeSnapshot}
            onGetInfo={generatePDF}
          />
        </div>
      </div>
    </div>
  );
}

export default Controls;
