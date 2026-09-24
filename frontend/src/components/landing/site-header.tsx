import styles from "./landing.module.css";
import { Brand } from "./brand";
import { Button } from "./button";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <a href="#" aria-label="TaskFlow home">
        <Brand />
      </a>
      <nav aria-label="Main navigation" className={styles.navigation}>
        <a href="#features">Why TaskFlow</a>
        <a href="#how-it-works">How it works</a>
      </nav>
      <div className={styles.headerActions}>
        <Button variant="text">Log in</Button>
        <Button href="/register" arrow>Register</Button>
      </div>
    </header>
  );
}
