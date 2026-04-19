import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { IntroPage } from "./pages/IntroPage";
import { QrLinksPage } from "./pages/QrLinksPage";
import { StepPage } from "./pages/StepPage";
import { QuestProvider } from "./state/QuestContext";

function routerBasename(): string | undefined {
  const raw = import.meta.env.BASE_URL;
  const trimmed = raw.endsWith("/") ? raw.slice(0, -1) : raw;
  return trimmed === "" ? undefined : trimmed;
}

export default function App() {
  return (
    <QuestProvider>
      <BrowserRouter basename={routerBasename()}>
        <Routes>
          <Route path="/" element={<Navigate to="/intro" replace />} />
          <Route element={<AppShell />}>
            <Route path="/intro" element={<IntroPage />} />
            <Route path="/step/:stepId" element={<StepPage />} />
            <Route path="/lab/qr" element={<QrLinksPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/intro" replace />} />
        </Routes>
      </BrowserRouter>
    </QuestProvider>
  );
}
