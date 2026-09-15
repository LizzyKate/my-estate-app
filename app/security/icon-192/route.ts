import { ImageResponse } from "next/og";
import { iconMark, ICON_COLORS } from "@/lib/icon-mark";

const size = { width: 192, height: 192 };

export async function GET() {
  return new ImageResponse(iconMark(size.width, ICON_COLORS.security), size);
}
