import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "./data";
import { Card, fadeInOut, FONT, useReveal } from "./ui";

const FOV = 40;
const RADIUS = 7.6;
const WORKER_H = 1.75;
const WORKER_W = (WORKER_H * 345) / 884;

const workerZ = (f: number) => -f * 0.01;

const cameraFor = (f: number) => {
  const az = interpolate(f, [0, 210], [-0.4, 0.4]);
  const h = interpolate(f, [0, 210], [1.5, 2.0]);
  const tz = workerZ(f) - 0.6;
  return {
    pos: new THREE.Vector3(Math.sin(az) * RADIUS, h, tz + Math.cos(az) * RADIUS),
    target: new THREE.Vector3(0.3, 1.0, tz),
  };
};

const project = (f: number, v: THREE.Vector3, w: number, h: number) => {
  const cam = new THREE.PerspectiveCamera(FOV, w / h, 0.1, 100);
  const { pos, target } = cameraFor(f);
  cam.position.copy(pos);
  cam.lookAt(target);
  cam.updateMatrixWorld();
  cam.updateProjectionMatrix();
  const p = v.clone().project(cam);
  return { x: (p.x * 0.5 + 0.5) * w, y: (-p.y * 0.5 + 0.5) * h };
};

const Rig: React.FC<{ f: number }> = ({ f }) => {
  const camera = useThree((s) => s.camera);
  const { pos, target } = cameraFor(f);
  camera.position.copy(pos);
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  return null;
};

const Worker: React.FC<{ f: number }> = ({ f }) => {
  const tex = useLoader(THREE.TextureLoader, staticFile("worker-cutout.png"));
  tex.colorSpace = THREE.SRGBColorSpace;
  const z = workerZ(f);
  const bob = Math.abs(Math.sin(f / 5)) * 0.015;
  const missing = 0.45 + 0.35 * Math.sin(f / 5);
  const show = f > 120 ? 1 : 0;
  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, WORKER_H / 2 + bob, 0]}>
        <planeGeometry args={[WORKER_W, WORKER_H]} />
        <meshBasicMaterial map={tex} transparent alphaTest={0.05} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} scale={[1, 0.55, 1]}>
        <circleGeometry args={[0.38, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.35} />
      </mesh>
      {/* ghost hard hat: the missing PPE */}
      <mesh position={[0, 1.72, 0.0]} visible={show === 1}>
        <sphereGeometry args={[0.19, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color={COLORS.miss} transparent opacity={missing} wireframe />
      </mesh>
      <mesh position={[0, 1.72, 0.0]} rotation={[-Math.PI / 2, 0, 0]} visible={show === 1}>
        <ringGeometry args={[0.19, 0.27, 32]} />
        <meshBasicMaterial color={COLORS.miss} transparent opacity={missing} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const Box: React.FC<{
  p: [number, number, number];
  s: [number, number, number];
  c: string;
  r?: [number, number, number];
}> = ({ p, s, c, r }) => (
  <mesh position={p} scale={s} rotation={r ?? [0, 0, 0]}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color={c} roughness={0.9} />
  </mesh>
);

const Tree: React.FC<{ p: [number, number, number]; s: number; c?: string }> = ({ p, s, c = "#3f7d2c" }) => (
  <group position={p} scale={s}>
    <Box p={[0, 0.5, 0]} s={[0.2, 1, 0.2]} c="#6b4a2b" />
    <mesh position={[0, 1.6, 0]}>
      <coneGeometry args={[0.9, 2.2, 8]} />
      <meshStandardMaterial color={c} roughness={1} />
    </mesh>
  </group>
);

const World: React.FC = () => {
  const posts = Array.from({ length: 12 }, (_, i) => -1.25);
  return (
    <>
      <color attach="background" args={["#bcd8ee"]} />
      <fog attach="fog" args={["#bcd8ee", 12, 34]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 8, 5]} intensity={1.6} />
      {/* ground + walkway */}
      <Box p={[0, -0.05, -8]} s={[60, 0.1, 60]} c="#6f9b3e" />
      <Box p={[0, 0.02, -8]} s={[1.7, 0.06, 40]} c="#b9b6ae" />
      <Box p={[-0.87, 0.03, -8]} s={[0.05, 0.06, 40]} c="#8d8a82" />
      <Box p={[0.87, 0.03, -8]} s={[0.05, 0.06, 40]} c="#8d8a82" />
      {/* yellow posts + rope */}
      {posts.map((x, i) => (
        <Box key={i} p={[x, 0.55, 3 - i * 1.4]} s={[0.1, 1.1, 0.1]} c="#f2b705" />
      ))}
      <Box p={[-1.25, 0.9, -5]} s={[0.03, 0.03, 16]} c="#c9a24a" />
      <Box p={[-1.25, 0.6, -5]} s={[0.03, 0.03, 16]} c="#c9a24a" />
      {/* building (right) */}
      <Box p={[3.6, 1.4, -5]} s={[2.4, 2.8, 8]} c="#dde6f0" />
      <Box p={[2.1, 2.85, -5]} s={[1.5, 0.12, 8.2]} c="#2f6fb0" />
      <Box p={[3.6, 2.9, -5]} s={[2.5, 0.12, 8.2]} c="#7a4b45" />
      <Box p={[2.38, 1.2, -4]} s={[0.05, 1.9, 0.9]} c="#c3cedb" />
      <Box p={[2.36, 1.3, -6.2]} s={[0.08, 0.5, 0.35]} c="#7d8794" />
      {/* concrete benches */}
      <Box p={[1.55, 0.42, -0.6]} s={[0.55, 0.12, 1.1]} c="#a9a59b" />
      <Box p={[1.55, 0.2, -0.6]} s={[0.4, 0.4, 0.9]} c="#8f8b82" />
      <Box p={[1.55, 0.42, -2.2]} s={[0.55, 0.12, 1.1]} c="#a9a59b" />
      <Box p={[1.55, 0.2, -2.2]} s={[0.4, 0.4, 0.9]} c="#8f8b82" />
      {/* shrub */}
      <mesh position={[2.0, 0.65, -3.6]} scale={[0.9, 1.0, 0.9]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#2f8a2f" roughness={1} />
      </mesh>
      {/* slope with vegetation (left/back) */}
      <Box p={[-9, 2.5, -10]} s={[10, 1, 40]} c="#7aa24a" r={[0, 0, -0.5]} />
      <Box p={[0, 3, -22]} s={[40, 8, 2]} c="#7aa24a" r={[0.5, 0, 0]} />
      {[-4, -5.5, -7, -3.5, -6].map((x, i) => (
        <Tree key={i} p={[x, 0.2 + (i % 2) * 0.8, -3 - i * 2.3]} s={1 + (i % 3) * 0.3} c={i % 2 ? "#4c8a34" : "#3a7428"} />
      ))}
      {[-1.2, 0.5, 2.5, 4.5].map((x, i) => (
        <Tree key={`b${i}`} p={[x, 1.2, -18 - i]} s={1.6} c="#3a7428" />
      ))}
    </>
  );
};

type Tag = {
  text: string;
  color: string;
  anchor: (z: number) => THREE.Vector3;
  side: "L" | "R";
  slot: number;
  at: number;
};

const TAGS: Tag[] = [
  { text: "Talud con vegetación", color: COLORS.warn, anchor: () => new THREE.Vector3(-5, 2.2, -8), side: "L", slot: 0, at: 15 },
  { text: "Postes + cinta", color: COLORS.env, anchor: (z) => new THREE.Vector3(-1.25, 0.9, z - 1.5), side: "L", slot: 1, at: 30 },
  { text: "FALTA CASCO", color: COLORS.miss, anchor: (z) => new THREE.Vector3(0, 1.85, z), side: "L", slot: 2, at: 110 },
  { text: "Cintas reflectivas", color: COLORS.ok, anchor: (z) => new THREE.Vector3(-0.1, 1.2, z), side: "L", slot: 3, at: 125 },
  { text: "Radio", color: COLORS.ok, anchor: (z) => new THREE.Vector3(-0.16, 1.0, z), side: "L", slot: 4, at: 140 },
  { text: "Botas de trabajo", color: COLORS.warn, anchor: (z) => new THREE.Vector3(0.05, 0.1, z), side: "L", slot: 5, at: 170 },
  { text: "Caseta oxidada", color: COLORS.warn, anchor: (z) => new THREE.Vector3(2.4, 2.4, z - 3), side: "R", slot: 0, at: 45 },
  { text: "Camisa alta visibilidad", color: COLORS.ok, anchor: (z) => new THREE.Vector3(0.15, 1.4, z), side: "R", slot: 1, at: 118 },
  { text: "Guantes: no porta", color: COLORS.miss, anchor: (z) => new THREE.Vector3(0.3, 0.8, z), side: "R", slot: 2, at: 155 },
  { text: "Bancas de concreto", color: COLORS.env, anchor: () => new THREE.Vector3(1.55, 0.5, -2.2), side: "R", slot: 3, at: 60 },
  { text: "Sendero de concreto", color: COLORS.env, anchor: (z) => new THREE.Vector3(0, 0.05, z - 3.0), side: "R", slot: 4, at: 75 },
];

const TagView: React.FC<{ tag: Tag; f: number; w: number; h: number }> = ({ tag, f, w, h }) => {
  const p = useReveal(tag.at);
  const a = project(f, tag.anchor(workerZ(f)), w, h);
  const width = 330;
  const bx = tag.side === "L" ? 40 : w - width - 40;
  const by = 190 + tag.slot * 125;
  const cx = tag.side === "L" ? bx + width : bx;
  return (
    <>
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={a.x} y1={a.y} x2={a.x + (cx - a.x) * p} y2={a.y + (by + 28 - a.y) * p} stroke={tag.color} strokeWidth={3} />
        <circle cx={a.x} cy={a.y} r={9 * p} fill={tag.color} stroke="#fff" strokeWidth={2} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: bx,
          top: by,
          width,
          opacity: p,
          background: "rgba(10,16,30,.88)",
          borderLeft: `8px solid ${tag.color}`,
          borderRadius: 12,
          padding: "10px 16px",
          fontFamily: FONT,
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.text,
          boxSizing: "border-box",
        }}
      >
        {tag.text}
      </div>
    </>
  );
};

export const World3D: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const title = useReveal(0);
  const camera = useMemo(() => ({ fov: FOV, position: [0, 1.5, 6] as [number, number, number], near: 0.1, far: 100 }), []);
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(f, dur, 10) }}>
      <ThreeCanvas width={width} height={height} camera={camera}>
        <Rig f={f} />
        <World />
        <Worker f={f} />
      </ThreeCanvas>
      {TAGS.map((t) => (
        <TagView key={t.text} tag={t} f={f} w={width} h={height} />
      ))}
      <Card
        x={40}
        y={40}
        w={560}
        h={112}
        color={COLORS.env}
        title="Entorno 3D reconstruido"
        detail="Sujeto ubicado en su escenario"
        progress={title}
      />
    </AbsoluteFill>
  );
};
