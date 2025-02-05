/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 .\src\assets\Elev.glb 
*/

import React, { useMemo, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import Elevator from "./assets/Modern_Elevator.glb";

function Model(props) {
  const { nodes, materials } = useGLTF(Elevator);
  const [isOpen, setIsOpen] = useState(false);

  // Door animation spring
  const { doorPosition } = useSpring({
    doorPosition: isOpen ? 0.8 : 0, // 0.8 units to the side when open
    config: {
      mass: 1,
      tension: 120,
      friction: 14,
      duration: 2000, // 2 seconds duration
    },
  });
  console.log({ nodes, materials });
  // Updated materials to match reference image
  const uniqueMaterials = useMemo(
    () => ({
      frame: new THREE.MeshStandardMaterial({
        color: "#a0a0a0", // Lighter frame color
        metalness: 0.4,
        roughness: 0.3,
      }),
      walls: new THREE.MeshStandardMaterial({
        color: "#e8e8e8", // Match wall color
        metalness: 0.1,
        roughness: 0.2,
      }),
      door: new THREE.MeshStandardMaterial({
        color: "#d4d4d4", // Lighter door color
        metalness: 0.3,
        roughness: 0.2,
      }),
      floor: new THREE.MeshStandardMaterial({
        color: "#1a1a1a", // Darker floor
        metalness: 0.2,
        roughness: 0.8,
      }),
      ceiling: new THREE.MeshStandardMaterial({
        color: "#cccccc", // Lighter ceiling
        metalness: 0.2,
        roughness: 0.3,
      }),
      details: new THREE.MeshStandardMaterial({
        color: "#b0b0b0", // Adjusted details color
        metalness: 0.4,
        roughness: 0.3,
      }),
    }),
    []
  );

  // Toggle door function
  const toggleDoor = () => {
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    // Optional: Add keyboard control for testing
    const handleKeyPress = (e) => {
      if (e.key === "o") toggleDoor();
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, []);

  return (
    <group {...props} dispose={null} onClick={toggleDoor}>
      {/* Adjust base position for visibility */}
      <group position={[0, 0, 0]}>
        {/* Frame components */}
        <mesh
          geometry={nodes.Node1.geometry}
          material={uniqueMaterials.frame}
        />
        <mesh
          geometry={nodes.Node2.geometry}
          material={uniqueMaterials.frame}
        />
        {/* Wall components */}
        <mesh
          geometry={nodes.Node3.geometry}
          material={uniqueMaterials.walls}
        />
        <mesh
          geometry={nodes.Node4.geometry}
          material={uniqueMaterials.walls}
        />
        <mesh
          geometry={nodes.Node5.geometry}
          material={uniqueMaterials.walls}
        />
        {/* Door components - facing camera */}
        <animated.mesh
          geometry={nodes.Node6.geometry}
          material={uniqueMaterials.door}
          position-x={doorPosition}
        />
        <animated.mesh
          geometry={nodes.Node7.geometry}
          material={uniqueMaterials.door}
          position-x={doorPosition.to((x) => -x)} // Mirror animation for other door
        />
        {/* Floor components - at ground level */}
        <mesh
          geometry={nodes.Node8.geometry}
          material={uniqueMaterials.floor}
        />
        <mesh
          geometry={nodes.Node9.geometry}
          material={uniqueMaterials.floor}
        />
        {/* Ceiling components */}
        <mesh
          geometry={nodes.Node10.geometry}
          material={uniqueMaterials.ceiling}
        />
        <mesh
          geometry={nodes.Node11.geometry}
          material={uniqueMaterials.ceiling}
        />
        {/* Detail components */}
        <mesh
          geometry={nodes.Node12.geometry}
          material={uniqueMaterials.details}
        />
        <mesh
          geometry={nodes.Node13.geometry}
          material={uniqueMaterials.details}
        />
        <mesh
          geometry={nodes.Node14.geometry}
          material={uniqueMaterials.details}
        />
        <mesh
          geometry={nodes.Node15.geometry}
          material={uniqueMaterials.details}
        />
        <mesh
          geometry={nodes.Node16.geometry}
          material={uniqueMaterials.details}
        />
        <mesh
          geometry={nodes.Node17.geometry}
          material={uniqueMaterials.details}
        />
        <mesh
          geometry={nodes.Node18.geometry}
          material={uniqueMaterials.details}
        />
        <mesh
          geometry={nodes.Node19.geometry}
          material={uniqueMaterials.details}
        />
        <mesh
          geometry={nodes.Node20.geometry}
          material={uniqueMaterials.details}
        />
        <mesh
          geometry={nodes.Node21.geometry}
          material={uniqueMaterials.details}
        />
        <mesh
          geometry={nodes.Node22.geometry}
          material={uniqueMaterials.details}
        />
        <mesh
          geometry={nodes.Node23.geometry}
          material={uniqueMaterials.details}
        />
        <mesh
          geometry={nodes.Node24.geometry}
          material={uniqueMaterials.details}
        />
        <mesh
          geometry={nodes.Node25.geometry}
          material={uniqueMaterials.details}
        />
      </group>
    </group>
  );
}

useGLTF.preload(Elevator);
export default Model;
