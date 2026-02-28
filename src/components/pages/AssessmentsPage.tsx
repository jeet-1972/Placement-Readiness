import { useState, type FormEvent } from "react";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { useAnalysis } from "../../analysis/AnalysisContext";
import {
  type ChecklistRound,
  type CompanyIntel,
  type RoundMapping,
  type SevenDayPlan,
  type SkillCategoryId,
} from "../../analysis/analysisEngine";
import styles from "./AssessmentsPage.module.css";

export function AssessmentsPage() {
  const {
    analyze,
    latestEntry,
    history,
    selectFromHistory,
    updateSkillConfidence,
    skippedCorruptedCount,
  } = useAnalysis();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jdTooShort = jdText.trim().length > 0 && jdText.trim().length < 200;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!jdText.trim()) return;
    setIsSubmitting(true);
    try {
      analyze({ company, role, jdText });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSkillsSection = () => {
    if (!latestEntry) {
      return (
        <p className={styles.emptyState}>
          Paste a job description and run an analysis to see extracted skills, checklists, and a
          7-day plan here.
        </p>
      );
    }

    const { extractedSkills, skillConfidenceMap } = latestEntry;

    if (!extractedSkills.hasAny && extractedSkills.fallbackLabel) {
      return (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Key skills extracted</p>
          <div className={styles.tagGroup}>
            <span className={styles.tag}>{extractedSkills.fallbackLabel}</span>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Key skills extracted</p>
        {(Object.keys(
          extractedSkills.byCategory,
        ) as SkillCategoryId[])
          .filter((cat) => extractedSkills.byCategory[cat].length > 0)
          .map((cat) => (
            <div key={cat} className={styles.categoryRow}>
              <span className={styles.categoryLabel}>{cat}</span>
              <span className={styles.tagGroup}>
                {extractedSkills.byCategory[cat].map((skill) => {
                  const current =
                    (skillConfidenceMap && skillConfidenceMap[skill]) ??
                    "practice";
                  const isKnow = current === "know";
                  return (
                    <button
                      key={skill}
                      type="button"
                      className={`${styles.tagButton} ${
                        isKnow
                          ? styles.tagButtonKnow
                          : styles.tagButtonPractice
                      }`.trim()}
                      onClick={() =>
                        updateSkillConfidence(
                          latestEntry.id,
                          skill,
                          isKnow ? "practice" : "know",
                        )
                      }
                    >
                      <span className={styles.tagSkillLabel}>{skill}</span>
                      <span className={styles.tagStateLabel}>
                        {isKnow ? "I know this" : "Need practice"}
                      </span>
                    </button>
                  );
                })}
              </span>
            </div>
          ))}
      </div>
    );
  };

  const renderCompanyIntel = (intel: CompanyIntel) => (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Company intel</p>
      <div className={styles.intelCard}>
        <h4 className={styles.intelTitle}>{intel.companyName}</h4>
        <div className={styles.intelRow}>
          <span className={styles.intelLabel}>Industry:</span>
          <span className={styles.intelValue}>{intel.industry}</span>
        </div>
        <div className={styles.intelRow}>
          <span className={styles.intelLabel}>Estimated size:</span>
          <span className={styles.intelValue}>{intel.sizeLabel}</span>
        </div>
        <p className={styles.intelHiring}>
          <strong>Typical hiring focus:</strong> {intel.typicalHiringFocus}
        </p>
        <p className={styles.demoNote}>
          Demo Mode: Company intel generated heuristically.
        </p>
      </div>
    </div>
  );

  const renderRoundMapping = (rounds: RoundMapping) => (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Expected round flow</p>
      <div className={styles.roundTimeline}>
        {rounds.map((round) => (
          <div key={round.id} className={styles.roundTimelineItem}>
            <div className={styles.roundDot} aria-hidden />
            <div className={styles.roundTimelineContent}>
              <p className={styles.roundTimelineTitle}>{round.title}</p>
              <p className={styles.roundWhy}>{round.whyItMatters}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRounds = (rounds: ChecklistRound[]) => {
    if (rounds.length === 0) return null;
    return (
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Round-wise preparation checklist</p>
        <div className={styles.roundList}>
          {rounds.map((round) => (
            <div key={round.id}>
              <p className={styles.roundBlockTitle}>{round.title}</p>
              <ul className={styles.bulletList}>
                {round.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPlan = (plan: SevenDayPlan) => {
    if (plan.length === 0) return null;
    return (
      <div className={styles.section}>
        <p className={styles.sectionTitle}>7-day focused plan</p>
        <div className={styles.planGrid}>
          {plan.map((day) => (
            <div key={day.dayLabel} className={styles.planDay}>
              <div className={styles.planDayLabel}>{day.dayLabel}</div>
              <div className={styles.planDayFocus}>{day.focus}</div>
              <p className={styles.planDayDetails}>{day.details}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderQuestions = (questions: string[]) => {
    if (questions.length === 0) return null;
    return (
      <div className={styles.section}>
        <p className={styles.sectionTitle}>10 likely interview questions</p>
        <ol className={styles.questionsList}>
          {questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </div>
    );
  };

  const buildPlanText = () => {
    if (!latestEntry) return "";
    return latestEntry.plan
      .map(
        (day) =>
          `${day.dayLabel} — ${day.focus}\n${day.details}`.trimEnd(),
      )
      .join("\n\n");
  };

  const buildChecklistText = () => {
    if (!latestEntry) return "";
    const lines: string[] = [];
    latestEntry.checklist.forEach((round) => {
      lines.push(round.title);
      round.items.forEach((item) => {
        lines.push(`- ${item}`);
      });
      lines.push("");
    });
    return lines.join("\n").trimEnd();
  };

  const buildQuestionsText = () => {
    if (!latestEntry) return "";
    return latestEntry.questions
      .map((q, index) => `${index + 1}. ${q}`)
      .join("\n");
  };

  const buildFullExportText = () => {
    if (!latestEntry) return "";
    const headerLines = [
      "Placement Readiness Analysis",
      latestEntry.company || latestEntry.role
        ? `${latestEntry.company || "Company"} — ${
            latestEntry.role || "Role"
          }`
        : "",
      `Score: ${latestEntry.readinessScore}/100`,
      "",
    ].filter(Boolean);

    const sections = [
      ...headerLines,
      "7-day plan",
      buildPlanText(),
      "",
      "Round-wise checklist",
      buildChecklistText(),
      "",
      "Likely questions",
      buildQuestionsText(),
    ];

    return sections.join("\n").trimEnd();
  };

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // Swallow clipboard errors; UI stays calm.
    }
  };

  const handleCopyPlan = () => {
    void copyToClipboard(buildPlanText());
  };

  const handleCopyChecklist = () => {
    void copyToClipboard(buildChecklistText());
  };

  const handleCopyQuestions = () => {
    void copyToClipboard(buildQuestionsText());
  };

  const handleDownloadTxt = () => {
    const text = buildFullExportText();
    if (!text) return;
    try {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const baseName =
        latestEntry?.company || latestEntry?.role || "placement-readiness";
      link.href = url;
      link.download = `${baseName.replace(/\s+/g, "-").toLowerCase()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Ignore download errors.
    }
  };

  const renderActionNext = () => {
    if (!latestEntry) return null;
    const skills = latestEntry.extractedSkills.allSkills;
    if (skills.length === 0) {
      return (
        <div className={styles.actionBox}>
          <p className={styles.actionTitle}>Action next</p>
          <p className={styles.actionSuggestion}>
            Start Day 1 plan now and keep notes on any topics that feel slow or fuzzy.
          </p>
        </div>
      );
    }
    const map = latestEntry.skillConfidenceMap ?? {};
    const weakSkills = skills.filter(
      (skill) => (map[skill] ?? "practice") === "practice",
    );
    const topWeak = weakSkills.slice(0, 3);

    return (
      <div className={styles.actionBox}>
        <p className={styles.actionTitle}>Action next</p>
        {topWeak.length > 0 ? (
          <>
            <div className={styles.actionWeakSkills}>
              {topWeak.map((skill) => (
                <span key={skill} className={styles.tag}>
                  {skill}
                </span>
              ))}
            </div>
            <p className={styles.actionSuggestion}>
              Focus these in your next session. Start Day 1 plan now.
            </p>
          </>
        ) : (
          <p className={styles.actionSuggestion}>
            You have marked all skills as confident. Start Day 1 plan now and keep a light revision
            loop.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <Card className={styles.formCard}>
          <header>
            <h3 className={styles.formHeaderTitle}>Analyze a Job Description</h3>
            <p className={styles.formHeaderSub}>
              Paste the JD, then generate skills, checklists, questions, and a readiness score –
              kept safely on this device.
            </p>
          </header>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formRowItem}>
                <Input
                  label="Company (optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Acme Corp"
                />
              </div>
              <div className={styles.formRowItem}>
                <Input
                  label="Role (optional)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., SDE 1"
                />
              </div>
            </div>
            <Textarea
              label="Job Description (required)"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full JD here. The platform detects stack, rounds, and likely questions without leaving your browser."
              required
            />
            {jdTooShort && (
              <p className={styles.jdWarning} role="status">
                This JD is too short to analyze deeply. Paste full JD for better output.
              </p>
            )}
            <div className={styles.analyzeActions}>
              <Button type="submit" disabled={!jdText.trim() || isSubmitting}>
                {isSubmitting ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </form>
        </Card>

        <div className={styles.resultsColumn}>
          <Card className={styles.resultsCard}>
            <div className={styles.resultsHeader}>
              <h3 className={styles.resultsTitle}>Results</h3>
              <div className={styles.scorePill}>
                <span className={styles.scoreValue}>
                  {latestEntry ? latestEntry.readinessScore : "--"}
                </span>{" "}
                / 100
              </div>
            </div>

            {latestEntry && (
              <div className={styles.exportRow}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.exportButton}
                  onClick={handleCopyPlan}
                >
                  Copy 7-day plan
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.exportButton}
                  onClick={handleCopyChecklist}
                >
                  Copy round checklist
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.exportButton}
                  onClick={handleCopyQuestions}
                >
                  Copy 10 questions
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.exportButton}
                  onClick={handleDownloadTxt}
                >
                  Download as TXT
                </Button>
              </div>
            )}

            {latestEntry ? (
              <>
                {latestEntry.company.trim() && latestEntry.companyIntel
                  ? renderCompanyIntel(latestEntry.companyIntel)
                  : null}
                {latestEntry.roundMapping && latestEntry.roundMapping.length > 0
                  ? renderRoundMapping(latestEntry.roundMapping)
                  : null}
                {renderSkillsSection()}
                {renderRounds(latestEntry.checklist)}
                {renderPlan(latestEntry.plan)}
                {renderQuestions(latestEntry.questions)}
                {renderActionNext()}
              </>
            ) : (
              <p className={styles.emptyState}>
                No analysis yet. Once you analyze a JD, the latest or selected history entry will
                appear here.
              </p>
            )}
          </Card>

          <Card className={styles.historyCard}>
            <div className={styles.historyHeaderRow}>
              <h3 className={styles.historyTitle}>History (this browser)</h3>
            </div>
            {skippedCorruptedCount > 0 && (
              <p className={styles.corruptedNotice} role="alert">
                {skippedCorruptedCount === 1
                  ? "One saved entry couldn't be loaded. Create a new analysis."
                  : "Some saved entries couldn't be loaded. Create a new analysis."}
              </p>
            )}
            {history.length === 0 ? (
              <p className={styles.emptyState}>
                Analyses you run will be stored locally so you can revisit them later – even after a
                refresh.
              </p>
            ) : (
              <ul className={styles.historyList}>
                {history.map((entry) => {
                  const created = new Date(entry.createdAt);
                  const labelCompany = entry.company || "Unnamed company";
                  const labelRole = entry.role || "Role not specified";
                  return (
                    <li key={entry.id}>
                      <button
                        type="button"
                        className={styles.historyItemButton}
                        onClick={() => selectFromHistory(entry.id)}
                      >
                        <div className={styles.historyItemMain}>
                          <span className={styles.historyCompanyRole}>
                            {labelCompany} — {labelRole}
                          </span>
                          <span className={styles.historyMeta}>
                            {created.toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                        <span className={styles.historyScore}>
                          {entry.readinessScore}
                          /100
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

