import type { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, GraduationCap, Target, CheckCircle2, Zap, Shield } from "lucide-react";
import { HomeClient } from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "GradeIQ — Smart GPA & CGPA Calculator for Students",
  description:
    "Calculate your semester GPA, cumulative CGPA, and find out what GPA you need to reach your academic goal. Free, fast, and accurate.",
};

export default function HomePage() {
  return <HomeClient />;
}
