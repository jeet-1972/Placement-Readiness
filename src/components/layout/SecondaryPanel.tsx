import { type ReactNode } from "react";
import { Button } from "../ui/Button";
import styles from "./SecondaryPanel.module.css";

interface SecondaryPanelProps {
  stepExplanation?: string;
  promptText?: string;
  children?: ReactNode;
}

export function SecondaryPanel({
  stepExplanation,
  promptText,
  children,
}: SecondaryPanelProps) {
  return (
    <aside className={styles.panel} role="complementary">
      {stepExplanation && (
        <p className={styles.explanation}>{stepExplanation}</p>
      )}
      {promptText && (
        <div className={styles.promptBox}>
          <pre className={styles.promptText}>{promptText}</pre>
          <div className={styles.actions}>
            <Button variant="primary">Copy</Button>
            <Button variant="primary">Build in Lovable</Button>
            <Button variant="secondary">It Worked</Button>
            <Button variant="secondary">Error</Button>
            <Button variant="secondary">Add Screenshot</Button>
          </div>
        </div>
      )}
      {children}
    </aside>
  );
}
