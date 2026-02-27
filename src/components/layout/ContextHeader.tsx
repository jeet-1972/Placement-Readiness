import styles from "./ContextHeader.module.css";

interface ContextHeaderProps {
  headline: string;
  subtext?: string;
}

export function ContextHeader({ headline, subtext }: ContextHeaderProps) {
  return (
    <div className={styles.contextHeader}>
      <h1 className={styles.headline}>{headline}</h1>
      {subtext && <p className={styles.subtext}>{subtext}</p>}
    </div>
  );
}
