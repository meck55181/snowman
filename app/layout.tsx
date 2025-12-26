import type { Metadata } from "next";
import "./globals.css";
import ScrollRestoration from "./ScrollRestoration";

export const metadata: Metadata = {
  title: "2025 연말결산",
  description: "연말결산 같이해요",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ScrollRestoration />
        {children}
      </body>
    </html>
  );
}