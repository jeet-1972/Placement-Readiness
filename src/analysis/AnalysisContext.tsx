import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  analyzeJD,
  ensureCompanyIntelAndRoundMapping,
  type AnalysisEntry,
  type SkillConfidence,
  withDefaultConfidence,
} from "./analysisEngine";
import { fromStrictEntry, toStrictEntry } from "./analysisSchema";

interface AnalysisContextValue {
  latestEntry: AnalysisEntry | null;
  history: AnalysisEntry[];
  /** Number of entries skipped due to corruption when loading from storage. */
  skippedCorruptedCount: number;
  analyze: (input: {
    company: string;
    role: string;
    jdText: string;
  }) => AnalysisEntry;
  selectFromHistory: (id: string) => void;
  updateSkillConfidence: (
    entryId: string,
    skill: string,
    state: SkillConfidence,
  ) => void;
  clearHistory: () => void;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "placement-readiness-history-v2";
const STORAGE_KEY_V1 = "placement-readiness-history-v1";

function readHistoryFromStorage(): {
  entries: AnalysisEntry[];
  skippedCorruptedCount: number;
} {
  if (typeof window === "undefined") return { entries: [], skippedCorruptedCount: 0 };
  try {
    let raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const v1Raw = window.localStorage.getItem(STORAGE_KEY_V1);
      if (v1Raw) {
        try {
          const v1Parsed = JSON.parse(v1Raw) as unknown[];
          if (Array.isArray(v1Parsed) && v1Parsed.length > 0) {
            const migrated: AnalysisEntry[] = [];
            for (const item of v1Parsed) {
              try {
                const entry = item as AnalysisEntry;
                if (entry?.id && typeof entry.jdText === "string") {
                  migrated.push(
                    ensureCompanyIntelAndRoundMapping(withDefaultConfidence(entry)),
                  );
                }
              } catch {
                // skip corrupted v1 entry
              }
            }
            if (migrated.length > 0) {
              try {
                const strict = migrated.map(toStrictEntry);
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(strict));
                window.localStorage.removeItem(STORAGE_KEY_V1);
              } catch {
                // ignore write failure
              }
            }
            return { entries: migrated, skippedCorruptedCount: 0 };
          }
        } catch {
          // ignore v1 parse failure
        }
      }
      return { entries: [], skippedCorruptedCount: 0 };
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return { entries: [], skippedCorruptedCount: 0 };
    let skipped = 0;
    const entries: AnalysisEntry[] = [];
    for (const item of parsed) {
      const entry = fromStrictEntry(item);
      if (entry == null) {
        skipped += 1;
        continue;
      }
      entries.push(
        ensureCompanyIntelAndRoundMapping(withDefaultConfidence(entry)),
      );
    }
    return { entries, skippedCorruptedCount: skipped };
  } catch {
    return { entries: [], skippedCorruptedCount: 0 };
  }
}

function writeHistoryToStorage(history: AnalysisEntry[]) {
  if (typeof window === "undefined") return;
  try {
    const strict = history.map(toStrictEntry);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(strict));
  } catch {
    // Ignore storage errors (e.g., quota exceeded or disabled storage)
  }
}

const initial = readHistoryFromStorage();

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<AnalysisEntry[]>(() => initial.entries);
  const [latestEntry, setLatestEntry] = useState<AnalysisEntry | null>(() =>
    initial.entries.length > 0 ? initial.entries[0] : null,
  );
  const [skippedCorruptedCount] = useState<number>(() => initial.skippedCorruptedCount);

  useEffect(() => {
    writeHistoryToStorage(history);
  }, [history]);

  const value = useMemo<AnalysisContextValue>(
    () => ({
      latestEntry,
      history,
      skippedCorruptedCount,
      analyze: ({ company, role, jdText }) => {
        const entry = analyzeJD({ company, role, jdText });
        setHistory((prev) => [entry, ...prev]);
        setLatestEntry(entry);
        return entry;
      },
      selectFromHistory: (id: string) => {
        setLatestEntry((prev) => {
          const found = history.find((entry) => entry.id === id);
          return found ?? prev;
        });
      },
      updateSkillConfidence: (entryId, skill, state) => {
        const now = new Date().toISOString();
        setHistory((prev) =>
          prev.map((entry) => {
            if (entry.id !== entryId) return entry;
            const updated: AnalysisEntry = {
              ...entry,
              skillConfidenceMap: {
                ...(entry.skillConfidenceMap ?? {}),
                [skill]: state,
              },
              updatedAt: now,
            };
            return withDefaultConfidence(updated);
          }),
        );

        setLatestEntry((prev) => {
          if (!prev || prev.id !== entryId) return prev;
          const updated: AnalysisEntry = {
            ...prev,
            skillConfidenceMap: {
              ...(prev.skillConfidenceMap ?? {}),
              [skill]: state,
            },
            updatedAt: now,
          };
          return withDefaultConfidence(updated);
        });
      },
      clearHistory: () => {
        setHistory([]);
        setLatestEntry(null);
      },
    }),
    [history, latestEntry, skippedCorruptedCount],
  );

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return ctx;
}

