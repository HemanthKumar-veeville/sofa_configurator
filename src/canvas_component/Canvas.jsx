import React, { useRef, useState, useCallback, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  useTexture,
} from "@react-three/drei";
import ElevRoom from "../Elev_room";
import Room from "../components/Room/Room";
import "../App.css";
import ModernElevator from "../Modern_Elevator";
import ElevatorControls from "../components/ElevatorControls";
import Controls from "../components/Controls/Controls";
import "../pages/Configurator.css";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import { floorTextures } from "../constants/floorTextures";
import { ceilingTextures } from "../constants/ceilingTextures";
import { Sofa } from "../Sofa";
import { sofaColors } from "../constants/sofaColors";
// Camera positions for different views
const VIEW_CONFIGS = {
  isometric: {
    position: [8, 8, 8],
    target: [0, 1.5, 0],
    fov: 65,
    controls: {
      minDistance: 6,
      maxDistance: 15,
      minPolarAngle: Math.PI / 4,
      maxPolarAngle: Math.PI / 2,
      minAzimuthAngle: -Math.PI / 4,
      maxAzimuthAngle: Math.PI / 4,
    },
  },
  front: {
    position: [0, 1.5, 12],
    target: [0, 1.5, 0],
    fov: 55,
    controls: {
      minDistance: 8,
      maxDistance: 15,
      minPolarAngle: Math.PI / 2,
      maxPolarAngle: Math.PI / 2,
      minAzimuthAngle: 0,
      maxAzimuthAngle: 0,
    },
  },
  inside: {
    position: [0, 1.5, 12],
    target: [0, 1.5, 0],
    fov: 55,
    controls: {
      minDistance: 5,
      maxDistance: 15,
      minPolarAngle: Math.PI / 2, // Set to PI/2 to prevent seeing above horizontal
      maxPolarAngle: Math.PI / 2, // Set to PI/2 to prevent seeing below horizontal
      minAzimuthAngle: -Math.PI / 6, // More restricted left rotation
      maxAzimuthAngle: Math.PI / 6, // More restricted right rotation
    },
  },
  scene: {
    position: [0, 1.5, 12],
    target: [0, 1.5, 0],
    fov: 65,
    controls: {
      minDistance: 5,
      maxDistance: 15,
      minPolarAngle: Math.PI / 2, // Set to PI/2 to prevent seeing above horizontal
      maxPolarAngle: Math.PI / 2, // Set to PI/2 to prevent seeing below horizontal
      minAzimuthAngle: -Math.PI / 6, // More restricted left rotation
      maxAzimuthAngle: Math.PI / 6, // More restricted right rotation
    },
  },
};

// Camera Controller component
function CameraController({ view, controls }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  React.useEffect(() => {
    const config = VIEW_CONFIGS[view];
    if (config) {
      // Update camera position and target
      camera.position.set(...config.position);
      camera.fov = config.fov;
      camera.updateProjectionMatrix();

      // Update controls
      if (controlsRef.current) {
        controlsRef.current.target.set(...config.target);
        Object.assign(controlsRef.current, config.controls);
      }
    }
  }, [view, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      enableZoom={true}
      enablePan={false}
      enableRotate={true}
    />
  );
}

// Create a new component for handling screenshots
function ScreenshotHandler({ onScreenshot }) {
  const { gl, scene, camera } = useThree();

  React.useEffect(() => {
    if (onScreenshot) {
      onScreenshot({ gl, scene, camera });
    }
  }, [gl, scene, camera, onScreenshot]);

  return null;
}

function CanvasContainer() {
  const canvasRef = useRef(null);
  const toggleDoorRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [screenshotTools, setScreenshotTools] = useState(null);
  const [currentView, setCurrentView] = useState("front");
  const [currentFloorTexture, setCurrentFloorTexture] = useState(
    floorTextures[0]
  );
  const [currentCeilingTexture, setCurrentCeilingTexture] = useState(
    ceilingTextures[0]
  );
  const [currentSofaColor, setCurrentSofaColor] = useState("original");
  const [currentSofaTexture, setCurrentSofaTexture] = useState(null);

  const handleDoorToggle = useCallback((toggleFn) => {
    toggleDoorRef.current = toggleFn;
  }, []);

  const handleOpenDoor = () => {
    if (toggleDoorRef.current && !isOpen) {
      toggleDoorRef.current();
      setIsOpen(true);
    }
  };

  const handleCloseDoor = () => {
    if (toggleDoorRef.current && isOpen) {
      toggleDoorRef.current();
      setIsOpen(false);
    }
  };

  const handleTakeSnapshot = useCallback(
    (returnDataUrl = false) => {
      if (screenshotTools) {
        const { gl, scene, camera } = screenshotTools;

        // Render the scene
        gl.render(scene, camera);

        // Get the canvas
        const canvas = gl.domElement;

        if (returnDataUrl) {
          return canvas.toDataURL("image/png", 1.0);
        }

        // Download the image if returnDataUrl is false
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png", 1.0);
        link.download = `sofa-snapshot-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      return null;
    },
    [screenshotTools]
  );

  const handleScreenshotTools = useCallback((tools) => {
    setScreenshotTools(tools);
  }, []);

  const handleViewChange = (viewType) => {
    setCurrentView(viewType);
  };

  const handleFloorTextureChange = useCallback((texture) => {
    console.log("Changing floor texture to:", texture);
    setCurrentFloorTexture(texture);
  }, []);

  const handleCeilingTextureChange = useCallback((texture) => {
    console.log("Changing ceiling texture to:", texture);
    setCurrentCeilingTexture(texture);
  }, []);

  const handleSofaColorChange = useCallback((color) => {
    try {
      console.log("Changing sofa color to:", color);
      setCurrentSofaColor(color);
      // Reset texture when color is changed
      if (color !== "original") {
        setCurrentSofaTexture(null);
      }
    } catch (error) {
      console.error("Error changing sofa color:", error);
    }
  }, []);

  const handleSofaTextureChange = useCallback((texture) => {
    try {
      console.log("Changing sofa texture to:", texture);
      setCurrentSofaTexture(texture);
      // Reset color when texture is applied
      if (texture) {
        setCurrentSofaColor("original");
      }
    } catch (error) {
      console.error("Error changing sofa texture:", error);
    }
  }, []);

  return (
    <div id="canvas-container" ref={canvasRef}>
      <Suspense fallback={<LoadingScreen />}>
        <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
          <ScreenshotHandler onScreenshot={handleScreenshotTools} />

          <PerspectiveCamera makeDefault position={[0, 0, 4]} />
          <CameraController view={currentView} />

          {/* Lighting setup */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[2, 6, 8]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <Environment preset="lobby" background={false} />

          {/* Room environment */}
          {/* <Room /> */}

          {/* Position elevator */}
          <group position={[0, 1, 5]} scale={[4.4, 4, 4]}>
            <Sofa color={currentSofaColor} texture={currentSofaTexture} />
          </group>
        </Canvas>

        <div className="controls-section">
          <Controls
            onTakeSnapshot={handleTakeSnapshot}
            onFloorTextureChange={handleFloorTextureChange}
            onCeilingTextureChange={handleCeilingTextureChange}
            onSofaColorChange={handleSofaColorChange}
            onSofaTextureChange={handleSofaTextureChange}
            currentFloorTexture={currentFloorTexture}
            currentCeilingTexture={currentCeilingTexture}
            currentSofaColor={currentSofaColor}
            currentSofaTexture={currentSofaTexture}
          />
        </div>
        <ElevatorControls
          onOpenDoor={handleOpenDoor}
          onCloseDoor={handleCloseDoor}
          isDoorOpen={isOpen}
          onTakeSnapshot={handleTakeSnapshot}
          onViewChange={handleViewChange}
        />
      </Suspense>
    </div>
  );
}

export default CanvasContainer;
