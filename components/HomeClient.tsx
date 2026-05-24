"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  GraduationCap,
  Target,
  CheckCircle2,
  Zap,
  Shield,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";
import { readStore } from "@/lib/store";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const features = [
  {
    icon: BarChart3,
    title: "Semester GPA",
    desc: "Enter your courses, credit hours, and grade points. Get your GPA instantly with real-time updates.",
    href: "/gpa",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: GraduationCap,
    title: "CGPA Calculator",
    desc: "Track your cumulative GPA across all semesters with expandable semester cards.",
    href: "/cgpa",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Target,
    title: "Goal GPA",
    desc: "Know exactly what GPA you need in remaining semesters to hit your target CGPA.",
    href: "/needed",
    color: "bg-purple-50 text-purple-600",
  },
];

const steps = [
  { n: "01", title: "Add your courses", desc: "Enter course names, grade points (0–4.00), and credit hours." },
  { n: "02", title: "Real-time calculation", desc: "Your GPA updates instantly as you type. No submit button needed." },
  { n: "03", title: "Track progress", desc: "Add semesters, set goals, and monitor your cumulative GPA." },
];

const whys = [
  { icon: Zap, title: "Instant results", desc: "No waiting. GPA updates live as you enter data." },
  { icon: Shield, title: "100% accurate", desc: "Standard weighted GPA formula used by universities worldwide." },
  { icon: TrendingUp, title: "Goal tracking", desc: "Plan ahead and see if you're on track for your desired CGPA." },
  { icon: CheckCircle2, title: "Completely free", desc: "No sign-up, no ads, no limits. Just calculate." },
];

export function HomeClient() {
  const [userName, setUserName] = useState("");
  const [semCount, setSemCount] = useState(0);
  const [cgpa, setCgpa] = useState<number | null>(null);

  useEffect(() => {
    const s = readStore();
    setUserName(s.userName);
    setSemCount(s.semesters.length);
    if (s.semesters.length > 0) {
      const totalGP = s.semesters.reduce((acc, sem) => acc + sem.gpa * sem.totalCredits, 0);
      const totalCr = s.semesters.reduce((acc, sem) => acc + sem.totalCredits, 0);
      setCgpa(totalCr > 0 ? totalGP / totalCr : null);
    }
  }, []);

  const isReturning = !!userName;

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-20 pb-24 px-4">
        {/* Soft background blobs */}
        <div
          aria-hidden
          className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-0 w-72 h-72 bg-teal-200 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"
        />

        <div className="max-w-4xl mx-auto text-center relative">

          {/* Returning user banner */}
          {isReturning && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-3 bg-white border border-teal-200 rounded-2xl px-5 py-3 mb-8 shadow-card"
            >
              <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold uppercase flex-shrink-0">
                {userName.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-navy">
                  Welcome back, {userName} 👋
                </p>
                <p className="text-xs text-slate-400">
                  {semCount > 0
                    ? `${semCount} semester${semCount > 1 ? "s" : ""} saved${cgpa !== null ? ` · CGPA ${cgpa.toFixed(2)}` : ""}`
                    : "No semesters saved yet"}
                </p>
              </div>
              <Link
                href="/dashboard"
                className="ml-2 flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-500 text-white text-xs font-semibold rounded-full hover:bg-teal-600 transition-colors whitespace-nowrap"
              >
                <LayoutDashboard size={12} /> Dashboard
              </Link>
            </motion.div>
          )}

          {/* Badge — only for first-time visitors */}
          {!isReturning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
            >
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
              Free GPA Calculator for University Students
            </motion.div>
          )}

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[1.1] text-navy mb-6"
          >
            Track Your GPA{" "}
            <span className="text-teal-500 italic">Smarter</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="text-slate-500 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Modern GPA and CGPA calculators for university students. Fast,
            accurate, and beautifully simple.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {isReturning ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-teal-500 text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-teal-600 transition-all duration-200 shadow-teal hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <LayoutDashboard size={16} /> Go to Dashboard
                </Link>
                <Link
                  href="/cgpa"
                  className="inline-flex items-center gap-2 bg-white text-teal-600 border border-teal-200 px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-teal-50 transition-all duration-200"
                >
                  Add Semester <ArrowRight size={15} />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/gpa"
                  className="inline-flex items-center gap-2 bg-teal-500 text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-teal-600 transition-all duration-200 shadow-teal hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Calculate GPA <ArrowRight size={16} />
                </Link>
                <Link
                  href="/cgpa"
                  className="inline-flex items-center gap-2 bg-white text-teal-600 border border-teal-200 px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-teal-50 transition-all duration-200"
                >
                  Calculate CGPA
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-navy mb-3">
              Everything you need
            </h2>
            <p className="text-slate-500 text-base max-w-md mx-auto">
              Three powerful calculators, all in one place.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link
                  href={f.href}
                  className="group block p-6 bg-white rounded-2xl border border-slate-100 shadow-card hover:border-teal-200 hover:-translate-y-1.5 hover:shadow-soft transition-all duration-250"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}
                  >
                    <f.icon size={22} />
                  </div>
                  <h3 className="font-semibold text-navy text-base mb-2 group-hover:text-teal-600 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-teal-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Open calculator <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-navy mb-3">
              Simple as 1-2-3
            </h2>
            <p className="text-slate-500 text-base max-w-md mx-auto">
              Get your GPA in under a minute.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-8 left-1/6 right-1/6 h-px bg-teal-100" />

            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="text-center relative"
              >
                <div className="w-14 h-14 bg-teal-500 text-white rounded-2xl flex items-center justify-center font-serif text-xl mx-auto mb-4 shadow-teal">
                  {s.n}
                </div>
                <h3 className="font-semibold text-navy mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why students love it */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-navy mb-3">
              Why students love GradeIQ
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {whys.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50"
              >
                <div className="w-10 h-10 bg-teal-50 text-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <w.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy text-sm mb-1">{w.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{w.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-10 text-center text-white shadow-teal"
          >
            <h2 className="font-serif text-3xl sm:text-4xl mb-3">
              Ready to know your GPA?
            </h2>
            <p className="text-teal-100 text-base mb-8 max-w-sm mx-auto">
              It takes less than a minute. No sign-up required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/gpa"
                className="inline-flex items-center gap-2 bg-white text-teal-700 px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-teal-50 transition-all hover:-translate-y-0.5 shadow-lg"
              >
                Calculate GPA <ArrowRight size={16} />
              </Link>
              <Link
                href="/cgpa"
                className="inline-flex items-center gap-2 bg-white/20 text-white border border-white/30 px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-white/30 transition-all"
              >
                Calculate CGPA
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
