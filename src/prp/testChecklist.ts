export type PrpTestId =
  | "jd-required"
  | "short-jd-warning"
  | "skills-grouping"
  | "round-mapping-dynamic"
  | "score-deterministic"
  | "toggles-live-score"
  | "persist-refresh"
  | "history-save-load"
  | "exports-correct"
  | "no-console-errors";

export interface PrpTestItem {
  id: PrpTestId;
  label: string;
  hint?: string;
}

export interface PrpChecklistState {
  checked: Record<PrpTestId, boolean>;
  updatedAt: string;
}

const STORAGE_KEY = "prp-test-checklist-v1";

export const PRP_TESTS: PrpTestItem[] = [
  {
    id: "jd-required",
    label: "JD required validation works",
    hint: "Leave JD empty → Analyze stays disabled / required triggers.",
  },
  {
    id: "short-jd-warning",
    label: "Short JD warning shows for <200 chars",
    hint: "Paste a short JD (e.g. 50 chars) → warning appears under textarea.",
  },
  {
    id: "skills-grouping",
    label: "Skills extraction groups correctly",
    hint: "Use a JD containing React, SQL, AWS, DSA and confirm categories/tags.",
  },
  {
    id: "round-mapping-dynamic",
    label: "Round mapping changes based on company + skills",
    hint: "Compare Infosys + DSA vs unknown startup + React/Node.",
  },
  {
    id: "score-deterministic",
    label: "Score calculation is deterministic",
    hint: "Analyze the same JD twice → base score remains same; toggles adjust predictably.",
  },
  {
    id: "toggles-live-score",
    label: "Skill toggles update score live",
    hint: "Toggle a skill pill → score changes immediately by ±2 per skill.",
  },
  {
    id: "persist-refresh",
    label: "Changes persist after refresh",
    hint: "Toggle a few skills, refresh the page → states and score remain.",
  },
  {
    id: "history-save-load",
    label: "History saves and loads correctly",
    hint: "Create two analyses → select each from History and confirm data restores.",
  },
  {
    id: "exports-correct",
    label: "Export buttons copy the correct content",
    hint: "Use Copy buttons and paste into Notepad; Download TXT contains all sections.",
  },
  {
    id: "no-console-errors",
    label: "No console errors on core pages",
    hint: "Open DevTools console on /, /dashboard/assessments, /prp/07-test, /prp/08-ship.",
  },
];

function nowIso(): string {
  return new Date().toISOString();
}

export function buildDefaultState(): PrpChecklistState {
  const checked = {} as Record<PrpTestId, boolean>;
  for (const test of PRP_TESTS) checked[test.id] = false;
  return { checked, updatedAt: nowIso() };
}

function isPlainObject(o: unknown): o is Record<string, unknown> {
  return o !== null && typeof o === "object" && !Array.isArray(o);
}

export function readChecklistState(): PrpChecklistState {
  if (typeof window === "undefined") return buildDefaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildDefaultState();
    const parsed = JSON.parse(raw) as unknown;
    if (!isPlainObject(parsed)) return buildDefaultState();
    const checkedRaw = parsed.checked;
    const updatedAtRaw = parsed.updatedAt;

    const base = buildDefaultState();
    const checked =
      isPlainObject(checkedRaw) ? (checkedRaw as Record<string, unknown>) : {};
    for (const test of PRP_TESTS) {
      const v = checked[test.id];
      base.checked[test.id] = v === true;
    }
    base.updatedAt = typeof updatedAtRaw === "string" ? updatedAtRaw : base.updatedAt;
    return base;
  } catch {
    return buildDefaultState();
  }
}

export function writeChecklistState(state: PrpChecklistState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage write issues
  }
}

export function setTestChecked(id: PrpTestId, value: boolean) {
  const state = readChecklistState();
  const next: PrpChecklistState = {
    checked: { ...state.checked, [id]: value },
    updatedAt: nowIso(),
  };
  writeChecklistState(next);
  return next;
}

export function resetChecklist() {
  const next = buildDefaultState();
  writeChecklistState(next);
  return next;
}

export function countPassed(state: PrpChecklistState): number {
  return PRP_TESTS.reduce((acc, t) => acc + (state.checked[t.id] ? 1 : 0), 0);
}

export function isComplete(state: PrpChecklistState): boolean {
  return countPassed(state) === PRP_TESTS.length;
}

