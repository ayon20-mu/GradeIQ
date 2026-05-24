"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { readStore } from "@/lib/store";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/gpa", label: "GPA" },
  { href: "/cgpa", label: "CGPA" },
  { href: "/needed", label: "Goal GPA" },
];

export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");

  // Read name from localStorage after mount
  useEffect(() => {
    setUserName(readStore().userName);
    // Re-read on storage events (if user updates name on dashboard)
    const handler = () => setUserName(readStore().userName);
    window.addEventListener("storage", handler);
    // Also poll lightly for same-tab updates
    const interval = setInterval(() => setUserName(readStore().userName), 2000);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-teal-100 shadow-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-teal group-hover:scale-105 transition-transform duration-200">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-serif text-xl text-navy">GradeIQ</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  path === l.href
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:text-teal-600 hover:bg-teal-50"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side: user name pill + CTA */}
          <div className="hidden md:flex items-center gap-3">
            {userName && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold border border-teal-100 hover:bg-teal-100 transition-colors"
              >
                <span className="w-5 h-5 bg-teal-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold uppercase">
                  {userName.charAt(0)}
                </span>
                {userName}
              </Link>
            )}
            <Link
              href="/dashboard"
              className="px-5 py-2 bg-teal-500 text-white rounded-full text-sm font-semibold hover:bg-teal-600 transition-all duration-200 shadow-teal hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-teal-50"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-teal-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {userName && (
                <div className="flex items-center gap-2 px-4 py-2 mb-1 bg-teal-50 rounded-xl">
                  <span className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                    {userName.charAt(0)}
                  </span>
                  <span className="text-sm font-medium text-teal-700">{userName}</span>
                </div>
              )}
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    path === l.href
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
