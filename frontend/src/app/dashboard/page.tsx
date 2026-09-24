import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/landing/brand";
import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentUser } from "@/lib/auth-server";
import styles from "@/components/auth/auth.module.css";

export const metadata: Metadata = { title: "Your dashboard — TaskFlow" };

export default async function DashboardPage() {
  let user;
  try {
    user = await getCurrentUser();
  } catch {
    return (
      <main className={styles.loginMain}>
        <section className={styles.loginCard}>
          <h1>Unable to load your dashboard</h1>
          <p className={styles.intro}>We could not check your session. Please try again shortly.</p>
          <a href="/dashboard" className={styles.backLink}>Try again</a>
        </section>
      </main>
    );
  }
  if (!user) redirect("/login");

  return (
    <div className={styles.page}>
      <header className={styles.loginHeader}>
        <Link href="/" aria-label="TaskFlow home"><Brand /></Link>
        <LogoutButton />
      </header>
      <main className={styles.dashboard}>
        <span className={styles.formEyebrow}>YOUR WORKSPACE</span>
        <h1>Welcome, {user.name}.</h1>
        <p>You’re signed in. A little more flow starts here.</p>
      </main>
    </div>
  );
}
