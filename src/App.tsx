import { TopBar } from "./components/layout/TopBar";
import { ContextHeader } from "./components/layout/ContextHeader";
import { PrimaryWorkspace } from "./components/layout/PrimaryWorkspace";
import { SecondaryPanel } from "./components/layout/SecondaryPanel";
import { ProofFooter } from "./components/layout/ProofFooter";
import { PageLayout } from "./components/layout/PageLayout";
import { Card } from "./components/ui/Card";

function App() {
  return (
    <PageLayout
      topBar={
        <TopBar
          projectName="KodNest"
          currentStep={1}
          totalSteps={5}
          status="In Progress"
        />
      }
      contextHeader={
        <ContextHeader
          headline="Placement Readiness"
          subtext="Structured steps to build and ship your project with proof."
        />
      }
      primaryWorkspace={
        <PrimaryWorkspace>
          <Card>
            <p className="kn-text-block" style={{ margin: 0 }}>
              Primary workspace. Main product interaction will live here.
            </p>
          </Card>
        </PrimaryWorkspace>
      }
      secondaryPanel={
        <SecondaryPanel
          stepExplanation="Complete this step to move forward. Use the prompt below if needed."
          promptText="Sample prompt text — copy and use in your builder."
        />
      }
      proofFooter={<ProofFooter />}
    />
  );
}

export default App;
