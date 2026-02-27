import styles from "./TopBar.module.css";

type StepStatus = "Not Started" | "In Progress" | "Shipped";

interface TopBarProps {
  projectName: string;
  currentStep: number;
  totalSteps: number;
  status: StepStatus;
}

export function TopBar({ projectName, currentStep, totalSteps, status }: TopBarProps) {
  return (
    <header className={styles.topBar} role="banner">
      <div className={styles.left}>{projectName}</div>
      <div className={styles.center}>
        Step {currentStep} / {totalSteps}
      </div>
      <div className={styles.right}>
        <span className={styles.badge} data-status={status}>
          {status}
        </span>
      </div>
    </header>
  );
}
