/**
 * Strict persisted schema for history entries.
 * All fields are required when saving; validation normalizes when loading.
 */

import type {
  AnalysisEntry,
  ChecklistRound,
  DayPlan,
  ExtractedSkills,
  RoundMappingItem,
  SkillCategoryId,
  SkillConfidence,
} from "./analysisEngine";

export interface StrictExtractedSkills {
  coreCS: string[];
  languages: string[];
  web: string[];
  data: string[];
  cloud: string[];
  testing: string[];
  other: string[];
}

export interface StrictRoundMappingItem {
  roundTitle: string;
  focusAreas: string[];
  whyItMatters: string;
}

export interface StrictChecklistRound {
  roundTitle: string;
  items: string[];
}

export interface StrictPlanDay {
  day: string;
  focus: string;
  tasks: string[];
}

export interface StrictAnalysisEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: StrictExtractedSkills;
  roundMapping: StrictRoundMappingItem[];
  checklist: StrictChecklistRound[];
  plan7Days: StrictPlanDay[];
  questions: string[];
  baseScore: number;
  skillConfidenceMap: Record<string, SkillConfidence>;
  finalScore: number;
  updatedAt: string;
}

function strictSkillsFromExtracted(ext: ExtractedSkills): StrictExtractedSkills {
  return {
    coreCS: ext.byCategory.coreCS ?? [],
    languages: ext.byCategory.languages ?? [],
    web: ext.byCategory.web ?? [],
    data: ext.byCategory.data ?? [],
    cloud: ext.byCategory.cloudDevops ?? [],
    testing: ext.byCategory.testing ?? [],
    other: (ext.byCategory as Record<string, string[]>).other ?? [],
  };
}

function extractedFromStrictSkills(strict: StrictExtractedSkills): ExtractedSkills {
  const byCategory: Record<SkillCategoryId, string[]> = {
    coreCS: Array.isArray(strict.coreCS) ? strict.coreCS : [],
    languages: Array.isArray(strict.languages) ? strict.languages : [],
    web: Array.isArray(strict.web) ? strict.web : [],
    data: Array.isArray(strict.data) ? strict.data : [],
    cloudDevops: Array.isArray(strict.cloud) ? strict.cloud : [],
    testing: Array.isArray(strict.testing) ? strict.testing : [],
    other: Array.isArray(strict.other) ? strict.other : [],
  };
  const presentCategories = (Object.keys(byCategory) as SkillCategoryId[]).filter(
    (k) => byCategory[k].length > 0,
  );
  const allSkills = presentCategories.flatMap((k) => byCategory[k]);
  return {
    byCategory,
    presentCategories,
    allSkills: [...new Set(allSkills)],
    hasAny: allSkills.length > 0,
  };
}

/**
 * Convert an in-memory AnalysisEntry to the strict persisted shape.
 */
export function toStrictEntry(entry: AnalysisEntry): StrictAnalysisEntry {
  const baseScore = entry.baseReadinessScore ?? entry.readinessScore;
  const finalScore = entry.readinessScore;
  const updatedAt = (entry as AnalysisEntry & { updatedAt?: string }).updatedAt ?? entry.createdAt;

  return {
    id: entry.id,
    createdAt: entry.createdAt,
    company: entry.company ?? "",
    role: entry.role ?? "",
    jdText: entry.jdText,
    extractedSkills: strictSkillsFromExtracted(entry.extractedSkills),
    roundMapping: (entry.roundMapping ?? []).map((r) => ({
      roundTitle: r.title,
      focusAreas: [],
      whyItMatters: r.whyItMatters,
    })),
    checklist: (entry.checklist ?? []).map((c) => ({
      roundTitle: c.title,
      items: c.items ?? [],
    })),
    plan7Days: (entry.plan ?? []).map((p) => ({
      day: p.dayLabel,
      focus: p.focus,
      tasks: p.details ? [p.details] : [],
    })),
    questions: Array.isArray(entry.questions) ? entry.questions : [],
    baseScore,
    skillConfidenceMap: entry.skillConfidenceMap ?? {},
    finalScore,
    updatedAt,
  };
}

function isNonEmptyString(s: unknown): s is string {
  return typeof s === "string";
}

function isString(s: unknown): s is string {
  return typeof s === "string";
}

function isNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function isPlainObject(o: unknown): o is Record<string, unknown> {
  return o !== null && typeof o === "object" && !Array.isArray(o);
}

function isStringArray(a: unknown): a is string[] {
  return Array.isArray(a) && a.every((x) => typeof x === "string");
}

function isRecordOfConfidence(m: unknown): m is Record<string, SkillConfidence> {
  if (!isPlainObject(m)) return false;
  for (const v of Object.values(m)) {
    if (v !== "know" && v !== "practice") return false;
  }
  return true;
}

/**
 * Validate and convert a raw parsed value to AnalysisEntry, or null if corrupted.
 */
export function fromStrictEntry(raw: unknown): AnalysisEntry | null {
  if (!isPlainObject(raw)) return null;
  const o = raw as Record<string, unknown>;

  const id = isNonEmptyString(o.id) ? o.id : null;
  const createdAt = isString(o.createdAt) ? o.createdAt : null;
  const jdText = isString(o.jdText) ? o.jdText : null;
  if (id == null || createdAt == null || jdText == null) return null;

  const company = isString(o.company) ? o.company : "";
  const role = isString(o.role) ? o.role : "";

  let extractedSkills: ExtractedSkills;
  if (isPlainObject(o.extractedSkills)) {
    const strict = o.extractedSkills as Record<string, unknown>;
    const strictSkills: StrictExtractedSkills = {
      coreCS: isStringArray(strict.coreCS) ? strict.coreCS : [],
      languages: isStringArray(strict.languages) ? strict.languages : [],
      web: isStringArray(strict.web) ? strict.web : [],
      data: isStringArray(strict.data) ? strict.data : [],
      cloud: isStringArray(strict.cloud) ? strict.cloud : [],
      testing: isStringArray(strict.testing) ? strict.testing : [],
      other: isStringArray(strict.other) ? strict.other : [],
    };
    extractedSkills = extractedFromStrictSkills(strictSkills);
  } else {
    return null;
  }

  const roundMapping: RoundMappingItem[] = [];
  if (Array.isArray(o.roundMapping)) {
    for (const r of o.roundMapping) {
      if (isPlainObject(r) && isString((r as Record<string, unknown>).roundTitle) && isString((r as Record<string, unknown>).whyItMatters)) {
        const rr = r as Record<string, unknown>;
        roundMapping.push({
          id: `r${roundMapping.length + 1}`,
          title: rr.roundTitle as string,
          whyItMatters: rr.whyItMatters as string,
        });
      }
    }
  }

  const checklist: ChecklistRound[] = [];
  if (Array.isArray(o.checklist)) {
    for (const c of o.checklist) {
      if (isPlainObject(c) && isString((c as Record<string, unknown>).roundTitle) && isStringArray((c as Record<string, unknown>).items)) {
        const cc = c as Record<string, unknown>;
        checklist.push({
          id: `round-${checklist.length + 1}`,
          title: cc.roundTitle as string,
          items: cc.items as string[],
        });
      }
    }
  }

  const plan: DayPlan[] = [];
  if (Array.isArray(o.plan7Days)) {
    for (const p of o.plan7Days) {
      if (isPlainObject(p) && isString((p as Record<string, unknown>).day) && isString((p as Record<string, unknown>).focus)) {
        const pp = p as Record<string, unknown>;
        const tasks = isStringArray(pp.tasks) ? pp.tasks : [];
        plan.push({
          dayLabel: pp.day as string,
          focus: pp.focus as string,
          details: tasks.length > 0 ? tasks.join(" ") : "",
        });
      }
    }
  }

  const questions = isStringArray(o.questions) ? o.questions : [];
  const baseScore = isNumber(o.baseScore) ? Math.max(0, Math.min(100, o.baseScore)) : 35;
  const skillConfidenceMap = isRecordOfConfidence(o.skillConfidenceMap) ? o.skillConfidenceMap : {};
  const finalScore = isNumber(o.finalScore) ? Math.max(0, Math.min(100, o.finalScore)) : baseScore;
  const updatedAt = isString(o.updatedAt) ? o.updatedAt : createdAt;

  return {
    id,
    createdAt,
    company,
    role,
    jdText,
    extractedSkills,
    plan,
    checklist,
    questions,
    readinessScore: finalScore,
    baseReadinessScore: baseScore,
    skillConfidenceMap,
    roundMapping,
    updatedAt,
  };
}
