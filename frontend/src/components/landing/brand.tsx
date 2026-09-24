import styles from "./landing.module.css";
import { Icon } from "@/components/ui/icon";

export function Brand() {
  return <span className={styles.brand}>
    <span className={styles.brandMark}>
      <Icon name="check" />
    </span>taskflow<span className={styles.brandDot}>.</span>
  </span>;
}
