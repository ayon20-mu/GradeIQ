// app/login/page.tsx
import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — GradeIQ",
  description: "Sign in to your GradeIQ account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
