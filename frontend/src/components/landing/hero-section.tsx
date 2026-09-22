import styles from "./landing.module.css";
import { Icon } from "@/components/ui/icon";
import { TaskPreview } from "./task-preview";
import { Button } from "./button";

export function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroCopy}>
        <div className={styles.eyebrow}>
          <span /> A LITTLE ORDER. A LOT MORE POSSIBILITY.</div>
        <h1 id="hero-title">Less scattered.<br />More <span>in flow.<svg viewBox="0 0 280 20" fill="none" aria-hidden="true">
          <path d="M3 13C60 2 171 1 276 8M17 18c91-9 180-9 242-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        </span>
        </h1>
        <p className={styles.heroDescription}>Big plans or everyday little things. Bring it all together in one calm space, and make progress at your own pace.</p>
        <div className={styles.heroActions}>
          <Button size="large" arrow>Get started</Button>
          <a href="#preview" className={styles.textLink}>Take a look around <span>&#8599;</span>
          </a>
        </div>
        <div className={styles.heroFootnote}>
          <span>
            <Icon name="check" /> A clearer head</span>
          <span>
            <Icon name="check" /> A simpler day</span>
          <span>
            <Icon name="check" /> Your own pace</span>
        </div>
      </div>
      <TaskPreview />
    </section>
  );
}
