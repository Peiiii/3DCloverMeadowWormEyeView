
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, LUT } from '@react-three/postprocessing';
import { Meadow } from './components/Meadow';
import { WaterSurface } from './components/WaterSurface';
import { Particles } from './components/Particles';
import * as THREE from 'three';

export default function App() {
  const [debug, setDebug] = useState(false);

  return (
    <div className="w-full h-full relative font-sans overflow-hidden bg-[#001a1a]">
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2('#0a3a3a', 0.08); 
        }}
      >
        <PerspectiveCamera makeDefault position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]} fov={75} />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false}
          maxPolarAngle={Math.PI / 1.5} 
          minPolarAngle={0}
          rotateSpeed={0.3}
        />

        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          
          {/* Intense Sunlight from above */}
          <directionalLight 
            position={[0, 20, 0]} 
            intensity={4.5} 
            color="#fffcf0" 
            castShadow 
            shadow-mapSize={[2048, 2048]}
          />
          
          {/* Fill light to make the greens pop */}
          <pointLight position={[0, -5, 0]} intensity={2} color="#00ffaa" />

          <Meadow />
          <WaterSurface />
          <Particles />

          <EffectComposer multisampling={4}>
            <Bloom 
              luminanceThreshold={0.9} 
              mipmapBlur 
              intensity={2.8} 
              radius={0.7}
            />
            <Noise opacity={0.03} />
            <Vignette offset={0.2} darkness={0.6} eskil={false} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Overlay UI - Elegant Minimalist */}
      <div className="absolute top-12 left-0 w-full flex flex-col items-center pointer-events-none">
        <h1 className="text-white text-6xl font-extralight tracking-[0.5em] uppercase opacity-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
          EMERALD ZEN
        </h1>
        <p className="text-white/70 text-sm mt-6 font-light tracking-[0.3em] uppercase">
          Crystal Spring Sanctuary
        </p>
      </div>

      <div className="absolute bottom-12 left-0 w-full flex justify-center items-center">
         <button 
           onClick={() => setDebug(!debug)}
           className="px-12 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] tracking-[0.4em] rounded-full backdrop-blur-md transition-all border border-white/20 uppercase"
         >
           Nature Interaction
         </button>
      </div>

      {/* Film grain/vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>
    </div>
  );
}
