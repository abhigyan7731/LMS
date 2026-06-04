'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Text, PerspectiveCamera, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Artifact({ position, label, type, color }) {
  const meshRef = useRef();
  
  // Rotating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z += 0.005;
    }
  });

  // Choose geometry based on type
  const Geometry = useMemo(() => {
    switch (type) {
      case 'Development': return <icosahedronGeometry args={[1, 0]} />;
      case 'Design': return <torusKnotGeometry args={[0.6, 0.2, 128, 16]} />;
      case 'Business': return <octahedronGeometry args={[1, 0]} />;
      case 'Marketing': return <tetrahedronGeometry args={[1, 0]} />;
      default: return <dodecahedronGeometry args={[1, 0]} />;
    }
  }, [type]);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} position={position}>
      <mesh ref={meshRef} castShadow>
        {Geometry}
        <MeshDistortMaterial
          color={color}
          speed={2}
          distort={0.3}
          radius={1}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
      >
        {label}
      </Text>
      {/* Pedestal glow */}
      <pointLight position={[0, -1.5, 0]} distance={3} intensity={2} color={color} />
    </Float>
  );
}

export default function TrophyVault({ completedCourses = [], className = '' }) {
  const artifacts = useMemo(() => {
    return completedCourses.map((course, i) => {
      const radius = 6;
      const angle = (i / completedCourses.length) * Math.PI * 2;
      return {
        id: course.id,
        label: course.title,
        type: course.category || 'Other',
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        color: i % 3 === 0 ? '#f59e0b' : i % 3 === 1 ? '#10b981' : '#8b5cf6',
      };
    });
  }, [completedCourses]);

  if (completedCourses.length === 0) {
    return (
      <div className={`w-full h-[400px] flex flex-col items-center justify-center bg-slate-950/50 rounded-3xl border border-dashed border-white/10 ${className}`}>
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 depth-breathe">
            <span className="text-2xl">🏆</span>
        </div>
        <h3 className="text-white font-bold">The Vault is Empty</h3>
        <p className="text-white/40 text-sm">Complete a course to earn your first 3D artifact.</p>
      </div>
    );
  }

  return (
    <div className={`w-full h-[500px] bg-slate-950/80 rounded-3xl border border-white/10 overflow-hidden relative group ${className}`}>
      {/* HUD overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-white font-bold text-xl mb-1 flex items-center gap-3">
          <span className="p-2 rounded-lg bg-amber-500/20 text-amber-500">🏆</span>
          Trophy Vault
        </h3>
        <p className="text-white/40 text-xs">Exhibiting {completedCourses.length} Mastered Skills</p>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 8, 15]} fov={45} />
        <OrbitControls 
          enablePan={false} 
          maxDistance={30} 
          minDistance={10}
          maxPolarAngle={Math.PI / 2.1} // Prevent looking under the floor
        />
        
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Environment preset="city" />

        {artifacts.map((art) => (
          <Artifact key={art.id} {...art} />
        ))}

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.2} />
        </mesh>
        
        <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
        
        <fog attach="fog" args={['#020617', 10, 40]} />
      </Canvas>
    </div>
  );
}
