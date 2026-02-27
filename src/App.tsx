import { Routes, Route, Navigate } from "react-router-dom";
import { TopBar } from "./components/layout/TopBar";
import { ContextHeader } from "./components/layout/ContextHeader";
import { PrimaryWorkspace } from "./components/layout/PrimaryWorkspace";
import { SecondaryPanel } from "./components/layout/SecondaryPanel";
import { ProofFooter } from "./components/layout/ProofFooter";
import { PageLayout } from "./components/layout/PageLayout";
import { LandingPage } from "./components/pages/LandingPage";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { DashboardHome } from "./components/pages/DashboardHome";
import { PracticePage } from "./components/pages/PracticePage";
import { AssessmentsPage } from "./components/pages/AssessmentsPage";
import { ResourcesPage } from "./components/pages/ResourcesPage";
import { ProfilePage } from "./components/pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageLayout
            topBar={
              <TopBar
                projectName="KodNest Premium Build System"
                currentStep={0}
                totalSteps={5}
                status="In Progress"
              />
            }
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
            secondaryPanel={
              <SecondaryPanel
                stepExplanation="Use this workspace to understand how KodNest structures your placement preparation journey."
                promptText="Describe your current placement target and preferred tech stack."
              />
            }
            proofFooter={<ProofFooter />}
          />
        }
      />

      <Route
        path="/dashboard"
        element={
          <PageLayout
            topBar={
              <TopBar
                projectName="KodNest Premium Build System"
                currentStep={1}
                totalSteps={5}
                status="In Progress"
              />
            }
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
            secondaryPanel={
              <SecondaryPanel
                stepExplanation="Navigate the sections on the left to structure your preparation."
                promptText="Outline the skills you want to strengthen before your next interview."
              />
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
