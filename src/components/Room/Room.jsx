import React, { useMemo } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import floorTextureImg from "../../assets/textures/wood_tiles.jpg";
import wallTextureImg from "../../assets/textures/steel.jpg";
import roughWallTextureImg from "../../assets/textures/rough_wall.jpg";

function Room() {
  // Load the floor texture
  const floorTexture = useLoader(THREE.TextureLoader, floorTextureImg);
  const wallTexture = useLoader(THREE.TextureLoader, roughWallTextureImg);

  // Configure the textures
  const floorMaterial = useMemo(() => {
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(8, 6); // Adjust these values to control the texture repeat
    return (
      <meshStandardMaterial
        map={floorTexture}
        roughness={0.8}
        metalness={0.2}
      />
    );
  }, [floorTexture]);

  // Configure the textures
  const wallMaterial = useMemo(() => {
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(2, 3); // Adjust these values to control the texture repeat
    return (
      <meshStandardMaterial
        map={wallTexture}
        roughness={10.8}
        metalness={0.2}
        color="#ffffff"
      />
    );
  }, [wallTexture]);

  // Create wall materials using useMemo to prevent recreation on each render
  const { regularWallMaterial } = useMemo(() => {
    const createWallMaterial = () => {
      return new THREE.ShaderMaterial({
        uniforms: {
          tileScale: { value: new THREE.Vector2(8.0, 6.0) }, // Reduced number of tiles for larger checks
        },
        fragmentShader: `
          uniform vec2 tileScale;
          varying vec2 vUv;
          
          void main() {
            vec2 uv = vUv;
            vec2 pos = uv * tileScale;
            
            // Increased line width for thicker lines
            float lineWidth = 0.05;
            
            // Calculate grid lines with sharper edges
            float horizontalLine = smoothstep(0.0, lineWidth, fract(pos.y)) * 
                                 smoothstep(1.0, 1.0 - lineWidth, fract(pos.y));
            float verticalLine = smoothstep(0.0, lineWidth, fract(pos.x)) * 
                               smoothstep(1.0, 1.0 - lineWidth, fract(pos.x));
            
            // Invert the lines to make them visible
            horizontalLine = 1.0 - horizontalLine;
            verticalLine = 1.0 - verticalLine;
            
            vec3 baseColor = vec3(0.88, 0.88, 0.88);
            vec3 lineColor = vec3(0.75, 0.75, 0.75);
            
            // Combine lines with smoother blending
            float line = max(horizontalLine, verticalLine);
            
            vec3 finalColor = mix(baseColor, lineColor, line);
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
        vertexShader: `
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
      });
    };

    return {
      regularWallMaterial: createWallMaterial(),
    };
  }, []);

  return (
    <group position={[0, 0, 6]}>
      {/* Floor with texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        {floorMaterial}
      </mesh>

      <group>
        {/* Left Wall */}
        <mesh position={[-8, 4, 0]} receiveShadow>
          <boxGeometry args={[0.1, 8, 20]} />
          <meshStandardMaterial
            color="#e8e8e8"
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>

        {/* Right Wall */}
        <mesh position={[8, 4, 0]} receiveShadow>
          <boxGeometry args={[0.1, 8, 20]} />
          <meshStandardMaterial
            color="#e8e8e8"
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>

        {/* Back Wall (solid) */}
        <mesh position={[0, 4, -10]} receiveShadow>
          <boxGeometry args={[16, 8, 0.1]} />
          <meshStandardMaterial
            color="#e8e8e8"
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>

        {/* Ceiling */}
        <mesh position={[0, 8, 0]} receiveShadow>
          <boxGeometry args={[16, 0.1, 20]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Ceiling Lights */}
        {[-9, -3, 3, 9].map((z, i) => (
          <group key={`light-${i}`} position={[0, 7.9, z]}>
            <pointLight intensity={0.3} distance={4} color="#ffffff" />
            <mesh>
              <boxGeometry args={[0.6, 0.1, 0.6]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

export default Room;
