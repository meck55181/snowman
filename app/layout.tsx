import type { Metadata } from "next";
import "./globals.css";
import ScrollRestoration from "./ScrollRestoration";

export const metadata: Metadata = {
  title: "Snowman Board",
  description: "Share and browse notes with your community."
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