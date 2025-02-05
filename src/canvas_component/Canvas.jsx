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
  const lightColor = "#FFD700"; // Base yellow color

  // Create gradient texture for the beam
  const gradientTexture = new THREE.CanvasTexture(
    (() => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 1;
      const context = canvas.getContext("2d");
      const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "rgba(255, 215, 0, 0.6)"); // More intense yellow at source
      gradient.addColorStop(0.3, "rgba(255, 200, 0, 0.3)"); // Mid yellow
      gradient.addColorStop(1, "rgba(255, 180, 0, 0.0)"); // Fade to transparent
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      return canvas;
    })()
  );

  return (
    <group position={[-2, 8, 2]} rotation={[0.4, 0.5, 0]}>
      {/* Modern lamp housing */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Light bulb geometry */}
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial
          color={lightColor}
          emissive={lightColor}
          emissiveIntensity={40}
        />
      </mesh>

      {/* Gradient light beam - multiple layers for realistic effect */}
      {[4, 3, 2].map((radius, index) => (
        <mesh
          key={`cone-${index}`}
          position={[0, -0.2, 0]}
          rotation={[0, 0, 0]}
        >
          <coneGeometry args={[radius, 12, 64, 1, false]} />
          <meshBasicMaterial
            map={gradientTexture}
            transparent={true}
            opacity={0.2 - index * 0.05}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Main spotlight */}
      <spotLight
        castShadow
        position={[0, -0.1, 0]}
        angle={Math.PI / 2.2}
        penumbra={0.4}
        intensity={120}
        distance={25}
        decay={1.5}
        color={lightColor}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        target-position={[0, -15, 0]}
      />

      {/* Central bright glow */}
      <pointLight
        intensity={30}
        position={[0, -0.1, 0]}
        color={lightColor}
        distance={8}
      />

      {/* Subtle fill lights */}
      <spotLight
        position={[1.5, -0.1, 0]}
        angle={Math.PI / 2.5}
        penumbra={0.5}
        intensity={40}
        distance={20}
        decay={1.5}
        color={lightColor}
        target-position={[3, -15, 0]}
      />

      <spotLight
        position={[-1.5, -0.1, 0]}
        angle={Math.PI / 2.5}
        penumbra={0.5}
        intensity={40}
        distance={20}
        decay={1.5}
        color={lightColor}
        target-position={[-3, -15, 0]}
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
          <ambientLight intensity={0.01} />
          {/* Reduced ambient light intensity */}
          {/* Main directional light */}
          <directionalLight
            position={[4, 8, 4]}
            intensity={0.03}
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
          <fog attach="fog" args={["#000000", 4, 30]} />
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
