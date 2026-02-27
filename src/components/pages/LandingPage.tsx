import { useNavigate } from "react-router-dom";
import { Code2, Video, LineChart } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import styles from "./LandingPage.module.css";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroHeading}>Ace Your Placement</h2>
          <p className={styles.heroSubheading}>
            Practice, assess, and prepare for your dream job with a focused,
            calm workflow.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/dashboard")}
            className={styles.heroButton}
          >
            Get Started
          </Button>
        </div>
      </section>

      <section className={styles.featuresSection} aria-label="Key capabilities">
        <div className={styles.featuresGrid}>
          <Card>
            <div className={styles.featureCard}>
              <Code2 className={styles.icon} aria-hidden="true" />
              <h3 className={styles.featureTitle}>Practice Problems</h3>
              <p className={styles.featureText}>
                Work through curated questions aligned with real interviews.
              </p>
            </div>
          </Card>

          <Card>
            <div className={styles.featureCard}>
              <Video className={styles.icon} aria-hidden="true" />
              <h3 className={styles.featureTitle}>Mock Interviews</h3>
              <p className={styles.featureText}>
                Rehearse in structured sessions that mirror actual hiring loops.
              </p>
            </div>
          </Card>

          <Card>
            <div className={styles.featureCard}>
              <LineChart className={styles.icon} aria-hidden="true" />
              <h3 className={styles.featureTitle}>Track Progress</h3>
              <p className={styles.featureText}>
                See where you are confident and where to focus next.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} KodNest Premium Build System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

