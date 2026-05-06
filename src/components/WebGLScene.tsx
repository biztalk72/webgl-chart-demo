"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function RotatingTorus() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.x += delta * 0.3;
    ref.current.rotation.y += delta * 0.5;
  });
  return (
    <mesh ref={ref} position={[-2.5, 0, 0]}>
      <torusKnotGeometry args={[0.8, 0.3, 128, 32]} />
      <MeshDistortMaterial color="#6366f1" roughness={0.2} metalness={0.8} distort={0.3} speed={2} />
    </mesh>
  );
}

function FloatingSphere() {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh position={[2.5, 0, 0]}>
        <icosahedronGeometry args={[1.2, 4]} />
        <MeshDistortMaterial color="#22c55e" roughness={0.1} metalness={0.9} distort={0.4} speed={3} />
      </mesh>
    </Float>
  );
}

function ParticleField({ count = 2000 }: { count?: number }) {
  const points = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3);
    const palette = [
      [0.39, 0.4, 0.95],   // indigo
      [0.13, 0.77, 0.37],   // green
      [0.92, 0.7, 0.03],    // yellow
      [0.94, 0.27, 0.27],   // red
    ];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }
    return col;
  }, [count]);

  useFrame((_, delta) => {
    points.current.rotation.y += delta * 0.05;
    points.current.rotation.x += delta * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function CentralOctahedron() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.4;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial color="#eab308" wireframe roughness={0.3} metalness={0.7} />
    </mesh>
  );
}

export function WebGLScene() {
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-border bg-black/50">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#6366f1" />
        <Environment preset="night" />

        <RotatingTorus />
        <FloatingSphere />
        <CentralOctahedron />
        <ParticleField />

        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
}
