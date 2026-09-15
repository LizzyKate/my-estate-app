import type { ReactElement } from "react";

/**
 * The brand mark used across generated icons (favicon, apple-touch-icon,
 * PWA manifest icons): a dark tile with the rounded primary-color square
 * from the in-app Logo, centered. Kept as one function so every generated
 * size stays visually consistent.
 */
export function iconMark(size: number): ReactElement {
  const inner = Math.round(size * 0.6);
  const radius = Math.round(inner * 0.28);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B1120",
      }}
    >
      <div
        style={{
          width: inner,
          height: inner,
          borderRadius: radius,
          background: "#ADC6FF",
        }}
      />
    </div>
  );
}
