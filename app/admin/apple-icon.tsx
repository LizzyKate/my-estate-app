import { ImageResponse } from "next/og";
import { iconMark, ICON_COLORS } from "@/lib/icon-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(iconMark(size.width, ICON_COLORS.admin), size);
}
