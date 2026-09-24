import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/landing/brand";
import { Icon } from "@/components/ui/icon";
import { RegisterForm } from "@/components/auth/register-form";
import styles from "@/components/auth/auth.module.css";

export const metadata: Metadata = {
  title: "Create your account — TaskFlow",
  description: "Make room for a calmer, more organized day. Create your TaskFlow account.",
};

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" aria-label="TaskFlow home"><Brand /></Link>
        <Link href="/" className={styles.backLink}>Back to home <span aria-hidden="true">↗</span></Link>
      </header>
      <main className={styles.main}>
        <aside className={styles.story}>
          <span className={styles.eyebrow}>A FRESH START, A LITTLE MORE FLOW</span>
          <h1>Big plans.<br />Small steps.<br /><em>Your space.</em></h1>
          <p>A calmer place for everything on your mind.<br />Start making room for what matters.</p>
          <div className={styles.note}>
            <div className={styles.noteHeading}><Icon name="sun" /><span>A little intention for today</span></div>
            <div className={styles.noteTask}><span className={styles.checked}><Icon name="check" /></span>Make a little space for myself</div>
            <div className={styles.noteTask}><span className={styles.checkbox} />Take the first small step</div>
            <div className={styles.noteFooter}>Progress starts right here.<Icon name="spark" /></div>
          </div>
          <div className={styles.storyFooter}><Icon name="check" /> Your pace. Your plans. Your possibilities.</div>
        </aside>
        <section className={styles.formPanel} aria-labelledby="register-title">
          <span className={styles.formEyebrow}>WELCOME TO TASKFLOW</span>
          <h2 id="register-title">Make yourself at home.</h2>
          <p className={styles.intro}>Create an account. Give your day a little direction.</p>
          <RegisterForm />
          <p className={styles.loginPrompt}>Already have an account? <Link href="/login">Log in</Link></p>
        </section>
      </main>
      <footer className={styles.footer}>A little less chaos. A little more flow.</footer>
    </div>
  );
}
