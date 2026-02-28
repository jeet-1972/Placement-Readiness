import { type ReactNode } from "react";

export type SkillCategoryId =
  | "coreCS"
  | "languages"
  | "web"
  | "data"
  | "cloudDevops"
  | "testing"
  | "other";

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

export type SkillConfidence = "know" | "practice";

export type CompanySizeCategory = "startup" | "mid-size" | "enterprise";

export interface CompanyIntel {
  companyName: string;
  industry: string;
  sizeCategory: CompanySizeCategory;
  sizeLabel: string;
  typicalHiringFocus: string;
}

export interface RoundMappingItem {
  id: string;
  title: string;
  whyItMatters: string;
}

export type RoundMapping = RoundMappingItem[];

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
  /**
   * Score shown to the user; derived from baseReadinessScore plus per-skill confidence.
   */
  readinessScore: number;
  /**
   * Original score from JD heuristics, before self-assessment adjustments.
   */
  baseReadinessScore?: number;
  /**
   * User-marked confidence for each detected skill.
   */
  skillConfidenceMap?: Record<string, SkillConfidence>;
  /**
   * Company intel when company name was provided; null otherwise.
   */
  companyIntel?: CompanyIntel | null;
  /**
   * Dynamic round flow based on company size and detected skills.
   */
  roundMapping?: RoundMapping;
  /**
   * Last updated timestamp (set on create and on skill confidence toggle).
   */
  updatedAt?: string;
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
  other: "General",
};

const DEFAULT_OTHER_SKILLS: string[] = [
  "Communication",
  "Problem solving",
  "Basic coding",
  "Projects",
];

const KNOWN_ENTERPRISE: string[] = [
  "amazon",
  "infosys",
  "tcs",
  "tata consultancy",
  "wipro",
  "accenture",
  "cognizant",
  "capgemini",
  "microsoft",
  "google",
  "meta",
  "apple",
  "oracle",
  "ibm",
  "hcl",
  "tech mahindra",
  "ltimindtree",
  "lti",
];

const KNOWN_MID_SIZE: string[] = [
  "zoho",
  "freshworks",
  "postman",
  "thoughtworks",
  "atlassian",
];

const INDUSTRY_KEYWORDS: { keywords: string[]; industry: string }[] = [
  { keywords: ["fintech", "banking", "payment", "lending"], industry: "Financial Services" },
  { keywords: ["healthcare", "medical", "pharma", "clinical"], industry: "Healthcare" },
  { keywords: ["e-commerce", "ecommerce", "retail", "marketplace"], industry: "E-Commerce & Retail" },
  { keywords: ["edtech", "education", "learning platform"], industry: "Education Technology" },
  { keywords: ["saas", "enterprise software", "b2b"], industry: "Enterprise Software" },
];

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function normalizeCompanyForMatch(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

export function buildCompanyIntel(company: string, jdText: string): CompanyIntel | null {
  const trimmed = company.trim();
  if (!trimmed) return null;

  const normalized = normalizeCompanyForMatch(trimmed);
  const text = jdText.toLowerCase();

  let sizeCategory: CompanySizeCategory = "startup";
  let sizeLabel = "Startup (<200)";
  if (KNOWN_ENTERPRISE.some((c) => normalized.includes(c) || c.includes(normalized))) {
    sizeCategory = "enterprise";
    sizeLabel = "Enterprise (2000+)";
  } else if (KNOWN_MID_SIZE.some((c) => normalized.includes(c) || c.includes(normalized))) {
    sizeCategory = "mid-size";
    sizeLabel = "Mid-size (200–2000)";
  }

  let industry = "Technology Services";
  for (const { keywords, industry: ind } of INDUSTRY_KEYWORDS) {
    if (keywords.some((k) => text.includes(k))) {
      industry = ind;
      break;
    }
  }

  let typicalHiringFocus: string;
  if (sizeCategory === "enterprise") {
    typicalHiringFocus =
      "Structured DSA and core CS fundamentals; emphasis on algorithms, system design basics, and consistent evaluation across many candidates.";
  } else if (sizeCategory === "mid-size") {
    typicalHiringFocus =
      "Balance of problem-solving, practical coding, and domain fit; often 2–3 technical rounds plus culture alignment.";
  } else {
    typicalHiringFocus =
      "Practical problem-solving and stack depth; smaller teams look for hands-on coding and ability to ship features quickly.";
  }

  return {
    companyName: trimmed,
    industry,
    sizeCategory,
    sizeLabel,
    typicalHiringFocus,
  };
}

export function buildRoundMapping(
  companyIntel: CompanyIntel | null,
  extracted: ExtractedSkills,
): RoundMapping {
  const hasDSA = extracted.byCategory.coreCS.includes("DSA") || extracted.presentCategories.includes("coreCS");
  const hasWeb = extracted.byCategory.web.length > 0;
  const hasReactOrNode =
    extracted.byCategory.web.includes("React") ||
    extracted.byCategory.web.includes("Node.js");
  const isEnterprise = companyIntel?.sizeCategory === "enterprise";
  const isStartup = companyIntel?.sizeCategory === "startup";

  if (isEnterprise && hasDSA) {
    return [
      {
        id: "r1",
        title: "Round 1: Online Test (DSA + Aptitude)",
        whyItMatters: "Filters for basic coding and logic; strong performance here keeps you in the pipeline.",
      },
      {
        id: "r2",
        title: "Round 2: Technical (DSA + Core CS)",
        whyItMatters: "Deep dive on algorithms and CS fundamentals; expect live coding and theory questions.",
      },
      {
        id: "r3",
        title: "Round 3: Tech + Projects",
        whyItMatters: "They validate real experience; be ready to walk through design decisions and trade-offs.",
      },
      {
        id: "r4",
        title: "Round 4: HR",
        whyItMatters: "Culture fit and motivation; keep answers concise and aligned with the role.",
      },
    ];
  }

  if (isStartup && hasReactOrNode) {
    return [
      {
        id: "r1",
        title: "Round 1: Practical coding",
        whyItMatters: "They want to see you run and debug code; focus on clarity and a working solution.",
      },
      {
        id: "r2",
        title: "Round 2: System discussion",
        whyItMatters: "Architecture and scalability in context of their stack; show you can think beyond a single task.",
      },
      {
        id: "r3",
        title: "Round 3: Culture fit",
        whyItMatters: "Small teams care about collaboration and ownership; be ready to discuss how you work.",
      },
    ];
  }

  if (isEnterprise) {
    return [
      {
        id: "r1",
        title: "Round 1: Screening (Aptitude / Coding)",
        whyItMatters: "Initial filter; aim for clean, correct solutions within time.",
      },
      {
        id: "r2",
        title: "Round 2: Technical (Core + Stack)",
        whyItMatters: "Combines fundamentals with role-specific skills; prepare both theory and coding.",
      },
      {
        id: "r3",
        title: "Round 3: Projects / Design",
        whyItMatters: "Experience and design thinking; have 1–2 projects you can explain in depth.",
      },
      {
        id: "r4",
        title: "Round 4: HR",
        whyItMatters: "Final alignment on motivation and fit; keep answers positive and specific.",
      },
    ];
  }

  if (hasWeb && hasDSA) {
    return [
      {
        id: "r1",
        title: "Round 1: DSA / Coding",
        whyItMatters: "Tests problem-solving; practice arrays, strings, and basic data structures.",
      },
      {
        id: "r2",
        title: "Round 2: Technical (Stack + Projects)",
        whyItMatters: "Role-specific depth; be ready to discuss your stack and projects.",
      },
      {
        id: "r3",
        title: "Round 3: HR / Fit",
        whyItMatters: "Team fit and motivation; prepare concise stories and questions for them.",
      },
    ];
  }

  return [
    {
      id: "r1",
      title: "Round 1: Aptitude / Basics",
      whyItMatters: "Warm-up for logic and fundamentals; stay calm and show clear thinking.",
    },
    {
      id: "r2",
      title: "Round 2: Technical",
      whyItMatters: "Core CS and coding; align with the skills mentioned in the JD.",
    },
    {
      id: "r3",
      title: "Round 3: HR / Discussion",
      whyItMatters: "Fit and motivation; close with clarity on why you want this role.",
    },
  ];
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
    other: [],
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
    byCategory.other = [...DEFAULT_OTHER_SKILLS];
    return {
      byCategory,
      presentCategories: ["other"],
      allSkills: [...DEFAULT_OTHER_SKILLS],
      hasAny: true,
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
  const onlyOther =
    extracted.presentCategories.length === 1 && extracted.presentCategories[0] === "other";
  if (onlyOther) {
    return [
      {
        id: "round-1",
        title: "Round 1: Aptitude & Basics",
        items: [
          "Practice clear communication: explain a technical concept in 2–3 sentences.",
          "Revise basic problem-solving patterns: loops, conditionals, simple data structures.",
          "Prepare 5–10 small coding exercises (syntax, debugging) in your preferred language.",
          "Draft a 60–90 second intro about yourself and your background.",
          meta.company
            ? `Read about ${meta.company} and note why you're interested.`
            : "Research the company and role briefly.",
        ],
      },
      {
        id: "round-2",
        title: "Round 2: Problem solving & Coding",
        items: [
          "Practice explaining your approach before coding; think out loud.",
          "Review 2–3 projects you can describe clearly: what, why, and your role.",
          "Prepare examples of when you solved a problem under pressure.",
        ],
      },
      {
        id: "round-3",
        title: "Round 3: Projects & Fit",
        items: [
          "Prepare to walk through 1–2 projects: requirements, design, and outcomes.",
          "Practice answering \"Why this company?\" and \"Why this role?\"",
          "Prepare 2–3 questions to ask the interviewer.",
        ],
      },
    ];
  }

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
  const onlyOther =
    extracted.presentCategories.length === 1 && extracted.presentCategories[0] === "other";
  if (onlyOther) {
    return [
      { dayLabel: "Day 1", focus: "Basics & Communication", details: "Refresh programming basics and practice explaining one concept simply (e.g. variable, loop). Note 3–5 key points about yourself and your goals." },
      { dayLabel: "Day 2", focus: "Problem solving", details: "Solve 5–10 simple coding problems (arrays, strings). Practice talking through your approach before writing code." },
      { dayLabel: "Day 3", focus: "Coding practice", details: "Continue with easy–medium problems; focus on clean code and clear variable names. Time yourself on 2–3 problems." },
      { dayLabel: "Day 4", focus: "Projects", details: "Pick 2 projects and write a 3–4 line summary for each. Be ready to explain what you built and what you learned." },
      { dayLabel: "Day 5", focus: "Resume & stories", details: "Align your resume with the JD. Prepare 2–3 short stories: problem solved, learning from failure, working in a team." },
      { dayLabel: "Day 6", focus: "Mock & questions", details: "Do a short mock interview or record yourself answering \"Tell me about yourself\" and 2 project questions. Prepare questions to ask the interviewer." },
      { dayLabel: "Day 7", focus: "Revision & rest", details: "Light revision of your notes and key points. Rest well before the interview." },
    ];
  }

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

const GENERAL_OTHER_QUESTIONS: string[] = [
  "Tell me about yourself and your background.",
  "Walk me through a project you're proud of.",
  "Describe a time you solved a difficult problem.",
  "How do you approach learning something new?",
  "Tell me about a time you worked in a team and had a disagreement.",
  "Where do you see yourself in 2–3 years?",
  "Why do you want to join this company / role?",
  "What are your strengths and one area you're working on?",
  "Describe a situation where you had to explain something technical to a non-technical person.",
  "How do you handle tight deadlines or multiple priorities?",
];

export function buildLikelyQuestions(extracted: ExtractedSkills): string[] {
  const onlyOther =
    extracted.presentCategories.length === 1 && extracted.presentCategories[0] === "other";
  if (onlyOther) {
    return GENERAL_OTHER_QUESTIONS.slice(0, 10);
  }

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

function applyConfidenceToScore(
  baseScore: number,
  skills: string[],
  confidenceMap: Record<string, SkillConfidence>,
): number {
  let result = baseScore;
  for (const skill of skills) {
    const choice = confidenceMap[skill] ?? "practice";
    if (choice === "know") result += 2;
    else result -= 2;
  }
  if (result > 100) return 100;
  if (result < 0) return 0;
  return result;
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

  const companyIntel = buildCompanyIntel(company, jdText);
  const roundMapping = buildRoundMapping(companyIntel, extractedSkills);

  const now = new Date().toISOString();
  const baseEntry: AnalysisEntry = {
    id: generateId(),
    createdAt: now,
    company,
    role,
    jdText,
    extractedSkills,
    plan,
    checklist,
    questions,
    readinessScore,
    baseReadinessScore: readinessScore,
    companyIntel: companyIntel ?? null,
    roundMapping,
    updatedAt: now,
  };

  return withDefaultConfidence(baseEntry);
}

/**
 * Backfill companyIntel and roundMapping for entries loaded from storage that lack them.
 */
export function ensureCompanyIntelAndRoundMapping(entry: AnalysisEntry): AnalysisEntry {
  if (entry.companyIntel != null && entry.roundMapping != null) return entry;
  const companyIntel = entry.companyIntel ?? buildCompanyIntel(entry.company, entry.jdText);
  const roundMapping = entry.roundMapping ?? buildRoundMapping(companyIntel, entry.extractedSkills);
  return {
    ...entry,
    companyIntel: companyIntel ?? null,
    roundMapping,
  };
}

/**
 * Ensure an AnalysisEntry has a complete confidence map for all skills and an
 * up-to-date readinessScore derived from baseReadinessScore.
 *
 * Used both when creating new entries and when upgrading entries loaded from storage.
 */
export function withDefaultConfidence(entry: AnalysisEntry): AnalysisEntry {
  const allSkills = entry.extractedSkills.allSkills;
  const base =
    entry.baseReadinessScore === undefined
      ? entry.readinessScore
      : entry.baseReadinessScore;

  const existingMap = entry.skillConfidenceMap ?? {};
  const confidenceMap: Record<string, SkillConfidence> = { ...existingMap };

  for (const skill of allSkills) {
    if (!confidenceMap[skill]) {
      confidenceMap[skill] = "practice";
    }
  }

  const adjustedScore = applyConfidenceToScore(base, allSkills, confidenceMap);

  return {
    ...entry,
    baseReadinessScore: base,
    skillConfidenceMap: confidenceMap,
    readinessScore: adjustedScore,
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

