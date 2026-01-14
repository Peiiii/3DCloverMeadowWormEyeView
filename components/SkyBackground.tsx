
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { GradientTexture } from '@react-three/drei';
import * as THREE from 'three';

export const SkyBackground: React.FC = () => {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sunRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
      sunRef.current.scale.set(s, s, s);
    }
  });

  return (
    <>
      {/* Deep blue sky dome */}
      <mesh scale={[120, 120, 120]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial side={THREE.BackSide}>
          <GradientTexture
            stops={[0, 0.5, 1]} 
            colors={['#0077be', '#4ba3d1', '#ffffff']} // More vibrant sky blue
          />
        </meshBasicMaterial>
      </mesh>

      {/* Central Sun Light Source */}
      <group position={[0, 25, 0]}>
         <mesh ref={sunRef}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshBasicMaterial color="#ffffff" />
         </mesh>
         <pointLight intensity={80} distance={100} color="#fffcf0" />
      </group>

      {/* Cloud Sprites */}
      {Array.from({ length: 25 }).map((_, i) => (
        <CloudSprite 
          key={i} 
          position={[
            (Math.random() - 0.5) * 80,
            18 + Math.random() * 5,
            (Math.random() - 0.5) * 80
          ]}
          scale={8 + Math.random() * 15}
        />
      ))}
    </>
  );
};

const CloudSprite: React.FC<{ position: [number, number, number]; scale: number }> = ({ position, scale }) => {
  // Fix: Imported useMemo from React at the top of the file to resolve 'Cannot find name useMemo' error.
  const texture = useMemo(() => new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare0.png'), []);
  
  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.4} 
        depthWrite={false}
        map={texture}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};
