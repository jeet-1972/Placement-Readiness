import { useState, type FormEvent } from "react";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { useAnalysis } from "../../analysis/AnalysisContext";
import { type ChecklistRound, type SevenDayPlan } from "../../analysis/analysisEngine";
import styles from "./AssessmentsPage.module.css";

export function AssessmentsPage() {
  const { analyze, latestEntry, history, selectFromHistory } = useAnalysis();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const { extractedSkills } = latestEntry;

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
        {(Object.keys(extractedSkills.byCategory) as (keyof typeof extractedSkills.byCategory)[])
          .filter((cat) => extractedSkills.byCategory[cat].length > 0)
          .map((cat) => (
            <div key={cat} className={styles.categoryRow}>
              <span className={styles.categoryLabel}>{cat}</span>
              <span className={styles.tagGroup}>
                {extractedSkills.byCategory[cat].map((skill) => (
                  <span key={skill} className={styles.tag}>
                    {skill}
                  </span>
                ))}
              </span>
            </div>
          ))}
      </div>
    );
  };

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
              label="Job Description"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full JD here. The platform detects stack, rounds, and likely questions without leaving your browser."
            />
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

            {latestEntry ? (
              <>
                {renderSkillsSection()}
                {renderRounds(latestEntry.checklist)}
                {renderPlan(latestEntry.plan)}
                {renderQuestions(latestEntry.questions)}
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

