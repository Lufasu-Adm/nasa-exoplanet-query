import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joo-Terminal | NASA Query",
  description: "Exoplanet Habitability Analysis",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning mengatasi error dari ekstensi browser
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}