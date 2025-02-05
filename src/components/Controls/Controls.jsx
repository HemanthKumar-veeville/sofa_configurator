import React from "react";
import CollapsableDropDown from "./CollapsableDropDown";
import ActionButtons from "./ActionButtons";
import HeaderDropdown from "./HeaderDropdown";
import TabButtons from "./TabButtons";
import "./Controls.css"; // Fixed typo in import
import { floorTextures } from "../../constants/floorTextures";
import { sofaColors } from "../../constants/sofaColors";

function Controls({
  onTakeSnapshot,
  onFloorTextureChange,
  onCeilingTextureChange,
  onSofaColorChange,
}) {
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
