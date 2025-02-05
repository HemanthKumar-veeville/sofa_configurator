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
import * as THREE from "three";
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

// Add this new component after the CameraController component
function SpotLightWithLamp() {
  const lightColor = "#FFD700"; // Warm yellow color

  return (
    <group position={[-3, 6, 2]}>
      {/* Lamp base geometry */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.5]} />
        <meshStandardMaterial color="#303030" />
      </mesh>

      {/* Light bulb geometry - much brighter */}
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color={lightColor}
          emissive={lightColor}
          emissiveIntensity={15}
        />
      </mesh>

      {/* Light cone visualization - much more visible */}
      <mesh position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[3, 6, 32, 1, true]} />
        <meshBasicMaterial
          color={lightColor}
          transparent={true}
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Spotlight - much stronger */}
      <spotLight
        castShadow
        position={[0, -0.2, 0]}
        angle={Math.PI / 4}
        penumbra={0.1}
        intensity={20}
        distance={30}
        decay={0.5}
        color={lightColor}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Light bulb glow effect - much stronger */}
      <pointLight
        intensity={10}
        position={[0, -0.2, 0]}
        color={lightColor}
        distance={8}
      />

      {/* Additional glow lights for stronger effect */}
      <pointLight
        intensity={5}
        position={[0, -1, 0]}
        color={lightColor}
        distance={10}
      />
    </group>
  );
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
        <Canvas
          shadows
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            shadowMap: { type: THREE.PCFSoftShadowMap },
          }}
        >
          <ScreenshotHandler onScreenshot={handleScreenshotTools} />
          <PerspectiveCamera makeDefault position={[0, 0, 4]} />
          <CameraController view={currentView} />
          {/* Updated lighting setup */}
          <ambientLight intensity={0.05} />
          {/* Reduced ambient light intensity */}
          {/* Main directional light */}
          <directionalLight
            position={[4, 8, 4]}
            intensity={0.1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          {/* Adjust fog for better light beam visibility */}
          <fog attach="fog" args={["#000000", 8, 30]} />
          {/* Add the spotlight lamp */}
          <SpotLightWithLamp />
          <Environment preset="lobby" background={false} />
          {/* Add a ground plane to catch shadows */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.5, 0]}
            receiveShadow
          >
            <planeGeometry args={[50, 50]} />
            <shadowMaterial opacity={0.2} />
          </mesh>
          {/* Position sofa with shadow casting */}
          <group position={[0, 1, 5]} scale={[4.4, 4, 4]}>
            <Sofa
              color={currentSofaColor}
              texture={currentSofaTexture}
              castShadow
              receiveShadow
            />
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
