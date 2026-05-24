import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-teal-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center">
              <GraduationCap size={15} className="text-white" />
            </div>
            <span className="font-serif text-lg text-navy">GradeIQ</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
            <Link href="/gpa" className="hover:text-teal-600 transition-colors">GPA Calculator</Link>
            <Link href="/cgpa" className="hover:text-teal-600 transition-colors">CGPA Calculator</Link>
            <Link href="/needed" className="hover:text-teal-600 transition-colors">Goal GPA</Link>
            <Link href="/privacy-policy" className="hover:text-teal-600 transition-colors">Privacy Policy</Link>
          </nav>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} GradeIQ. Built for students. gradeiq25@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
}
