
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlowerProps {
  position: THREE.Vector3;
  color: string;
  scale: number;
}

export const Flower: React.FC<FlowerProps> = ({ position, color, scale }) => {
  const meshRef = useRef<THREE.Group>(null);

  const petalShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.1, 0.4, 0.2, 0.6, 0, 0.7);
    shape.bezierCurveTo(-0.2, 0.6, -0.1, 0.4, 0, 0);
    return shape;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.rotation.x = Math.sin(t * 0.8 + position.x) * 0.08;
      meshRef.current.rotation.z = Math.cos(t * 0.7 + position.z) * 0.08;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Thin sinuous stem */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 3.0, 6]} />
        <meshStandardMaterial color="#0b240b" />
      </mesh>

      {/* Flower Head */}
      <group ref={meshRef}>
        {/* Glowing Center */}
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#ffd54f" emissive="#ffc107" emissiveIntensity={1} />
        </mesh>
        
        {/* Layered Petals */}
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh 
            key={i} 
            rotation={[-Math.PI / 2.3, 0, (i * Math.PI * 2) / 10]} 
            position={[0, 0, 0]}
          >
            <shapeGeometry args={[petalShape]} />
            <meshPhysicalMaterial 
                color={color} 
                side={THREE.DoubleSide} 
                transmission={0.4}
                thickness={0.05}
                roughness={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
