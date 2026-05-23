import type { Metadata } from "next";
import { NeededGPACalculator } from "@/components/NeededGPACalculator";

export const metadata: Metadata = {
  title: "Goal GPA Calculator — What GPA Do I Need?",
  description:
    "Find out what GPA you need in your remaining semesters to achieve your target CGPA. Plan your academic path with precision.",
};

export default function NeededPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-navy mb-2">Goal GPA Calculator</h1>
        <p className="text-slate-500">
          Enter your current CGPA and remaining semesters to predict your final cumulative GPA.
        </p>
      </div>
      <NeededGPACalculator />
    </div>
  );
}
