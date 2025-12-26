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
  openGraph: {
    title: "2025 연말결산",
    description: "연말결산 같이해요",
    images: [
      {
        url: '/opengraph-image.png', // 또는 '/og-image.png' 등 원하는 경로
        width: 1200,
        height: 630,
        alt: '2025 연말결산',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "2025 연말결산",
    description: "연말결산 같이해요",
    images: ['/opengraph-image.png'],
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