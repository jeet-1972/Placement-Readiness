import styles from "./ProofFooter.module.css";

const CHECKLIST_ITEMS = [
  { id: "ui", label: "UI Built" },
  { id: "logic", label: "Logic Working" },
  { id: "test", label: "Test Passed" },
  { id: "deployed", label: "Deployed" },
] as const;

export function ProofFooter() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.checklist}>
        {CHECKLIST_ITEMS.map((item) => (
          <label key={item.id} className={styles.item}>
            <input
              type="checkbox"
              name={item.id}
              className={styles.checkbox}
              aria-label={item.label}
            />
            <span className={styles.label}>{item.label}</span>
          </label>
        ))}
      </div>
    </footer>
  );
}
