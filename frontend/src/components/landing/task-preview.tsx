import styles from "./landing.module.css";
import { Icon } from "@/components/ui/icon";
import { Brand } from "./brand";

export function TaskPreview() {
  return <div className={styles.previewScene} id="preview">
    <div className={styles.orbit} />
    <div className={styles.preview} aria-label="Illustrative TaskFlow dashboard preview">
      <div className={styles.windowBar}>
        <span className={styles.windowDots}>
          <i />
          <i />
          <i />
        </span>
        <span>YOUR SPACE TO GET THINGS DONE</span>
        <Icon name="grid" />
      </div>
      <div className={styles.previewBody}>
        <aside className={styles.sidebar} aria-label="Preview sidebar">
          <Brand />
          <p className={styles.sidebarLabel}>WORKSPACE</p>
          <div className={styles.sideActive}>
            <Icon name="sun" /> My day <span>4</span>
          </div>
          <div className={styles.sideItem}>
            <Icon name="list" /> All tasks</div>
          <div className={styles.sideItem}>
            <Icon name="calendar" /> Upcoming</div>
          <div className={styles.sideItem}>
            <Icon name="check" /> Completed</div>
          <p className={styles.sidebarLabel}>MY LISTS</p>
          <div className={styles.sideItem}>
            <i className={styles.greenDot} /> Work</div>
          <div className={styles.sideItem}>
            <i className={styles.orangeDot} /> Personal</div>
          <div className={styles.sideItem}>
            <i className={styles.purpleDot} /> Little big ideas</div>
          <div className={styles.profile}>
            <span>JD</span>
            <div>Jamie Davis<small>My workspace</small>
            </div>
          </div>
        </aside>
        <div className={styles.taskArea}>
          <div className={styles.previewEyebrow}>MONDAY, JUNE 16 <Icon name="sun" />
          </div>
          <h2>A little focus.<br />A lot of possibility.</h2>
          <p>Let’s make room for what matters.</p>
          <div className={styles.progressHeading}>
            <span>Your daily progress</span>
            <strong>2 of 6 tasks</strong>
          </div>
          <div className={styles.progressTrack}>
            <span />
          </div>
          <div className={styles.listHeading}>
            <strong>My day <span>4</span>
            </strong>
            <Icon name="plus" />
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskCheckbox} />
            <div>Plan the week ahead<small>
              <i className={styles.greenDot} /> Work <span className={styles.priority}>High priority</span>
            </small>
            </div>
            <Icon name="flag" />
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskCheckbox} />
            <div>Make space for a new idea<small>
              <i className={styles.purpleDot} /> Little big ideas</small>
            </div>
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskCheckbox} />
            <div>Take a screen-free walk<small>
              <i className={styles.orangeDot} /> Personal</small>
            </div>
          </div>
          <div className={`${styles.taskRow} ${styles.completedTask}`}>
            <span className={styles.checked}>
              <Icon name="check" />
            </span>
            <div>Start the day with a clear mind</div>
          </div>
          <div className={styles.addTask}>
            <Icon name="plus" /> A new task, a fresh start</div>
        </div>
      </div>
    </div>
    <div className={styles.floatingNote}>
      <span>
        <Icon name="check" />
      </span>
      <div>Small steps. Real progress.<small>You’re moving in the right direction.</small>
      </div>
      <span className={styles.noteSpark}>&#10022;</span>
    </div>
    <span className={styles.previewCaption}>A little glimpse of a more organized day.</span>
  </div>;
}
