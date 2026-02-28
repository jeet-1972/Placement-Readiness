import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import {
  countPassed,
  isComplete,
  readChecklistState,
  type PrpChecklistState,
} from "../../../prp/testChecklist";
import styles from "./PrpShipPage.module.css";

export function PrpShipPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<PrpChecklistState>(() => readChecklistState());

  useEffect(() => {
    setState(readChecklistState());
  }, []);

  const passed = useMemo(() => countPassed(state), [state]);
  const complete = useMemo(() => isComplete(state), [state]);

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <div className={styles.pillRow}>
          <h3 className={styles.title}>Ship</h3>
          <span className={styles.pill}>
            {complete ? "Unlocked" : "Locked"} • {passed}/10
          </span>
        </div>

        {!complete ? (
          <>
            <p className={styles.text} role="alert">
              Fix issues before shipping.
            </p>
            <p className={styles.text}>
              Complete the built-in tests to unlock shipping.
            </p>
            <div className={styles.actions}>
              <Button type="button" onClick={() => navigate("/prp/07-test")}>
                Go to test checklist
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.text}>
              All tests are checked. You can ship with confidence.
            </p>
            <div className={styles.actions}>
              <Button variant="secondary" type="button" onClick={() => navigate("/prp/07-test")}>
                Review checklist
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

