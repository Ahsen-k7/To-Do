import styles from "./landing.module.css";
import { Icon } from "@/components/ui/icon";

export function FeaturesSection() {
  return (
    <section className={styles.features} id="features" aria-labelledby="features-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.sectionEyebrow}>LESS FRICTION, MORE FOCUS</p>
          <h2 id="features-title">A lighter way to get things done.</h2>
        </div>
        <p>Just enough structure to move forward.<br />Enough breathing room to make it yours.</p>
      </div>
      <div className={styles.featureGrid}>
        <article className={styles.feature}>
          <span className={`${styles.featureIcon} ${styles.mint}`}>
            <Icon name="list" />
          </span>
          <h3>Out of your head.<br />Into a plan.</h3>
          <p>Give every idea and to-do a place to land. Start with one small thing, then take it from there.</p>
          <div className={styles.miniList}>
            <span>
              <i /> That thing you keep remembering</span>
            <span>
              <i /> Your next small step</span>
          </div>
        </article>
        <article className={styles.feature}>
          <span className={`${styles.featureIcon} ${styles.peach}`}>
            <Icon name="sun" />
          </span>
          <h3>Find your focus.<br />Keep your rhythm.</h3>
          <p>A little clarity goes a long way. Bring your attention back to the things that matter today.</p>
          <div className={styles.focusPill}>
            <span /> One thing at a time <Icon name="spark" />
          </div>
        </article>
        <article className={styles.feature}>
          <span className={`${styles.featureIcon} ${styles.lavender}`}>
            <Icon name="check" />
          </span>
          <h3>Small wins.<br />Forward motion.</h3>
          <p>Every checked box is a step ahead. Make space to notice your progress, however small.</p>
          <div className={styles.miniProgress}>
            <span>
              <Icon name="check" />
            </span>
            <span>
              <Icon name="check" />
            </span>
            <span>
              <Icon name="check" />
            </span>
            <span />
            <span />
            <small>Look at you go.</small>
          </div>
        </article>
      </div>
    </section>
  );
}
