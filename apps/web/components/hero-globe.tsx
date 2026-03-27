'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float, Ring } from '@react-three/drei';
import * as THREE from 'three';

function GlobeCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <Sphere args={[2, 64, 64]}>
          <MeshDistortMaterial
            color="#22c55e"
            attach="material"
            distort={0.25}
            speed={1.5}
            roughness={0.1}
            metalness={0.8}
            wireframe={false}
            opacity={0.7}
            transparent
          />
        </Sphere>
      </mesh>
    </Float>
  );
}

function OrbitRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.getElapsedTime() * speed;
    }
  });
  return (
    <group ref={groupRef}>
      <Ring args={[radius, radius + 0.02, 64]}>
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </Ring>
    </group>
  );
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 1.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#4ade80" size={0.04} transparent opacity={0.6} />
    </points>
  );
}

export function HeroGlobe() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#22c55e" />
        <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#3b82f6" />
        <pointLight position={[0, 0, 3]} intensity={2} color="#4ade80" distance={10} />
        <Stars radius={80} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />
        <GlobeCore />
        <OrbitRing radius={2.8} speed={0.3} color="#22c55e" />
        <OrbitRing radius={3.3} speed={-0.2} color="#3b82f6" />
        <OrbitRing radius={3.8} speed={0.15} color="#fbbf24" />
        <Particles />
      </Canvas>
    </div>
  );
}
