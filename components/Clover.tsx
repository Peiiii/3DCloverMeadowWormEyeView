
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AquaticCloverProps {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  isFourLeaf?: boolean;
}

export const Clover: React.FC<AquaticCloverProps> = ({ position, rotation, scale, isFourLeaf }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // High detail heart shape for lobes
  const lobeShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.2, 0.4, 0.5, 0.5, 0.5, 0.2);
    shape.bezierCurveTo(0.5, -0.1, 0.2, -0.3, 0, 0);
    return shape;
  }, []);

  const lobes = isFourLeaf ? 4 : 3;

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      const sway = Math.sin(t * 0.4 + position.x * 0.5) * 0.06;
      groupRef.current.rotation.x = sway;
      groupRef.current.rotation.z = Math.cos(t * 0.3 + position.z * 0.5) * 0.06;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Sinuous thin stem */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.012, 0.008, 3.0, 8]} />
        <meshStandardMaterial color="#0b240b" roughness={0.9} />
      </mesh>

      {/* Foliage */}
      <group ref={groupRef}>
        {Array.from({ length: lobes }).map((_, i) => (
          <group key={i} rotation={[0, (i * (Math.PI * 2)) / lobes, 0]}>
             <mesh rotation={[-Math.PI / 2.1, 0, 0.08]} position={[0, 0, 0]}>
                <shapeGeometry args={[lobeShape]} />
                <meshPhysicalMaterial 
                  color="#2e7d32" 
                  side={THREE.DoubleSide}
                  emissive="#64dd17"
                  emissiveIntensity={0.25}
                  transmission={0.8} // Very high for that sun-through-leaf look
                  thickness={0.15}
                  roughness={0.3}
                  clearcoat={0.2}
                />
             </mesh>
             <mesh rotation={[-Math.PI / 2.1, 0, -0.08]} position={[0, 0, 0]} scale={[-1, 1, 1]}>
                <shapeGeometry args={[lobeShape]} />
                <meshPhysicalMaterial 
                  color="#2e7d32" 
                  side={THREE.DoubleSide}
                  emissive="#64dd17"
                  emissiveIntensity={0.25}
                  transmission={0.8}
                  thickness={0.15}
                  roughness={0.3}
                  clearcoat={0.2}
                />
             </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
