import { type ReactNode } from "react";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  topBar: ReactNode;
  contextHeader: ReactNode;
  primaryWorkspace: ReactNode;
  proofFooter: ReactNode;
}

export function PageLayout({
  topBar,
  contextHeader,
  primaryWorkspace,
  proofFooter,
}: PageLayoutProps) {
  return (
    <div className={styles.layout}>
      {topBar}
      {contextHeader}
      <div className={styles.content}>
        {primaryWorkspace}
      </div>
      {proofFooter}
    </div>
  );
}
