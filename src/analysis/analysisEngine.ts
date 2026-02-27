import { type ReactNode } from "react";

export type SkillCategoryId =
  | "coreCS"
  | "languages"
  | "web"
  | "data"
  | "cloudDevops"
  | "testing";

export interface ExtractedSkills {
  byCategory: Record<SkillCategoryId, string[]>;
  presentCategories: SkillCategoryId[];
  allSkills: string[];
  hasAny: boolean;
  fallbackLabel?: string;
}

export interface ChecklistRound {
  id: string;
  title: string;
  items: string[];
}

export interface DayPlan {
  dayLabel: string;
  focus: string;
  details: string;
}

export type SevenDayPlan = DayPlan[];

export interface AnalysisEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: ExtractedSkills;
  plan: SevenDayPlan;
  checklist: ChecklistRound[];
  questions: string[];
  readinessScore: number;
}

export interface AnalyzeInput {
  company: string;
  role: string;
  jdText: string;
}

type KeywordConfig = {
  category: SkillCategoryId;
  label: string;
  match: string;
};

const KEYWORDS: KeywordConfig[] = [
  // Core CS
  { category: "coreCS", label: "DSA", match: "dsa" },
  { category: "coreCS", label: "OOP", match: "oop" },
  { category: "coreCS", label: "DBMS", match: "dbms" },
  { category: "coreCS", label: "Operating Systems", match: "operating system" },
  { category: "coreCS", label: "Operating Systems", match: "os " },
  { category: "coreCS", label: "Computer Networks", match: "computer networks" },
  { category: "coreCS", label: "Computer Networks", match: "networks" },

  // Languages
  { category: "languages", label: "Java", match: "java" },
  { category: "languages", label: "Python", match: "python" },
  { category: "languages", label: "JavaScript", match: "javascript" },
  { category: "languages", label: "TypeScript", match: "typescript" },
  { category: "languages", label: "C", match: " c " },
  { category: "languages", label: "C++", match: "c++" },
  { category: "languages", label: "C#", match: "c#" },
  { category: "languages", label: "Go", match: "golang" },
  { category: "languages", label: "Go", match: " go " },

  // Web
  { category: "web", label: "React", match: "react" },
  { category: "web", label: "Next.js", match: "next.js" },
  { category: "web", label: "Node.js", match: "node.js" },
  { category: "web", label: "Express", match: "express" },
  { category: "web", label: "REST APIs", match: "rest api" },
  { category: "web", label: "GraphQL", match: "graphql" },

  // Data
  { category: "data", label: "SQL", match: "sql" },
  { category: "data", label: "MongoDB", match: "mongodb" },
  { category: "data", label: "PostgreSQL", match: "postgresql" },
  { category: "data", label: "MySQL", match: "mysql" },
  { category: "data", label: "Redis", match: "redis" },

  // Cloud / DevOps
  { category: "cloudDevops", label: "AWS", match: "aws" },
  { category: "cloudDevops", label: "Azure", match: "azure" },
  { category: "cloudDevops", label: "GCP", match: "gcp" },
  { category: "cloudDevops", label: "Docker", match: "docker" },
  { category: "cloudDevops", label: "Kubernetes", match: "kubernetes" },
  { category: "cloudDevops", label: "CI/CD", match: "ci/cd" },
  { category: "cloudDevops", label: "Linux", match: "linux" },

  // Testing
  { category: "testing", label: "Selenium", match: "selenium" },
  { category: "testing", label: "Cypress", match: "cypress" },
  { category: "testing", label: "Playwright", match: "playwright" },
  { category: "testing", label: "JUnit", match: "junit" },
  { category: "testing", label: "PyTest", match: "pytest" },
];

const CATEGORY_LABELS: Record<SkillCategoryId, string> = {
  coreCS: "Core CS",
  languages: "Languages",
  web: "Web / Backend",
  data: "Data & Databases",
  cloudDevops: "Cloud / DevOps",
  testing: "Testing",
};

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

export function extractSkills(jdText: string): ExtractedSkills {
  const text = jdText.toLowerCase();
  const byCategory: Record<SkillCategoryId, string[]> = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloudDevops: [],
    testing: [],
  };

  for (const { category, label, match } of KEYWORDS) {
    if (!text.includes(match)) continue;
    if (!byCategory[category].includes(label)) {
      byCategory[category].push(label);
    }
  }

  const presentCategories = (Object.keys(byCategory) as SkillCategoryId[]).filter(
    (cat) => byCategory[cat].length > 0,
  );

  const allSkills = unique(
    (Object.keys(byCategory) as SkillCategoryId[]).flatMap(
      (cat) => byCategory[cat],
    ),
  );

  if (allSkills.length === 0) {
    return {
      byCategory,
      presentCategories: [],
      allSkills,
      hasAny: false,
      fallbackLabel: "General fresher stack",
    };
  }

  return {
    byCategory,
    presentCategories,
    allSkills,
    hasAny: true,
  };
}

function firstOrFallback(skills: string[], fallback: string): string {
  return skills[0] ?? fallback;
}

export function buildChecklist(
  extracted: ExtractedSkills,
  meta: { company: string; role: string },
): ChecklistRound[] {
  const hasDSA = extracted.byCategory.coreCS.includes("DSA");
  const hasCoreCS =
    extracted.byCategory.coreCS.length > 0 || extracted.hasAny;

  const languagePrimary = firstOrFallback(
    extracted.byCategory.languages,
    "your primary language",
  );

  const rounds: ChecklistRound[] = [];

  rounds.push({
    id: "round-1",
    title: "Round 1: Aptitude & Basics",
    items: unique([
      "Revise quantitative aptitude: arrays of problems on percentages, profit & loss, time & work, and probability.",
      "Refresh basic CS terminology: algorithms, complexity, compilation vs interpretation.",
      `Review basic syntax, data types, and control flow in ${languagePrimary}.`,
      "Practice 10–15 simple coding problems to warm up (loops, conditionals, strings).",
      "Prepare a 60–90 second elevator pitch about yourself and your background.",
      meta.company
        ? `Read the About and Careers pages of ${meta.company} to understand their business and culture.`
        : "Research the company's products, tech stack, and recent news.",
    ]),
  });

  const coreItems: string[] = [];
  if (hasDSA || extracted.hasAny) {
    coreItems.push(
      "Practice DSA: 3–4 problems each from arrays, strings, and hash maps.",
      "Revise time and space complexity for your practiced problems.",
    );
  }
  if (extracted.byCategory.coreCS.includes("OOP")) {
    coreItems.push(
      `Review OOP pillars (encapsulation, abstraction, inheritance, polymorphism) with ${languagePrimary} examples.`,
    );
  }
  if (extracted.byCategory.coreCS.includes("DBMS") || extracted.byCategory.data.includes("SQL")) {
    coreItems.push(
      "Revise DBMS basics: normalization, ACID, primary/foreign keys, and transactions.",
    );
  }
  if (extracted.byCategory.coreCS.includes("Operating Systems")) {
    coreItems.push("Revisit OS concepts: processes vs threads, scheduling, deadlocks.");
  }
  if (extracted.byCategory.coreCS.includes("Computer Networks")) {
    coreItems.push(
      "Revisit Networks basics: OSI vs TCP/IP, HTTP vs HTTPS, latency vs bandwidth.",
    );
  }

  if (coreItems.length === 0 && hasCoreCS) {
    coreItems.push(
      "Cover core CS quickly: OS, DBMS, and Networks one-by-one with short notes.",
    );
  }

  rounds.push({
    id: "round-2",
    title: "Round 2: DSA & Core CS",
    items: unique([
      ...coreItems,
      "Maintain a small notebook of 20–30 key concepts and formulas you can scan before interviews.",
    ]),
  });

  const techItems: string[] = [];

  if (extracted.byCategory.web.length > 0) {
    if (extracted.byCategory.web.includes("React")) {
      techItems.push(
        "Prepare to explain a React component you wrote recently (props, state, effects).",
        "Understand state management options in React (local state, context, simple stores).",
      );
    }
    if (extracted.byCategory.web.includes("Node.js") || extracted.byCategory.web.includes("Express")) {
      techItems.push(
        "Be ready to walk through how you build a simple REST API (routing, validation, error handling).",
      );
    }
    if (extracted.byCategory.web.includes("GraphQL")) {
      techItems.push("Revise how GraphQL schemas, queries, and resolvers fit together.");
    }
  }

  if (extracted.byCategory.data.includes("SQL")) {
    techItems.push(
      "Practice writing SQL queries with joins, grouping, and filtering on sample tables.",
    );
  }

  if (extracted.byCategory.cloudDevops.length > 0) {
    techItems.push(
      "Prepare one concrete example of how you deployed or debugged something in a cloud or Linux environment.",
    );
  }

  if (techItems.length === 0) {
    techItems.push(
      "Prepare to explain 1–2 of your projects in detail: requirements, design, tech stack, and trade-offs.",
    );
  }

  rounds.push({
    id: "round-3",
    title: "Round 3: Technical Interview (Projects & Stack)",
    items: unique([
      ...techItems,
      "Prepare STAR-form answers for 2–3 technical challenges you solved (Situation, Task, Action, Result).",
    ]),
  });

  rounds.push({
    id: "round-4",
    title: "Round 4: Managerial & HR",
    items: [
      "Prepare stories for common HR themes: conflict, leadership, failure, learning, and ambiguity.",
      "Review your resume line-by-line to ensure you can speak confidently about every bullet.",
      "Practice answering \"Why this company?\" and \"Why this role?\" concisely.",
      "Prepare 3–4 thoughtful questions to ask the interviewer about the team and expectations.",
      "Do a 20–30 minute mock HR conversation with a friend or in front of a camera.",
    ],
  });

  return rounds;
}

export function buildSevenDayPlan(extracted: ExtractedSkills): SevenDayPlan {
  const hasReact = extracted.byCategory.web.includes("React");
  const hasNode = extracted.byCategory.web.includes("Node.js");
  const hasSql = extracted.byCategory.data.includes("SQL");
  const hasCloud = extracted.byCategory.cloudDevops.length > 0;
  const hasTesting = extracted.byCategory.testing.length > 0;

  const coreCsFocus =
    extracted.byCategory.coreCS.length > 0
      ? extracted.byCategory.coreCS.join(", ")
      : "OS, DBMS, and Networks fundamentals";

  const frontendExtras = hasReact
    ? "React component patterns, hooks, and state management."
    : "";
  const backendExtras =
    hasNode || hasSql
      ? "API design, database queries, and error handling paths."
      : "";

  const plan: SevenDayPlan = [
    {
      dayLabel: "Day 1",
      focus: "Basics & Core CS — Part 1",
      details: `Refresh programming basics and start core CS. Focus on: ${coreCsFocus}. Aim for concise notes, not textbooks.`,
    },
    {
      dayLabel: "Day 2",
      focus: "Basics & Core CS — Part 2",
      details:
        "Finish remaining core CS topics and solve a small mix of aptitude + easy coding problems to cement fundamentals.",
    },
    {
      dayLabel: "Day 3",
      focus: "DSA & Coding Practice — Arrays/Strings",
      details:
        "Target arrays and strings problems (easy-medium). Track patterns you see repeatedly and write down 5–10 reusable templates.",
    },
    {
      dayLabel: "Day 4",
      focus: "DSA & Coding Practice — Hashing/Trees",
      details:
        "Practice hash map and tree problems. Focus on how you explain your approach, not just the final code.",
    },
    {
      dayLabel: "Day 5",
      focus: "Projects & Resume Alignment",
      details: [
        "Pick 1–2 key projects and write a crisp 3–4 line walkthrough for each.",
        frontendExtras,
        backendExtras,
        hasCloud ? "Review any cloud or DevOps pieces you touched (deploy, logs, monitoring)." : "",
      ]
        .filter(Boolean)
        .join(" "),
    },
    {
      dayLabel: "Day 6",
      focus: "Mock Interview & Targeted Questions",
      details: [
        "Do at least one timed mock interview (DSA + project + HR).",
        hasTesting
          ? "Prepare to discuss how you test your code or use tools like Selenium/Cypress."
          : "",
        "Write down 10–15 likely questions based on this JD and rehearse concise answers.",
      ]
        .filter(Boolean)
        .join(" "),
    },
    {
      dayLabel: "Day 7",
      focus: "Revision & Weak Areas",
      details:
        "Light revision day. Revisit your weakest topics, scan your notes, and sleep early so you show up calm and clear.",
    },
  ];

  return plan;
}

const QUESTION_TEMPLATES: Record<string, string[]> = {
  DSA: [
    "How would you optimize search in a large sorted dataset?",
    "Describe a time complexity trade-off you made in a data structure or algorithm.",
  ],
  "Operating Systems": ["Explain the difference between a process and a thread with examples."],
  "Computer Networks": [
    "Explain how HTTP works over TCP. What happens when you type a URL in the browser?",
  ],
  OOP: ["What are the four pillars of OOP and how have you used them in a recent project?"],
  DBMS: [
    "Explain normalization. When would you denormalize a database schema in practice?",
  ],
  SQL: [
    "Explain indexing in SQL and when it helps.",
    "Given a large table, how would you find the top N records by a metric efficiently?",
  ],
  React: [
    "Explain state management options in React for a medium-size app.",
    "How do you think about performance optimization in React components?",
  ],
  "Node.js": [
    "How does Node.js handle concurrency if it has a single-threaded event loop?",
  ],
  "REST APIs": [
    "How would you design a REST API for managing user profiles? Discuss endpoints and error handling.",
  ],
  MongoDB: [
    "When would you prefer MongoDB over a relational database for a new feature?",
  ],
  AWS: [
    "Describe an architecture using AWS services for a simple web application.",
  ],
  Docker: ["What problem does Docker solve, and how would you explain containers to a non-engineer?"],
  Kubernetes: [
    "What are pods and deployments in Kubernetes, and how do they relate?",
  ],
  Selenium: [
    "How would you design a Selenium test suite for a login workflow?",
  ],
  Cypress: [
    "What advantages does Cypress provide for frontend testing compared to traditional Selenium tests?",
  ],
};

export function buildLikelyQuestions(extracted: ExtractedSkills): string[] {
  const questions: string[] = [];

  const addQuestionsForSkill = (skill: string) => {
    const templates = QUESTION_TEMPLATES[skill];
    if (!templates) return;
    for (const q of templates) {
      if (questions.length >= 10) break;
      if (!questions.includes(q)) {
        questions.push(q);
      }
    }
  };

  for (const cat of extracted.presentCategories) {
    for (const skill of extracted.byCategory[cat]) {
      if (questions.length >= 10) break;
      addQuestionsForSkill(skill);
    }
  }

  const generalPool: string[] = [
    "Walk me through a recent project you are proud of and the trade-offs you made.",
    "Describe a time you debugged a tricky production issue. How did you approach it?",
    "Tell me about a time you had to learn a new technology quickly for a project.",
    "How do you decide when code is \"good enough\" to ship?",
  ];

  for (const q of generalPool) {
    if (questions.length >= 10) break;
    if (!questions.includes(q)) questions.push(q);
  }

  return questions.slice(0, 10);
}

export function computeReadinessScore(args: {
  jdText: string;
  companyProvided: boolean;
  roleProvided: boolean;
  categoriesPresent: SkillCategoryId[];
}): number {
  let score = 35;

  const distinctCategories = unique(args.categoriesPresent);
  const categoryBonus = Math.min(distinctCategories.length * 5, 30);
  score += categoryBonus;

  if (args.companyProvided) score += 10;
  if (args.roleProvided) score += 10;
  if (args.jdText.length > 800) score += 10;

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  return score;
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function analyzeJD(input: AnalyzeInput): AnalysisEntry {
  const company = input.company.trim();
  const role = input.role.trim();
  const jdText = input.jdText.trim();

  const extractedSkills = extractSkills(jdText);
  const checklist = buildChecklist(extractedSkills, { company, role });
  const plan = buildSevenDayPlan(extractedSkills);
  const questions = buildLikelyQuestions(extractedSkills);
  const readinessScore = computeReadinessScore({
    jdText,
    companyProvided: company.length > 0,
    roleProvided: role.length > 0,
    categoriesPresent: extractedSkills.presentCategories,
  });

  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    company,
    role,
    jdText,
    extractedSkills,
    plan,
    checklist,
    questions,
    readinessScore,
  };
}

export function describeCategories(
  extracted: ExtractedSkills,
): ReactNode | null {
  if (!extracted.hasAny && !extracted.fallbackLabel) return null;

  if (!extracted.hasAny && extracted.fallbackLabel) {
    return extracted.fallbackLabel;
  }

  const labels = extracted.presentCategories.map(
    (cat) => CATEGORY_LABELS[cat],
  );
  return labels.join(", ");
}

