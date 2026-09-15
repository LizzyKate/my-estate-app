import { ImageResponse } from "next/og";
import { iconMark } from "@/lib/icon-mark";

const size = { width: 512, height: 512 };

export async function GET() {
  return new ImageResponse(iconMark(size.width), size);
}
