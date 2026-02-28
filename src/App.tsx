import { Routes, Route, Navigate } from "react-router-dom";
import { ContextHeader } from "./components/layout/ContextHeader";
import { PrimaryWorkspace } from "./components/layout/PrimaryWorkspace";
import { ProofFooter } from "./components/layout/ProofFooter";
import { PageLayout } from "./components/layout/PageLayout";
import { LandingPage } from "./components/pages/LandingPage";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { DashboardHome } from "./components/pages/DashboardHome";
import { PracticePage } from "./components/pages/PracticePage";
import { AssessmentsPage } from "./components/pages/AssessmentsPage";
import { ResourcesPage } from "./components/pages/ResourcesPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { PrpTestChecklistPage } from "./components/pages/prp/PrpTestChecklistPage";
import { PrpShipPage } from "./components/pages/prp/PrpShipPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageLayout
            contextHeader={
              <ContextHeader
                headline="Ace Your Placement"
                subtext="Practice, assess, and prepare for your dream job with a calm, structured system."
              />
            }
            primaryWorkspace={
              <PrimaryWorkspace>
                <LandingPage />
              </PrimaryWorkspace>
            }
            proofFooter={<ProofFooter />}
          />
        }
      />

      <Route
        path="/dashboard"
        element={
          <PageLayout
            contextHeader={
              <ContextHeader
                headline="Placement Prep"
                subtext="Work through practice, assessments, and resources with clear proof of progress."
              />
            }
            primaryWorkspace={
              <PrimaryWorkspace>
                <DashboardLayout />
              </PrimaryWorkspace>
            }
            proofFooter={<ProofFooter />}
          />
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="practice" element={<PracticePage />} />
        <Route path="assessments" element={<AssessmentsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="/prp/07-test"
        element={
          <PageLayout
            contextHeader={
              <ContextHeader
                headline="PRP Test Checklist"
                subtext="Mark off the built-in tests. Shipping is locked until all are passed."
              />
            }
            primaryWorkspace={
              <PrimaryWorkspace>
                <PrpTestChecklistPage />
              </PrimaryWorkspace>
            }
            proofFooter={<ProofFooter />}
          />
        }
      />

      <Route
        path="/prp/08-ship"
        element={
          <PageLayout
            contextHeader={
              <ContextHeader
                headline="Ship Gate"
                subtext="This step unlocks only after all built-in tests are checked."
              />
            }
            primaryWorkspace={
              <PrimaryWorkspace>
                <PrpShipPage />
              </PrimaryWorkspace>
            }
            proofFooter={<ProofFooter />}
          />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
