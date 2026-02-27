import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import styles from "./DashboardHome.module.css";

const READINESS_SCORE = 72;
const READINESS_MAX = 100;
const CIRCLE_R = 72;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;

const skillData = [
  { subject: "DSA", value: 75, fullMark: 100 },
  { subject: "System Design", value: 60, fullMark: 100 },
  { subject: "Communication", value: 80, fullMark: 100 },
  { subject: "Resume", value: 85, fullMark: 100 },
  { subject: "Aptitude", value: 70, fullMark: 100 },
];

const weeklyActivityByDay = [true, true, false, true, true, false, true]; // Mon–Sun

const assessments = [
  { title: "DSA Mock Test", when: "Tomorrow, 10:00 AM" },
  { title: "System Design Review", when: "Wed, 2:00 PM" },
  { title: "HR Interview Prep", when: "Friday, 11:00 AM" },
];

export function DashboardHome() {
  const readinessDash = (READINESS_SCORE / READINESS_MAX) * CIRCLE_CIRCUMFERENCE;

  return (
    <div
      className={styles.grid}
      style={
        {
          "--readiness-dash": `${readinessDash}`,
        } as React.CSSProperties
      }
    >
      {/* 1. Overall Readiness */}
      <Card className={styles.readinessCard}>
        <h3 className={styles.cardTitle}>Overall Readiness</h3>
        <div className={styles.readinessCircleWrap}>
          <svg
            className={styles.readinessSvg}
            viewBox="0 0 160 160"
            aria-hidden
          >
            <circle
              className={styles.readinessBg}
              cx={80}
              cy={80}
              r={CIRCLE_R}
            />
            <circle
              className={styles.readinessProgress}
              cx={80}
              cy={80}
              r={CIRCLE_R}
            />
          </svg>
          <div className={styles.readinessCenter}>
            <span className={styles.readinessScore}>{READINESS_SCORE}</span>
            <span className={styles.readinessLabel}>Readiness Score</span>
          </div>
        </div>
      </Card>

      {/* 2. Skill Breakdown */}
      <Card className={styles.skillCard}>
        <h3 className={styles.cardTitle}>Skill Breakdown</h3>
        <div className={styles.radarWrap}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={skillData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid stroke="rgba(17, 17, 17, 0.12)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 11, fill: "var(--color-text)" }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "var(--color-text)", opacity: 0.6 }}
                tickCount={4}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="var(--color-accent)"
                fill="var(--color-accent)"
                fillOpacity={0.35}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 3. Continue Practice */}
      <Card className={styles.continueCard}>
        <h3 className={styles.cardTitle}>Continue Practice</h3>
        <span className={styles.continueTopic}>Dynamic Programming</span>
        <div className={styles.continueProgressWrap}>
          <div className={styles.continueProgressBar}>
            <div
              className={styles.continueProgressFill}
              style={{ width: "30%" }}
            />
          </div>
          <span>3/10 completed</span>
        </div>
        <div className={styles.continueActions}>
          <Button>Continue</Button>
        </div>
      </Card>

      {/* 4. Weekly Goals */}
      <Card className={styles.goalsCard}>
        <h3 className={styles.cardTitle}>Weekly Goals</h3>
        <p className={styles.goalsSummary}>Problems Solved: 12/20 this week</p>
        <div className={styles.goalsProgressBar}>
          <div
            className={styles.goalsProgressFill}
            style={{ width: "60%" }}
          />
        </div>
        <div className={styles.daysRow}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
            <div key={day} className={styles.dayCell}>
              <div
                className={`${styles.dayCircle} ${weeklyActivityByDay[i] ? styles.filled : ""}`}
                aria-label={weeklyActivityByDay[i] ? `${day}: activity` : `${day}: no activity`}
              />
              <span className={styles.dayLabel}>{day}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. Upcoming Assessments */}
      <Card className={styles.assessmentsCard}>
        <h3 className={styles.cardTitle}>Upcoming Assessments</h3>
        <ul className={styles.assessmentsList}>
          {assessments.map((item) => (
            <li key={item.title} className={styles.assessmentItem}>
              <span className={styles.assessmentTitle}>{item.title}</span>
              <span className={styles.assessmentTime}>{item.when}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
