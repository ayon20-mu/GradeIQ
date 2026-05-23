import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: {
    default: "GradeIQ — Smart GPA & CGPA Calculator",
    template: "%s | GradeIQ",
  },
  description:
    "Free modern GPA, CGPA, and Goal GPA calculator for university students. Calculate your semester GPA and cumulative GPA accurately in seconds.",
  keywords: [
    "GPA calculator",
    "CGPA calculator",
    "university GPA tool",
    "semester GPA",
    "cumulative GPA",
    "grade calculator",
    "student GPA tracker",
  ],
  openGraph: {
    title: "GradeIQ — Smart GPA & CGPA Calculator",
    description:
      "Modern GPA and CGPA calculators for university students. Fast, free, and beautifully simple.",
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen flex flex-col bg-mint">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
