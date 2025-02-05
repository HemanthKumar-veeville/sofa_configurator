/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 .\src\assets\elevator_room_building\scene.gltf 
Author: adventurer (https://sketchfab.com/ahmagh2e)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/elevator-room-building-d1894b85f52746058865a44bc4253dc7
Title: Elevator room Building
*/

import React from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import ElevatorRoomScene from "./assets/elevator_room_building/scene.gltf";

function ElevatorRoom(props) {
  const group = React.useRef();
  const { nodes, materials, animations } = useGLTF(ElevatorRoomScene);
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="7f76ce286222490f963f22cfedaafd04fbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group name="Sweep" position={[-148.301, 115.654, -105.118]}>
                  <mesh
                    name="Sweep_Mat_0"
                    geometry={nodes.Sweep_Mat_0.geometry}
                    material={materials.material}
                  />
                </group>
                <group name="Null" position={[8.491, 103.34, -1.303]}>
                  <group name="R" position={[-83.479, -1.92, -1.135]}>
                    <mesh
                      name="R_01_0"
                      geometry={nodes.R_01_0.geometry}
                      material={materials.material_1}
                    />
                  </group>
                  <group name="L" position={[65.821, -1.92, -1.135]}>
                    <mesh
                      name="L_01_0"
                      geometry={nodes.L_01_0.geometry}
                      material={materials.material_1}
                    />
                  </group>
                  <group name="BASE" position={[17.658, 3.84, 2.27]}>
                    <mesh
                      name="BASE_01_0"
                      geometry={nodes.BASE_01_0.geometry}
                      material={materials.material_1}
                    />
                  </group>
                </group>
                <group name="Null_1" position={[-293.246, 103.34, -1.303]}>
                  <group name="BASE_2" position={[17.658, 3.84, 2.27]}>
                    <mesh
                      name="BASE_2_01_0"
                      geometry={nodes.BASE_2_01_0.geometry}
                      material={materials.material_1}
                    />
                  </group>
                  <group name="R_2" position={[-83.479, -1.92, -1.135]}>
                    <mesh
                      name="R_2_01_0"
                      geometry={nodes.R_2_01_0.geometry}
                      material={materials.material_1}
                    />
                  </group>
                  <group name="L_2" position={[65.821, -1.92, -1.135]}>
                    <mesh
                      name="L_2_01_0"
                      geometry={nodes.L_2_01_0.geometry}
                      material={materials.material_1}
                    />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(ElevatorRoomScene);

export default ElevatorRoom;
