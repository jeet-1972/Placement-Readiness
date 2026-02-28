import { useEffect, useMemo, useState } from "react";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import {
  PRP_TESTS,
  countPassed,
  isComplete,
  readChecklistState,
  resetChecklist,
  setTestChecked,
  type PrpChecklistState,
  type PrpTestId,
} from "../../../prp/testChecklist";
import styles from "./PrpTestChecklistPage.module.css";

export function PrpTestChecklistPage() {
  const [state, setState] = useState<PrpChecklistState>(() => readChecklistState());

  useEffect(() => {
    setState(readChecklistState());
  }, []);

  const passed = useMemo(() => countPassed(state), [state]);
  const complete = useMemo(() => isComplete(state), [state]);

  const handleToggle = (id: PrpTestId, next: boolean) => {
    setState(setTestChecked(id, next));
  };

  const handleReset = () => {
    setState(resetChecklist());
  };

  return (
    <div className={styles.page}>
      <Card className={styles.summaryCard}>
        <div className={styles.summaryRow}>
          <h3 className={styles.summaryTitle}>Tests Passed: {passed} / 10</h3>
          <span className={styles.summaryPill}>{complete ? "Ready" : "Blocked"}</span>
        </div>
        {!complete && (
          <p className={styles.warning} role="alert">
            Fix issues before shipping.
          </p>
        )}
        <div className={styles.actionsRow}>
          <Button variant="secondary" type="button" onClick={handleReset}>
            Reset checklist
          </Button>
        </div>
      </Card>

      <Card className={styles.listCard}>
        <h3 className={styles.listTitle}>Built-in Test Checklist</h3>
        <ul className={styles.list}>
          {PRP_TESTS.map((t) => (
            <li key={t.id} className={styles.item}>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={state.checked[t.id]}
                onChange={(e) => handleToggle(t.id, e.target.checked)}
                aria-label={t.label}
              />
              <div className={styles.itemBody}>
                <div className={styles.itemLabel}>□ {t.label}</div>
                {t.hint && <p className={styles.hint}>How to test: {t.hint}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

