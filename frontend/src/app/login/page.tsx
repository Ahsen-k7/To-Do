import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/landing/brand";
import { LoginForm } from "@/components/auth/login-form";
import styles from "@/components/auth/auth.module.css";

export const metadata: Metadata = {
  title: "Welcome back — TaskFlow",
  description: "Return to your space and pick up where you left off with TaskFlow.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ registered?: string }> }) {
  const { registered } = await searchParams;
  return (
    <div className={styles.page}>
      <header className={styles.loginHeader}>
        <Link href="/" aria-label="TaskFlow home"><Brand /></Link>
        <Link href="/" className={styles.backLink}>Back to home <span aria-hidden="true">↗</span></Link>
      </header>
      <main className={styles.loginMain}>
        <section className={styles.loginCard} aria-labelledby="login-title">
          <h1 id="login-title">Welcome back.</h1>
          <p className={styles.intro}>Log in to your TaskFlow account.</p>
          {registered === "1" && <p className={styles.success} role="status">Account created. Log in to get started.</p>}
          <LoginForm />
          <p className={styles.loginPrompt}>New to TaskFlow? <Link href="/register">Create an account</Link></p>
        </section>
      </main>
    </div>
  );
}
