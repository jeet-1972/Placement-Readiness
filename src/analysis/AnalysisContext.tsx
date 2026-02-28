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
  type AnalysisEntry,
  type SkillConfidence,
  withDefaultConfidence,
} from "./analysisEngine";

interface AnalysisContextValue {
  latestEntry: AnalysisEntry | null;
  history: AnalysisEntry[];
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

const STORAGE_KEY = "placement-readiness-history-v1";

function readHistoryFromStorage(): AnalysisEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AnalysisEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((entry) => withDefaultConfidence(entry));
  } catch {
    return [];
  }
}

function writeHistoryToStorage(history: AnalysisEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Ignore storage errors (e.g., quota exceeded or disabled storage)
  }
}

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<AnalysisEntry[]>(() =>
    readHistoryFromStorage(),
  );
  const [latestEntry, setLatestEntry] = useState<AnalysisEntry | null>(() =>
    history.length > 0 ? history[0] : null,
  );

  useEffect(() => {
    writeHistoryToStorage(history);
  }, [history]);

  const value = useMemo<AnalysisContextValue>(
    () => ({
      latestEntry,
      history,
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
        setHistory((prev) =>
          prev.map((entry) => {
            if (entry.id !== entryId) return entry;
            const updated: AnalysisEntry = {
              ...entry,
              skillConfidenceMap: {
                ...(entry.skillConfidenceMap ?? {}),
                [skill]: state,
              },
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
          };
          return withDefaultConfidence(updated);
        });
      },
      clearHistory: () => {
        setHistory([]);
        setLatestEntry(null);
      },
    }),
    [history, latestEntry],
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

