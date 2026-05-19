// Root layout — sets up HTML, body, and global styles

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecureGate",
  description: "Production-grade authentication system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
