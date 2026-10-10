import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLORS, CUTOUT, Part, PARTS, PHOTO } from "./data";
import { Card, fadeInOut, FONT, useReveal } from "./ui";

// Photo is shown at 750x1000 in the center of the 1920x1080 frame
export const PH = { x: 585, y: 40, s: 1000 / PHOTO.h };

const Backdrop: React.FC = () => (
  <AbsoluteFill
    style={{ background: "radial-gradient(circle at 50% 40%, #16233f 0%, #070b14 75%)" }}
  />
);

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useReveal(5);
  const sub = useReveal(22);
  const scale = interpolate(frame, [0, 75], [1.0, 1.08]);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop />
      <Img
        src={staticFile("worker.jpg")}
        style={{
          position: "absolute",
          left: PH.x,
          top: PH.y,
          width: PHOTO.w * PH.s,
          height: PHOTO.h * PH.s,
          borderRadius: 18,
          transform: `scale(${scale})`,
          opacity: interpolate(frame, [0, 20], [0, 0.55], { extrapolateRight: "clamp" }),
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center" }}>
        <div
          style={{
            fontSize: 112,
            fontWeight: 800,
            color: COLORS.text,
            opacity: t,
            transform: `translateY(${(1 - t) * 40}px)`,
            textShadow: "0 6px 30px rgba(0,0,0,.8)",
          }}
        >
          Análisis visual SSOMA
        </div>
        <div
          style={{
            fontSize: 44,
            color: COLORS.warn,
            marginTop: 14,
            opacity: sub,
            fontWeight: 600,
            textShadow: "0 4px 20px rgba(0,0,0,.9)",
          }}
        >
          EPP · Entorno · Brechas · Categoría de riesgo
        </div>
      </div>
    </AbsoluteFill>
  );
};

const AnatomyItem: React.FC<{ part: Part; index: number }> = ({ part: p, index: i }) => {
  const frame = useCurrentFrame();
  const side = p.side;
  const pr = useReveal(15 + i * 11 + (side === "R" ? 5 : 0));
  const cardX = side === "L" ? 40 : 1400;
  const cardY = 40 + i * 140;
  const lineX = side === "L" ? cardX + 480 : cardX;
  const color = COLORS[p.kind];
  const ax = PH.x + p.x * PH.s;
  const ay = PH.y + p.y * PH.s;
  const cy = cardY + 56;
  const pulse = 1 + 0.25 * Math.sin((frame + i * 5) / 4);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        <line x1={lineX} y1={cy} x2={lineX + (ax - lineX) * pr} y2={cy + (ay - cy) * pr} stroke={color} strokeWidth={3} />
        <circle cx={ax} cy={ay} r={11 * pulse * pr} fill={color} fillOpacity={0.35} />
        <circle cx={ax} cy={ay} r={6 * pr} fill={color} stroke="#fff" strokeWidth={2} />
      </svg>
      <Card x={cardX} y={cardY} w={480} h={112} color={color} title={p.label} detail={p.detail} progress={pr} align={side === "L" ? "left" : "right"} />
    </>
  );
};

export const Anatomy: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const photoIn = useReveal(0);
  const left = PARTS.filter((p) => p.side === "L");
  const right = PARTS.filter((p) => p.side === "R");

  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: fadeInOut(frame, dur, 10) }}>
      <Backdrop />
      <Img
        src={staticFile("worker.jpg")}
        style={{
          position: "absolute",
          left: PH.x,
          top: PH.y,
          width: PHOTO.w * PH.s,
          height: PHOTO.h * PH.s,
          borderRadius: 18,
          opacity: photoIn,
          boxShadow: "0 0 60px rgba(56,189,248,.25)",
        }}
      />
      {left.map((p, i) => (
        <AnatomyItem key={p.label} part={p} index={i} />
      ))}
      {right.map((p, i) => (
        <AnatomyItem key={p.label} part={p} index={i} />
      ))}
    </AbsoluteFill>
  );
};

const Checker: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: "#1b2236",
      backgroundImage:
        "linear-gradient(45deg,#232b43 25%,transparent 25%,transparent 75%,#232b43 75%),linear-gradient(45deg,#232b43 25%,transparent 25%,transparent 75%,#232b43 75%)",
      backgroundSize: "60px 60px",
      backgroundPosition: "0 0,30px 30px",
    }}
  />
);

export const Separation: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const bgDim = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgGone = interpolate(frame, [55, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scan = interpolate(frame, [8, 50], [0, 1000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labels = useReveal(40);
  const glow = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bob = Math.sin(frame / 8) * 4 * bgGone;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: fadeInOut(frame, dur, 10) }}>
      <Backdrop />
      <Checker />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - bgGone }}>
        <Img
          src={staticFile("worker.jpg")}
          style={{
            position: "absolute",
            left: PH.x,
            top: PH.y,
            width: PHOTO.w * PH.s,
            height: PHOTO.h * PH.s,
            borderRadius: 18,
            filter: `blur(${bgDim * 5}px) grayscale(${bgDim}) brightness(${1 - bgDim * 0.5})`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: PH.x,
          top: PH.y + scan,
          width: PHOTO.w * PH.s,
          height: 4,
          background: COLORS.env,
          boxShadow: "0 0 24px 8px rgba(56,189,248,.8)",
          opacity: frame < 55 ? 1 : 0,
        }}
      />
      <Img
        src={staticFile("worker-cutout.png")}
        style={{
          position: "absolute",
          left: PH.x + CUTOUT.x * PH.s,
          top: PH.y + CUTOUT.y * PH.s + bob,
          width: CUTOUT.w * PH.s,
          height: CUTOUT.h * PH.s,
          filter: `drop-shadow(0 0 ${glow * 10}px #38bdf8) drop-shadow(0 0 ${glow * 4}px #fff)`,
        }}
      />
      <Card
        x={120}
        y={440}
        w={420}
        h={112}
        color={COLORS.mute}
        title="FONDO"
        detail="Se descarta de la imagen"
        progress={labels}
      />
      <Card
        x={1380}
        y={440}
        w={420}
        h={112}
        color={COLORS.env}
        title="SUJETO"
        detail="Segmentado y recortado"
        progress={labels}
        align="right"
      />
    </AbsoluteFill>
  );
};

type Row = { mark: string; color: string; title: string; detail: string };

const EPP: Row[] = [
  { mark: "✔", color: COLORS.ok, title: "Camisa alta visibilidad", detail: "Presente" },
  { mark: "✔", color: COLORS.ok, title: "Cintas reflectivas", detail: "Torso y brazos" },
  { mark: "✔", color: COLORS.ok, title: "Radio de comunicación", detail: "Presente" },
  { mark: "!", color: COLORS.warn, title: "Botas de trabajo", detail: "Punta de seguridad no verificable" },
  { mark: "!", color: COLORS.warn, title: "Pantalón jean", detail: "Validar estándar del sitio" },
  { mark: "✖", color: COLORS.miss, title: "Casco de seguridad", detail: "AUSENTE: usa gorra" },
  { mark: "?", color: COLORS.warn, title: "Lentes de seguridad", detail: "No visibles (vista posterior)" },
  { mark: "✖", color: COLORS.miss, title: "Guantes", detail: "No porta; mano ocupada" },
];

const SCENE: Row[] = [
  { mark: "+", color: COLORS.ok, title: "Sendero peatonal delimitado", detail: "Postes y cinta como control" },
  { mark: "+", color: COLORS.ok, title: "Sin tráfico ni maquinaria", detail: "No se observan en la imagen" },
  { mark: "–", color: COLORS.warn, title: "Talud con vegetación", detail: "Caída de material o fauna" },
  { mark: "–", color: COLORS.warn, title: "Caseta oxidada y cajas eléctricas", detail: "Contacto o golpe en el borde" },
  { mark: "–", color: COLORS.miss, title: "Vaso en la mano", detail: "Distracción y sin agarre" },
];

const RowView: React.FC<{ row: Row; delay: number; y: number; x: number; w: number }> = ({ row, delay, y, x, w }) => {
  const p = useReveal(delay);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: 88,
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: COLORS.panel,
        borderRadius: 14,
        padding: "0 20px",
        boxSizing: "border-box",
        borderLeft: `8px solid ${row.color}`,
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 800, color: row.color, width: 40, textAlign: "center" }}>
        {row.mark}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.text }}>{row.title}</div>
        <div style={{ fontSize: 21, color: row.color }}>{row.detail}</div>
      </div>
    </div>
  );
};

export const Checklist: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const head = useReveal(0);
  const head2 = useReveal(70);
  const note = useReveal(125);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: fadeInOut(frame, dur, 10) }}>
      <Backdrop />
      <Img
        src={staticFile("worker-cutout.png")}
        style={{
          position: "absolute",
          left: 60,
          top: 150,
          width: CUTOUT.w * 0.85,
          height: CUTOUT.h * 0.85,
          filter: "drop-shadow(0 0 14px rgba(56,189,248,.7))",
        }}
      />
      <div style={{ position: "absolute", left: 400, top: 40, fontSize: 38, fontWeight: 800, color: COLORS.text, opacity: head }}>
        EPP del trabajador
      </div>
      {EPP.map((r, i) => (
        <RowView key={r.title} row={r} delay={10 + i * 7} x={400} y={110 + i * 120} w={680} />
      ))}
      <div style={{ position: "absolute", left: 1140, top: 40, fontSize: 38, fontWeight: 800, color: COLORS.text, opacity: head2 }}>
        ¿Escenario de riesgo? Moderado
      </div>
      {SCENE.map((r, i) => (
        <RowView key={r.title} row={r} delay={75 + i * 8} x={1140} y={110 + i * 120} w={740} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 1140,
          top: 740,
          width: 740,
          fontSize: 27,
          lineHeight: 1.35,
          color: COLORS.mute,
          opacity: note,
        }}
      >
        El entorno está ordenado y controlado; el riesgo principal lo aporta la{" "}
        <span style={{ color: COLORS.miss, fontWeight: 700 }}>falta de casco</span> y la mano ocupada.
      </div>
    </AbsoluteFill>
  );
};

const LEVELS = [
  { name: "BAJO", color: "#22c55e" },
  { name: "MEDIO", color: "#f59e0b" },
  { name: "ALTO", color: "#f97316" },
  { name: "CRÍTICO", color: "#ef4444" },
];

export const Verdict: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const title = useReveal(0);
  const pick = useReveal(35);
  const info = useReveal(60);
  const active = 1;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }}>
      <Backdrop />
      <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", fontSize: 50, fontWeight: 700, color: COLORS.mute, opacity: title, letterSpacing: 4 }}>
        CATEGORÍA DE RIESGO
      </div>
      <div style={{ position: "absolute", top: 230, left: 160, right: 160, display: "flex", gap: 24 }}>
        {LEVELS.map((l, i) => {
          const on = i === active;
          return (
            <div
              key={l.name}
              style={{
                flex: 1,
                height: 150,
                borderRadius: 20,
                background: on ? l.color : "#18223a",
                color: on ? "#111" : COLORS.mute,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
                fontWeight: 800,
                opacity: 0.5 + 0.5 * title,
                transform: on ? `scale(${1 + 0.12 * pick})` : "none",
                boxShadow: on ? `0 0 ${50 * pick}px ${l.color}` : "none",
              }}
            >
              {l.name}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center", fontSize: 150, fontWeight: 900, color: COLORS.warn, opacity: pick, transform: `scale(${0.8 + 0.2 * pick})` }}>
        RIESGO MEDIO
      </div>
      <div style={{ position: "absolute", top: 690, left: 200, right: 200, textAlign: "center", fontSize: 34, lineHeight: 1.4, color: COLORS.text, opacity: info }}>
        Entorno controlado, pero la cabeza queda expuesta a impacto y caída de objetos.
        <br />
        <span style={{ color: COLORS.ok }}>Acción: casco y lentes en todo tránsito, y manos libres al caminar.</span>
      </div>
      <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, textAlign: "center", fontSize: 22, color: COLORS.mute, opacity: info }}>
        Evaluación visual de una sola imagen (vista posterior). No sustituye la inspección en sitio.
      </div>
    </AbsoluteFill>
  );
};
