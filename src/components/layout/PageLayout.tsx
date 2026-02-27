import { type ReactNode } from "react";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  topBar: ReactNode;
  contextHeader: ReactNode;
  primaryWorkspace: ReactNode;
  secondaryPanel: ReactNode;
  proofFooter: ReactNode;
}

export function PageLayout({
  topBar,
  contextHeader,
  primaryWorkspace,
  secondaryPanel,
  proofFooter,
}: PageLayoutProps) {
  return (
    <div className={styles.layout}>
      {topBar}
      {contextHeader}
      <div className={styles.content}>
        {primaryWorkspace}
        {secondaryPanel}
      </div>
      {proofFooter}
    </div>
  );
}
