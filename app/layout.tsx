import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoobToFit — Progressive Overload Tracker",
  description: "Log every set. Watch the plates stack up.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
