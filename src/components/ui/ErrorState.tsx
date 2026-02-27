import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  title: string;
  description: string;
  remedy?: string;
}

export function ErrorState({ title, description, remedy }: ErrorStateProps) {
  return (
    <div className={styles.wrapper} role="alert">
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
      {remedy && <p className={styles.remedy}>{remedy}</p>}
    </div>
  );
}
