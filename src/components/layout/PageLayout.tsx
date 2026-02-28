import { type ReactNode } from "react";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  contextHeader: ReactNode;
  primaryWorkspace: ReactNode;
  proofFooter: ReactNode;
}

export function PageLayout({
  contextHeader,
  primaryWorkspace,
  proofFooter,
}: PageLayoutProps) {
  return (
    <div className={styles.layout}>
      {contextHeader}
      <div className={styles.content}>
        {primaryWorkspace}
      </div>
      {proofFooter}
    </div>
  );
}
