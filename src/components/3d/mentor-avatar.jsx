'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

function HologramCore({ isTalking }) {
  const meshRef = useRef();
  const ringRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current && meshRef.current.rotation && meshRef.current.scale) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.scale.setScalar(1 + Math.sin(time * (isTalking ? 10 : 2)) * (isTalking ? 0.1 : 0.05));
    }
    if (ringRef.current && ringRef.current.rotation) {
      ringRef.current.rotation.x = time * 0.5;
      ringRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group>
      {/* Outer Glow Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
      </mesh>
      
      {/* Main Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          speed={isTalking ? 5 : 2}
          distort={isTalking ? 0.4 : 0.2}
          radius={1}
          emissive="#a78bfa"
          emissiveIntensity={isTalking ? 2 : 0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Internal "Eye" dots */}
      <mesh position={[0, 0, 0.5]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </group>
  );
}

export default function MentorAvatar({ isTalking = false, className = '' }) {
  return (
    <div className={`w-full aspect-square relative bg-slate-950/20 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden ${className}`}>
      {/* HUD Scanlines */}
      <div className="absolute inset-0 holo-scanline opacity-20 pointer-events-none z-10" />
      
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
        
        <Float speed={3} rotationIntensity={1} floatIntensity={1}>
          <HologramCore isTalking={isTalking} />
        </Float>

        <Environment preset="night" />
        
        {/* Subtle grid floor */}
        <gridHelper args={[10, 20, '#1e1b4b', '#0f172a']} position={[0, -2, 0]} />
      </Canvas>

      {/* Talking Indicator */}
      {isTalking && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 items-end h-4">
          {[1, 2, 3, 2, 1].map((h, i) => (
            <div 
              key={i} 
              className="w-1 bg-violet-400 rounded-full animate-bounce" 
              style={{ height: `${h * 25}%`, animationDelay: `${i * 0.1}s` }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
