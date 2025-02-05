import React from "react";
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
}) {
  const handleSofaTextureChange = (texture) => {
    // Reset color when texture is selected
    if (texture) {
      onSofaColorChange("original");
    }
    onSofaTextureChange(texture);
  };

  return (
    <div className="controls-sidebar">
      {/* Header Section */}
      <div className="controls-header">
        <h2 className="brand-title">nusense.</h2>
        <h3 className="section-title">Sofa DESIGNER</h3>
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
          <ActionButtons onTakeSnapshot={onTakeSnapshot} />
        </div>
      </div>
    </div>
  );
}

export default Controls;
