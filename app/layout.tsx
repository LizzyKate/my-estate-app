import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { StoreHydration } from "@/components/store-hydration";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "MyEstate",
  description:
    "Know exactly who is at your gate — and who let them in.",
};

export const viewport: Viewport = {
  themeColor: "#080b12",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-bg font-sans text-text antialiased">
        <StoreHydration />
        {children}
      </body>
    </html>
  );
}
