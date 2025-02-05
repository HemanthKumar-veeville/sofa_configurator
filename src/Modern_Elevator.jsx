import React, { useEffect, useState, useMemo } from "react";
import {
  useGLTF,
  useAnimations,
  useProgress,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import ElevatorCar from "./assets/Modern_Elevator.glb";
import { floorTextures } from "./constants/floorTextures";
import { ceilingTextures } from "./constants/ceilingTextures";

// Preload all floor textures
floorTextures.forEach((texture) => {
  useTexture.preload(texture.src);
});

// Preload all ceiling textures
ceilingTextures.forEach((texture) => {
  useTexture.preload(texture.src);
});

function Model({
  onDoorToggle,
  currentView,
  floorTexture,
  ceilingTexture,
  ...props
}) {
  const group = React.useRef();
  const { nodes, materials, animations } = useGLTF(ElevatorCar);
  const { actions } = useAnimations(animations, group);
  const [isOpen, setIsOpen] = useState(false);
  const [doorProgress, setDoorProgress] = useState(0);
  const { progress } = useProgress();

  // Create stable references for both materials
  const floorMaterialRef = React.useRef();
  const ceilingMaterialRef = React.useRef();

  // Load textures
  const floorMap = useTexture(floorTexture?.src || floorTextures[5].src);
  const ceilingMap = useTexture(ceilingTexture?.src || ceilingTextures[0].src);

  // Set texture properties
  React.useEffect(() => {
    if (floorMap) {
      floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping;
      floorMap.repeat.set(2, 2);
      floorMap.needsUpdate = true;
    }
    if (ceilingMap) {
      ceilingMap.wrapS = ceilingMap.wrapT = THREE.RepeatWrapping;
      ceilingMap.needsUpdate = true;
    }
  }, [floorMap, ceilingMap]);

  // Initialize materials
  useMemo(() => {
    if (
      !floorMap ||
      !ceilingMap ||
      !materials["Material.010"] ||
      !materials["Material.009"]
    )
      return;

    // Floor material
    if (!floorMaterialRef.current) {
      floorMaterialRef.current = new THREE.MeshStandardMaterial({
        map: floorMap,
        metalness: 0.2,
        roughness: 0.8,
      });
    } else {
      floorMaterialRef.current.map = floorMap;
      floorMaterialRef.current.needsUpdate = true;
    }

    // Ceiling material
    if (!ceilingMaterialRef.current) {
      ceilingMaterialRef.current = new THREE.MeshStandardMaterial({
        map: ceilingMap,
        metalness: 0.3,
        roughness: 0.7,
      });
    } else {
      ceilingMaterialRef.current.map = ceilingMap;
      ceilingMaterialRef.current.needsUpdate = true;
    }
  }, [floorMap, ceilingMap, materials]);

  // Function to toggle door state with animation
  const toggleDoor = () => {
    setIsOpen(!isOpen);
    console.log(`Door is now ${!isOpen ? "opening" : "closing"}`);
  };

  // Expose toggleDoor through props.onDoorToggle
  useEffect(() => {
    if (onDoorToggle) {
      onDoorToggle(toggleDoor);
    }
  }, [onDoorToggle, toggleDoor]);

  // Handle door animations using morph targets with smooth transition
  useEffect(() => {
    if (!isOpen && doorProgress === 0) return; // Skip initial animation when door is closed

    const animationDuration = 800; // Changed from 2000 to 800ms (0.8 seconds)
    const fps = 60;
    const frames = (animationDuration / 1000) * fps;
    let frame = 0;

    const animate = () => {
      if (frame <= frames) {
        const progress = isOpen ? frame / frames : 1 - frame / frames;
        setDoorProgress(progress);
        frame++;
        setTimeout(animate, 1000 / fps);
      }
    };

    frame = 0;
    animate();
  }, [isOpen]);

  // Apply door progress to morph targets
  useEffect(() => {
    // Get all meshes that have morph targets for the door
    const doorMeshes = [
      nodes.mesh_2,
      nodes.mesh_3,
      nodes.mesh_9,
      nodes.mesh_10,
    ];

    // Set morph target influence based on door progress
    doorMeshes.forEach((mesh) => {
      if (mesh && mesh.morphTargetInfluences) {
        mesh.morphTargetInfluences[0] = doorProgress;
      }
    });
  }, [doorProgress, nodes]);

  // Handle visibility of different parts based on view
  useEffect(() => {
    const interiorParts = [
      nodes.Object_7, // Interior Wall Panels
      nodes.Object_8, // Floor Panel
      nodes.Object_9, // Ceiling Panel
      nodes.Object_10, // Light Fixture
      nodes.BackWall, // Back Wall Panel
    ];

    // Show/hide interior elements based on view
    interiorParts.forEach((part) => {
      if (part) {
        part.visible = currentView === "inside";
      }
    });

    // Adjust material properties for different views
    Object.values(materials).forEach((material) => {
      if (material) {
        if (currentView === "inside") {
          material.transparent = true;
          material.opacity = 0.8;
        } else {
          material.transparent = false;
          material.opacity = 1;
        }
      }
    });
  }, [currentView, nodes, materials]);

  // Add click handler to the door meshes
  const handleDoorClick = (e) => {
    e.stopPropagation();
    toggleDoor();
  };

  return (
    <group ref={group} {...props} dispose={null} visible={true}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="root">
            <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
              {/* Main Elevator Frame */}
              <group name="Cube_3">
                <mesh
                  name="Object_6"
                  geometry={nodes.Object_6.geometry}
                  material={materials["Material.001"]}
                />
                {/* Main Frame Structure */}
                <mesh
                  name="Object_7"
                  geometry={nodes.Object_7.geometry}
                  material={materials.Material}
                />
                {/* Interior Wall Panels */}
                <mesh
                  name="Object_8"
                  geometry={nodes.Object_8.geometry}
                  material={materials["Material.004"]}
                />
                {/* Floor Panel */}
                <mesh
                  name="Object_9"
                  geometry={nodes.Object_9.geometry}
                  material={
                    ceilingMaterialRef.current || materials["Material.009"]
                  }
                />
                {/* Ceiling Panel */}
                <mesh
                  name="Object_10"
                  geometry={nodes.Object_10.geometry}
                  material={
                    floorMaterialRef.current || materials["Material.010"]
                  }
                />
                {/* Light Fixture */}
                <mesh
                  name="Object_11"
                  geometry={nodes.Object_11.geometry}
                  material={materials["Material.011"]}
                />{" "}
                {/* Trim Details */}
                <mesh
                  name="BackWall"
                  position={[0, 0, -0.625]}
                  scale={[1.3, 1, 1]}
                  material={materials["Material.011"]}
                >
                  <planeGeometry args={[1, 2]} />{" "}
                  {/* Width and height to match elevator interior */}
                </mesh>{" "}
                {/* Back Wall Panel */}
              </group>

              {/* Left Door Panel */}
              <group name="Cube002_5" position={[0, 0, -0.017]}>
                <mesh
                  name="mesh_2"
                  geometry={nodes.mesh_2.geometry}
                  material={materials["Material.001"]}
                  morphTargetDictionary={nodes.mesh_2.morphTargetDictionary}
                  morphTargetInfluences={nodes.mesh_2.morphTargetInfluences}
                />
              </group>

              {/* Right Door Panel */}
              <group name="Cube003_6" position={[0, 0, -0.017]}>
                <mesh
                  name="mesh_3"
                  geometry={nodes.mesh_3.geometry}
                  material={materials["Material.001"]}
                  morphTargetDictionary={nodes.mesh_3.morphTargetDictionary}
                  morphTargetInfluences={nodes.mesh_3.morphTargetInfluences}
                />
              </group>

              {/* Door Frame */}
              <group name="Cube004_7">
                <mesh
                  name="Object_17"
                  geometry={nodes.Object_17.geometry}
                  material={materials["Material.001"]}
                />{" "}
                {/* Main Door Frame */}
                <mesh
                  name="Object_18"
                  geometry={nodes.Object_18.geometry}
                  material={materials["Material.002"]}
                />{" "}
                {/* Door Frame Trim */}
              </group>

              {/* Floor Number Display */}
              <group
                name="Text_8"
                position={[-0.187, 0.939, 0.63]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Object_20"
                  geometry={nodes.Object_20.geometry}
                  material={materials["Material.003"]}
                />
              </group>

              {/* Control Panel Background */}
              <group
                name="Plane_9"
                position={[-0.187, 0.939, 0.63]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <mesh
                  name="Object_22"
                  geometry={nodes.Object_22.geometry}
                  material={materials["Material.005"]}
                />{" "}
                {/* Panel Base */}
                <mesh
                  name="Object_23"
                  geometry={nodes.Object_23.geometry}
                  material={materials["Material.013"]}
                />{" "}
                {/* Panel Screen */}
              </group>

              {/* Floor Buttons Panel */}
              <group
                name="Plane001_10"
                position={[-0.87, 0.092, 0.63]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[0.432, 1, 1]}
              >
                <mesh
                  name="Object_25"
                  geometry={nodes.Object_25.geometry}
                  material={materials["Material.001"]}
                />{" "}
                {/* Button Panel Base */}
                <mesh
                  name="Object_26"
                  geometry={nodes.Object_26.geometry}
                  material={materials["Material.007"]}
                />{" "}
                {/* Button Surrounds */}
                <mesh
                  name="Object_27"
                  geometry={nodes.Object_27.geometry}
                  material={materials["Material.008"]}
                />{" "}
                {/* Button Faces */}
              </group>

              {/* Door Track System */}
              <group name="Cube005_11" position={[0, 0, -0.017]}>
                <mesh
                  name="Object_29"
                  geometry={nodes.Object_29.geometry}
                  material={materials["Material.001"]}
                />{" "}
                {/* Door Rails */}
                <mesh
                  name="Object_30"
                  geometry={nodes.Object_30.geometry}
                  material={materials["Material.008"]}
                />{" "}
                {/* Rail Mechanisms */}
              </group>

              {/* Left Door Interior Panel */}
              <group
                name="Cube006_12"
                position={[0, 0, -0.057]}
                scale={[1.059, 1, 1]}
              >
                <mesh
                  name="mesh_9"
                  geometry={nodes.mesh_9.geometry}
                  material={materials["Material.001"]}
                  morphTargetDictionary={nodes.mesh_9.morphTargetDictionary}
                  morphTargetInfluences={nodes.mesh_9.morphTargetInfluences}
                />
              </group>

              {/* Right Door Interior Panel */}
              <group
                name="Cube007_13"
                position={[0, 0, -0.057]}
                scale={[1.059, 1, 1]}
              >
                <mesh
                  name="mesh_10"
                  geometry={nodes.mesh_10.geometry}
                  material={materials["Material.001"]}
                  morphTargetDictionary={nodes.mesh_10.morphTargetDictionary}
                  morphTargetInfluences={nodes.mesh_10.morphTargetInfluences}
                />
              </group>

              {/* Emergency Information Panel */}
              <group name="Plane002_15" position={[0.374, -0.204, -0.028]}>
                <mesh
                  name="Object_40"
                  geometry={nodes.Object_40.geometry}
                  material={materials.Material}
                />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(ElevatorCar);
export default Model;
