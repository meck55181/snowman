import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}

