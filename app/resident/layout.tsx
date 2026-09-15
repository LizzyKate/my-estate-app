import type { Metadata } from "next";

export const metadata: Metadata = {
  manifest: "/resident-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "MyEstate",
    statusBarStyle: "black-translucent",
  },
};

export default function ResidentLayout({ children }: LayoutProps<"/resident">) {
  return children;
}
