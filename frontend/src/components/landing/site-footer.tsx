import styles from "./landing.module.css";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <a href="#" aria-label="TaskFlow home">
        <Brand />
      </a>
      <p>A little less chaos. A little more flow.</p>
      <span>© {new Date().getFullYear()} TaskFlow</span>
    </footer>
  );
}
