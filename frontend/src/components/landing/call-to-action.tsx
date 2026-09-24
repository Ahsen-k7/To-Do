import styles from "./landing.module.css";
import { Button } from "./button";

export function CallToAction() {
  return (
    <section className={styles.finalCta} aria-labelledby="cta-title">
      <span className={styles.ctaSpark}>&#10022;</span>
      <p className={styles.sectionEyebrow}>ONE SMALL STEP STARTS IT ALL</p>
      <h2 id="cta-title">Make room for a better day.</h2>
      <p>Your tasks, your goals, your little victories. All in one place.</p>
      <Button href="/register" variant="light" arrow>Register for TaskFlow</Button>
      <span className={styles.ctaDecoration} aria-hidden="true">&#10022;</span>
    </section>
  );
}
