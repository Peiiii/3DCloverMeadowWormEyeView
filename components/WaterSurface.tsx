
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { GradientTexture, Sky } from '@react-three/drei';
import * as THREE from 'three';

export const WaterSurface: React.FC = () => {
  const sunRef = useRef<THREE.Mesh>(null);
  const cloudGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (sunRef.current) {
      sunRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03);
    }
    if (cloudGroupRef.current) {
      cloudGroupRef.current.rotation.y = t * 0.01;
    }
  });

  return (
    <>
      {/* Brilliant Blue Sky Backdrop */}
      <mesh scale={[120, 120, 120]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial side={THREE.BackSide}>
          <GradientTexture
            stops={[0, 0.4, 0.7, 1]} 
            colors={['#0099cc', '#4dc3ff', '#ffffff', '#e0f7fa']} 
          />
        </meshBasicMaterial>
      </mesh>

      {/* The Sun Starburst */}
      <group position={[0, 25, 0]}>
         <mesh ref={sunRef}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshBasicMaterial color="#ffffff" />
         </mesh>
         {/* Bloom Target Circles */}
         <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[6, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
         </mesh>
      </group>

      {/* Floating Clouds */}
      <group ref={cloudGroupRef}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Cloud 
            key={i} 
            position={[
              (Math.random() - 0.5) * 80,
              20 + Math.random() * 5,
              (Math.random() - 0.5) * 80
            ]}
            scale={10 + Math.random() * 15}
          />
        ))}
      </group>

      {/* Water Surface Ripples Layer */}
      <mesh position={[0, 18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshPhysicalMaterial 
          transparent 
          opacity={0.15} 
          transmission={1} 
          roughness={0.1} 
          ior={1.33} 
          thickness={0.5}
          color="#e0ffff"
        />
      </mesh>
    </>
  );
};

const Cloud: React.FC<{ position: [number, number, number]; scale: number }> = ({ position, scale }) => {
  const texture = useMemo(() => new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare0.png'), []);
  return (
    <mesh position={position} scale={scale} rotation={[Math.PI / 2, 0, Math.random() * Math.PI]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        opacity={0.4} 
        depthWrite={false} 
        color="white"
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};
