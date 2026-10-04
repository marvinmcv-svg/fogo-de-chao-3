"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 700;

function Embers() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () => Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 9, z: (Math.random() - 0.5) * 5,
      sp: 0.15 + Math.random() * 0.5, off: Math.random() * 10, s: 0.012 + Math.random() * 0.03, ph: Math.random() * 6.28,
    })), []);
  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    seeds.forEach((p, i) => {
      const y = ((t * p.sp + p.off) % 7) - 3.5;
      const sway = Math.sin(t * 0.8 + p.ph) * 0.25;
      // pull toward the pointer
      const px = pointerPull(p.x + sway, pointer.x * 4.5);
      dummy.position.set(px, y, p.z);
      const fade = 1 - Math.abs(y) / 3.5;
      dummy.scale.setScalar(p.s * (0.4 + fade));
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current!.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#ff7a3d" toneMapped={false} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}
const pointerPull = (x: number, target: number) => x + (target - x) * 0.12;

/** A skewer of meat that turns slowly and tilts toward the pointer. */
function Skewer() {
  const g = useRef<THREE.Group>(null);
  const wide = useThree((s) => s.size.width) > 800;
  const chunks = useMemo(() => [-1.5, -0.75, 0, 0.75, 1.5].map((y, i) => ({ y, r: 0.42 + (i % 2) * 0.08, c: i % 2 ? "#3a1c12" : "#4b2517" })), []);
  useFrame(({ clock, pointer }, dt) => {
    const o = g.current!;
    o.rotation.y += dt * 0.6;
    o.rotation.z = THREE.MathUtils.lerp(o.rotation.z, -0.45 + pointer.x * 0.25, 0.05);
    o.rotation.x = THREE.MathUtils.lerp(o.rotation.x, pointer.y * 0.2, 0.05);
    o.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.08;
  });
  return (
    <group ref={g} position={[wide ? 2.1 : 0.6, 0, 0]}>
      <mesh><cylinderGeometry args={[0.025, 0.025, 4.6, 12]} /><meshStandardMaterial color="#c9c2b8" metalness={1} roughness={0.25} /></mesh>
      {chunks.map((c, i) => (
        <mesh key={i} position={[0, c.y, 0]} scale={[1, 0.8, 1]}>
          <icosahedronGeometry args={[c.r, 2]} />
          <meshStandardMaterial color={c.c} roughness={0.55} metalness={0.05} emissive="#e2531f" emissiveIntensity={0.07} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export default function EmberScene() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} aria-hidden>
      <ambientLight intensity={0.4} />
      <pointLight position={[2.5, -1.5, 3]} intensity={60} color="#ff7a3d" />
      <pointLight position={[-3, 2, 2]} intensity={25} color="#d8c3a5" />
      <Skewer />
      <Embers />
    </Canvas>
  );
}
