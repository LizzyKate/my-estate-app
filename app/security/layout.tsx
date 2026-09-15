import type { Metadata } from "next";

export const metadata: Metadata = {
  manifest: "/security-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "MyEstate Gate",
    statusBarStyle: "black-translucent",
  },
};

export default function SecurityLayout({ children }: LayoutProps<"/security">) {
  return children;
}
