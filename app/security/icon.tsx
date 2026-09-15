import { ImageResponse } from "next/og";
import { iconMark, ICON_COLORS } from "@/lib/icon-mark";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(iconMark(size.width, ICON_COLORS.security), size);
}
