import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";

// Bypassing Google Fonts to fix Turbopack crash
// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// const rajdhani = Rajdhani({ ... });

export const metadata: Metadata = {
  title: "Nexteach",
  description: "High-End Digital Solutions & 3D Experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-white bg-black font-sans">
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
