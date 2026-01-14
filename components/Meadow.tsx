
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Clover as AquaticClover } from './Clover';
import { Flower } from './Flower';

const PLANT_COUNT = 280; // Denser for that lush look
const FLOWER_COUNT = 35;

export const Meadow: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  const plantData = useMemo(() => {
    return Array.from({ length: PLANT_COUNT }).map((_, i) => {
      // Polar distribution to force a hole in the middle
      const angle = Math.random() * Math.PI * 2;
      // Start radius at 1.0 to keep center clear
      const radius = 1.0 + Math.pow(Math.random(), 0.6) * 5.5;
      const y = -0.5 + Math.random() * 3.5;
      
      return {
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius
        ),
        rotation: new THREE.Euler(
          (Math.random() - 0.5) * 0.4,
          Math.random() * Math.PI,
          (Math.random() - 0.5) * 0.4
        ),
        scale: 0.7 + Math.random() * 1.3,
        isFourLeaf: Math.random() > 0.85
      };
    });
  }, []);

  const flowerData = useMemo(() => {
    return Array.from({ length: FLOWER_COUNT }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 4.0;
      const y = 1.0 + Math.random() * 2.0;
      
      return {
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius
        ),
        color: Math.random() > 0.4 ? '#ffffff' : '#f48fb1',
        scale: 0.6 + Math.random() * 0.8
      };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow, liquid-like rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {plantData.map((data, i) => (
        <AquaticClover 
          key={`clover-${i}`} 
          position={data.position} 
          rotation={data.rotation} 
          scale={data.scale}
          isFourLeaf={data.isFourLeaf}
        />
      ))}
      {flowerData.map((data, i) => (
        <Flower 
          key={`flower-${i}`} 
          position={data.position} 
          color={data.color}
          scale={data.scale}
        />
      ))}
    </group>
  );
};
