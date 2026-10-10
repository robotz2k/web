export const FPS = 30;

export const COLORS = {
  ok: "#22c55e",
  warn: "#f59e0b",
  miss: "#ef4444",
  env: "#38bdf8",
  ink: "#0b1220",
  panel: "#111a2e",
  text: "#f1f5f9",
  mute: "#94a3b8",
};

export type Kind = "ok" | "warn" | "miss" | "env";

export type Part = {
  label: string;
  detail: string;
  kind: Kind;
  // pixel position in the original 1125x1500 photo
  x: number;
  y: number;
  side: "L" | "R";
};

export const PHOTO = { w: 1125, h: 1500 };
// bounding box of the segmented subject in the original photo
export const CUTOUT = { x: 154, y: 519, w: 345, h: 884 };

export const PARTS: Part[] = [
  { label: "Talud con vegetación", detail: "Pendiente natural sin contención", kind: "warn", x: 500, y: 200, side: "L" },
  { label: "Gorra negra", detail: "No es casco: no protege contra impacto", kind: "miss", x: 340, y: 560, side: "L" },
  { label: "Radio de comunicación", detail: "Comunicación disponible en el cinturón", kind: "ok", x: 245, y: 890, side: "L" },
  { label: "Postes amarillos + cinta", detail: "Delimitación del paso peatonal", kind: "env", x: 100, y: 1000, side: "L" },
  { label: "Pantalón jean", detail: "Cubre piernas; validar estándar del sitio", kind: "warn", x: 330, y: 1060, side: "L" },
  { label: "Botas de trabajo", detail: "Punta de seguridad no verificable", kind: "warn", x: 330, y: 1340, side: "L" },
  { label: "Sendero de concreto", detail: "Superficie firme, regular y limpia", kind: "env", x: 300, y: 1440, side: "L" },

  { label: "Caseta con alero oxidado", detail: "Cajas eléctricas y corrosión en la estructura", kind: "warn", x: 900, y: 300, side: "R" },
  { label: "Camisa alta visibilidad", detail: "Naranja fluorescente, buena visibilidad", kind: "ok", x: 400, y: 700, side: "R" },
  { label: "Credencial en el brazo", detail: "Identificación visible", kind: "ok", x: 452, y: 790, side: "R" },
  { label: "Cintas reflectivas", detail: "Torso y mangas, 360° de visibilidad", kind: "ok", x: 390, y: 845, side: "R" },
  { label: "Manga larga azul marino", detail: "Protección de brazos y sol", kind: "ok", x: 448, y: 900, side: "R" },
  { label: "Vaso en la mano", detail: "Mano ocupada: sin agarre ni reacción", kind: "warn", x: 450, y: 1040, side: "R" },
  { label: "Bancas de concreto", detail: "Obstáculos laterales, fuera de la ruta", kind: "env", x: 700, y: 1060, side: "R" },
];

// Scene timeline (frames @30fps, total 900)
export const T = {
  intro: { from: 0, dur: 75 },
  anatomy: { from: 75, dur: 210 },
  separation: { from: 285, dur: 120 },
  world: { from: 405, dur: 210 },
  checklist: { from: 615, dur: 180 },
  verdict: { from: 795, dur: 105 },
};
