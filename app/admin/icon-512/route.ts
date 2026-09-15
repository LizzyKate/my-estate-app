import { ImageResponse } from "next/og";
import { iconMark, ICON_COLORS } from "@/lib/icon-mark";

const size = { width: 512, height: 512 };

export async function GET() {
  return new ImageResponse(iconMark(size.width, ICON_COLORS.admin), size);
}
