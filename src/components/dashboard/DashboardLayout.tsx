import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutPanelLeft,
  Code2,
  ClipboardCheck,
  Library,
  User,
} from "lucide-react";
import styles from "./DashboardLayout.module.css";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutPanelLeft },
  { to: "/dashboard/practice", label: "Practice", icon: Code2 },
  { to: "/dashboard/assessments", label: "Assessments", icon: ClipboardCheck },
  { to: "/dashboard/resources", label: "Resources", icon: Library },
  { to: "/dashboard/profile", label: "Profile", icon: User },
] as const;

export function DashboardLayout() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Placement navigation">
        <div className={styles.sidebarHeader}>
          <span className={styles.productMark}>PP</span>
          <span className={styles.productName}>Placement Prep</span>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ""}`.trim()
                }
                end={item.to === "/dashboard"}
              >
                <Icon className={styles.navIcon} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className={styles.mainColumn}>
        <header className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <h2 className={styles.headerTitle}>Placement Prep</h2>
            <p className={styles.headerSubtitle}>
              Your structured workspace for interview readiness.
            </p>
          </div>
          <div className={styles.avatar} aria-label="User profile placeholder" />
        </header>

        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

