import { type ReactNode } from "react";
import styles from "./PrimaryWorkspace.module.css";

interface PrimaryWorkspaceProps {
  children: ReactNode;
}

export function PrimaryWorkspace({ children }: PrimaryWorkspaceProps) {
  return <main className={styles.workspace} role="main">{children}</main>;
}
