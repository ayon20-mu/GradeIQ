import type { Metadata } from "next";
import { DashboardClient } from "@/components/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard — GradeIQ",
  description: "Your personal student result tracker. Track CGPA, semester GPAs, and progress toward your target grade.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
