import { ImageResponse } from "next/og";
import { iconMark } from "@/lib/icon-mark";

const size = { width: 192, height: 192 };

export async function GET() {
  return new ImageResponse(iconMark(size.width), size);
}
