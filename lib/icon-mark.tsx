import type { ReactElement } from "react";

/** one accent per surface, so three installed icons stay tellable apart */
export const ICON_COLORS = {
  resident: "#ADC6FF", // primary
  security: "#FFB95F", // amber
  admin: "#6FE3A8", // green
} as const;

/**
 * The brand mark used across generated icons (favicon, apple-touch-icon,
 * PWA manifest icons): a dark tile with a rounded color square, matching
 * the in-app Logo. Kept as one function so every generated size — and
 * every surface's color — stays visually consistent.
 */
export function iconMark(size: number, color: string = ICON_COLORS.resident): ReactElement {
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
          background: color,
        }}
      />
    </div>
  );
}
