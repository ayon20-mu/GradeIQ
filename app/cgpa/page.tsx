import type { Metadata } from "next";
import { CGPACalculator } from "@/components/CGPACalculator";

export const metadata: Metadata = {
  title: "CGPA Calculator",
  description:
    "Calculate your cumulative GPA across all university semesters. Add multiple semesters, track semester-wise GPA, and see your final CGPA.",
};

export default function CGPAPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-navy mb-2">CGPA Calculator</h1>
        <p className="text-slate-500">
          Track your cumulative GPA across all semesters. Add courses to each semester for real-time GPA and CGPA.
        </p>
      </div>
      <CGPACalculator />
    </div>
  );
}
