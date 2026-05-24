import type { Metadata } from "next";
import { GPACalculator } from "@/components/GPACalculator";

export const metadata: Metadata = {
  title: "Semester GPA Calculator",
  description:
    "Calculate your semester GPA instantly. Enter your courses, grade points, and credit hours for real-time results.",
};

export default function GPAPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-2">Semester GPA Calculator</h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Enter your courses, grade points (0–4.00), and credit hours to calculate your semester GPA.
        </p>
      </div>
      <GPACalculator />
    </div>
  );
}
