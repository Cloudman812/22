import styles from "./ProgressBar.module.css";
import { QUEST_STEP_COUNT } from "../state/questStorage";

type Props = {
  introDone: boolean;
  completedThrough: number;
};

export function ProgressBar({ introDone, completedThrough }: Props) {
  const nextIdx = completedThrough + 1;
  const label = !introDone
    ? "После ввода начнётся шаг 1"
    : completedThrough >= QUEST_STEP_COUNT
      ? "Маршрут завершён"
      : `Шаг ${nextIdx} из ${QUEST_STEP_COUNT}`;

  const row = Array.from({ length: QUEST_STEP_COUNT }, (_, i) => i + 1);

  const segClass = (n: number) => {
    let cls = styles.seg;
    if (introDone) {
      if (n <= completedThrough) cls += ` ${styles.segOn}`;
      else if (n === nextIdx && completedThrough < QUEST_STEP_COUNT)
        cls += ` ${styles.segNext}`;
    }
    return cls;
  };

  return (
    <section className={`${styles.wrap} l-glass`} aria-label="Прогресс квеста">
      <div className={styles.head}>
        <span className={styles.labelSmall}>Прогресс</span>
        <strong className={styles.labelMain}>{label}</strong>
      </div>
      <div className={styles.grid} aria-hidden="true">
        {row.map((n) => (
          <span key={n} className={segClass(n)} />
        ))}
      </div>
      <div className={styles.hintRow}>
        <span>
          1 — {QUEST_STEP_COUNT}
        </span>
      </div>
    </section>
  );
}
