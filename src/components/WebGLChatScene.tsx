"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  MeshDistortMaterial,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";

/* ─── Types ─── */
export interface SceneObjectAnimation {
  type: "rotate" | "orbit" | "float" | "bounce" | "pulse";
  speed?: number;
  axis?: "x" | "y" | "z";
  target?: string;
}

export interface SceneObject {
  id: string;
  geometry: string;
  color: string;
  size: number[];
  position: [number, number, number];
  rotation?: [number, number, number];
  material?: "standard" | "wireframe" | "metallic" | "glass";
  animation?: SceneObjectAnimation;
}

/* ─── Geometry factory ─── */
function GeometryFromDescriptor({
  geometry,
  size,
}: {
  geometry: string;
  size: number[];
}) {
  switch (geometry) {
    case "box":
      return (
        <boxGeometry args={[size[0] ?? 1, size[1] ?? 1, size[2] ?? 1]} />
      );
    case "sphere":
      return (
        <sphereGeometry args={[size[0] ?? 1, size[1] ?? 32, size[2] ?? 32]} />
      );
    case "torus":
      return (
        <torusGeometry
          args={[size[0] ?? 1, size[1] ?? 0.4, size[2] ?? 32, size[3] ?? 64]}
        />
      );
    case "torusKnot":
      return (
        <torusKnotGeometry
          args={[size[0] ?? 1, size[1] ?? 0.3, size[2] ?? 128, size[3] ?? 32]}
        />
      );
    case "cylinder":
      return (
        <cylinderGeometry
          args={[size[0] ?? 1, size[1] ?? 1, size[2] ?? 2, size[3] ?? 32]}
        />
      );
    case "cone":
      return (
        <coneGeometry args={[size[0] ?? 1, size[1] ?? 2, size[2] ?? 32]} />
      );
    case "plane":
      return <planeGeometry args={[size[0] ?? 2, size[1] ?? 2]} />;
    case "icosahedron":
      return <icosahedronGeometry args={[size[0] ?? 1, size[1] ?? 0]} />;
    case "octahedron":
      return <octahedronGeometry args={[size[0] ?? 1, size[1] ?? 0]} />;
    case "dodecahedron":
      return <dodecahedronGeometry args={[size[0] ?? 1, size[1] ?? 0]} />;
    case "ring":
      return (
        <ringGeometry
          args={[size[0] ?? 0.5, size[1] ?? 1, size[2] ?? 32]}
        />
      );
    default:
      return <boxGeometry args={[1, 1, 1]} />;
  }
}

/* ─── Material factory ─── */
function MaterialFromDescriptor({
  color,
  material,
}: {
  color: string;
  material?: string;
}) {
  switch (material) {
    case "wireframe":
      return (
        <meshStandardMaterial color={color} wireframe roughness={0.3} metalness={0.7} />
      );
    case "metallic":
      return (
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.95} />
      );
    case "glass":
      return (
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.4}
          roughness={0.05}
          metalness={0.1}
          transmission={0.9}
          thickness={1}
        />
      );
    default:
      return (
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          distort={0.15}
          speed={2}
        />
      );
  }
}

/* ─── Animated dynamic object ─── */
function DynamicObject({
  obj,
  allObjects,
}: {
  obj: SceneObject;
  allObjects: SceneObject[];
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const initialScale = useRef(new THREE.Vector3(1, 1, 1));

  useFrame((state, delta) => {
    if (!meshRef.current || !obj.animation) return;
    const { type, speed = 1, axis = "y", target } = obj.animation;

    switch (type) {
      case "rotate": {
        const r = delta * speed;
        if (axis === "x") meshRef.current.rotation.x += r;
        else if (axis === "z") meshRef.current.rotation.z += r;
        else meshRef.current.rotation.y += r;
        break;
      }
      case "orbit": {
        const targetObj = allObjects.find((o) => o.id === target);
        const center = targetObj
          ? new THREE.Vector3(...targetObj.position)
          : new THREE.Vector3(0, 0, 0);
        const t = state.clock.elapsedTime * speed;
        const radius = center.distanceTo(
          new THREE.Vector3(...obj.position)
        ) || 2.5;
        meshRef.current.position.x = center.x + Math.cos(t) * radius;
        meshRef.current.position.z = center.z + Math.sin(t) * radius;
        meshRef.current.position.y =
          obj.position[1] + Math.sin(t * 0.5) * 0.3;
        break;
      }
      case "float": {
        meshRef.current.position.y =
          obj.position[1] +
          Math.sin(state.clock.elapsedTime * speed) * 0.5;
        break;
      }
      case "bounce": {
        meshRef.current.position.y =
          obj.position[1] +
          Math.abs(Math.sin(state.clock.elapsedTime * speed * 2)) * 1.5;
        break;
      }
      case "pulse": {
        const s = 1 + Math.sin(state.clock.elapsedTime * speed * 2) * 0.2;
        meshRef.current.scale.set(
          initialScale.current.x * s,
          initialScale.current.y * s,
          initialScale.current.z * s
        );
        break;
      }
    }
  });

  // Wrap float-animated objects with Float helper for extra smoothness
  const mesh = (
    <mesh
      ref={meshRef}
      position={obj.position}
      rotation={
        obj.rotation
          ? [obj.rotation[0], obj.rotation[1], obj.rotation[2]]
          : [0, 0, 0]
      }
    >
      <GeometryFromDescriptor geometry={obj.geometry} size={obj.size} />
      <MaterialFromDescriptor color={obj.color} material={obj.material} />
    </mesh>
  );

  if (obj.animation?.type === "float" && !obj.animation.target) {
    return (
      <Float
        speed={obj.animation.speed ?? 2}
        rotationIntensity={0.5}
        floatIntensity={1.5}
      >
        {mesh}
      </Float>
    );
  }

  return mesh;
}

/* ─── Default demo particles (shown when scene is empty) ─── */
function DemoParticles({ count = 800 }: { count?: number }) {
  const points = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, [count]);

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3);
    const palette = [
      [0.39, 0.4, 0.95],
      [0.13, 0.77, 0.37],
      [0.92, 0.7, 0.03],
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
    points.current.rotation.y += delta * 0.03;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Main component ─── */
export function WebGLChatScene({ objects }: { objects: SceneObject[] }) {
  const hasObjects = objects.length > 0;

  return (
    <div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-border bg-black/50">
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#6366f1" />
        <Environment preset="night" />

        {/* Always show particles as ambient background */}
        <DemoParticles />

        {/* Dynamic objects from chat */}
        {hasObjects &&
          objects.map((obj) => (
            <DynamicObject key={obj.id} obj={obj} allObjects={objects} />
          ))}

        {/* Show default demo hint when empty */}
        {!hasObjects && (
          <mesh position={[0, 0, 0]}>
            <octahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial
              color="#6366f1"
              wireframe
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
        )}

        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
}
