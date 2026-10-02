import type { Metadata } from "next";
import { Anton, Karla, Caveat } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PreOrder Kasi",
  description:
    "Order ahead for a specific time. Sellers plan production. Customers get food when they need it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${karla.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
