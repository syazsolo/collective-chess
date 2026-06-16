import styles from "./move-navigation.module.css";

type MoveNavigationProps = {
  canMoveBack: boolean;
  canMoveForward: boolean;
  currentPly: number;
  lastPly: number;
  onBack: () => void;
  onForward: () => void;
};

export function MoveNavigation({
  canMoveBack,
  canMoveForward,
  currentPly,
  lastPly,
  onBack,
  onForward,
}: MoveNavigationProps) {
  return (
    <nav className={styles.navigation} aria-label="Move navigation">
      <button
        aria-label="Show previous move"
        className={styles.button}
        disabled={!canMoveBack}
        onClick={onBack}
        title="Back"
        type="button"
      >
        <span aria-hidden="true" className={styles.icon}>
          &larr;
        </span>
        <span>Back</span>
      </button>
      <span className={styles.status} aria-live="polite">
        Move {currentPly} / {lastPly}
      </span>
      <button
        aria-label="Show next move"
        className={styles.button}
        disabled={!canMoveForward}
        onClick={onForward}
        title="Forward"
        type="button"
      >
        <span>Forward</span>
        <span aria-hidden="true" className={styles.icon}>
          &rarr;
        </span>
      </button>
    </nav>
  );
}
