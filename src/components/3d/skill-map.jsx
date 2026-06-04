'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Text, PerspectiveCamera, OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

function SkillNode({ position, label, progress, color, isActive }) {
  const meshRef = useRef();
  
  // Animate pulse based on progress
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      if (meshRef.current.scale) {
        meshRef.current.scale.set(pulse, pulse, pulse);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[isActive ? 0.6 : 0.4, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          speed={isActive ? 3 : 1.5}
          distort={isActive ? 0.4 : 0.2}
          radius={1}
          emissive={color}
          emissiveIntensity={isActive ? 1.5 : 0.5}
        />
      </mesh>
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff" // Assuming Inter is available or fall back
      >
        {label}
      </Text>
    </Float>
  );
}

function Connection({ start, end }) {
  return (
    <Line
      points={[start, end]}
      color="#4f46e5"
      lineWidth={1}
      transparent
      opacity={0.3}
    />
  );
}

export default function SkillMap({ courses = [], className = '' }) {
  // Group courses by category into a 3D layout
  const nodes = useMemo(() => {
    const categories = [...new Set(courses.map(c => c.category || 'Other'))];
    return categories.map((cat, i) => {
      const angle = (i / categories.length) * Math.PI * 2;
      const radius = 4;
      return {
        id: cat,
        label: cat,
        position: [Math.cos(angle) * radius, Math.sin(angle) * (radius / 2), Math.sin(angle) * (radius / 2)],
        color: i % 2 === 0 ? '#8b5cf6' : '#3b82f6',
        isActive: i === 0, // Highlight the most recent or highest progress
      };
    });
  }, [courses]);

  return (
    <div className={`w-full aspect-[16/9] lg:aspect-auto h-[400px] lg:h-[600px] bg-slate-950/50 rounded-3xl border border-white/10 overflow-hidden relative group ${className}`}>
      {/* Overlay controls hint */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          Neural Skill Map
        </h3>
        <p className="text-white/40 text-xs">Left click to Rotate · Scroll to Zoom</p>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          maxDistance={15} 
          minDistance={5}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

        {nodes.map((node) => (
          <SkillNode key={node.id} {...node} />
        ))}
        
        {/* Simple ring connections */}
        {nodes.map((node, i) => {
          const nextNode = nodes[(i + 1) % nodes.length];
          return <Connection key={`conn-${i}`} start={node.position} end={nextNode.position} />;
        })}

        {/* Cinematic background fog */}
        <fog attach="fog" args={['#020617', 5, 20]} />
      </Canvas>
    </div>
  );
}
