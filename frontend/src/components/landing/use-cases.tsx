import styles from "./landing.module.css";
import { Icon } from "@/components/ui/icon";

export function UseCases() {
  return (
    <div className={styles.manifesto}>
      <div className={styles.manifestoIntro}>
        <span>FOR EVERYTHING ON YOUR MIND</span>
        <p>One space. Every part of your day.</p>
      </div>
      <ul className={styles.categories} aria-label="Ways to use TaskFlow">
        <li>
          <Icon name="grid" /> Work projects</li>
        <li>
          <Icon name="sun" /> Daily routines</li>
        <li>
          <Icon name="flag" /> Personal goals</li>
        <li>
          <Icon name="spark" /> Your next big thing</li>
      </ul>
    </div>
  );
}
