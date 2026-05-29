// app/signup/page.tsx
import type { Metadata } from "next";
import { SignupForm } from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Create Account — GradeIQ",
  description: "Create your free GradeIQ account.",
};

export default function SignupPage() {
  return <SignupForm />;
}
