import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PreOrder Kasi",
  description: "Order ahead for a specific time. Sellers plan production. Customers get food when they need it.",
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
