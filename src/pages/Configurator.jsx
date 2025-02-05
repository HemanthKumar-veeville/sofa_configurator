import React from "react";
import CanvasContainer from "../canvas_component/Canvas";

function Configurator() {
  return (
    <div className="configurator-layout">
      <div className="canvas-section">
        <CanvasContainer />
      </div>
    </div>
  );
}

export default Configurator;
