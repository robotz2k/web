import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./data";

export const FONT = "Inter, 'Segoe UI', Helvetica, Arial, sans-serif";

export const useReveal = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 200 } });
};

export const fadeInOut = (frame: number, dur: number, edge = 12) =>
  interpolate(frame, [0, edge, dur - edge, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  title: string;
  detail: string;
  progress: number;
  align?: "left" | "right";
}> = ({ x, y, w, h, color, title, detail, progress, align = "left" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      opacity: progress,
      transform: `translateX(${(1 - progress) * (align === "left" ? -40 : 40)}px)`,
      background: COLORS.panel,
      borderRadius: 14,
      borderLeft: `8px solid ${color}`,
      padding: "14px 20px",
      boxSizing: "border-box",
      fontFamily: FONT,
      boxShadow: "0 8px 24px rgba(0,0,0,.35)",
    }}
  >
    <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.text, lineHeight: 1.15 }}>{title}</div>
    <div style={{ fontSize: 22, color, marginTop: 6, lineHeight: 1.2 }}>{detail}</div>
  </div>
);
