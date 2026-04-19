import { Link, Outlet } from "react-router-dom";
import { DevReset } from "../components/DevReset";
import { ProgressBar } from "../components/ProgressBar";
import { useQuest } from "../state/QuestContext";
import styles from "./AppShell.module.css";

export function AppShell() {
  const { state } = useQuest();

  return (
    <>
      <div className="l-noise" aria-hidden />
      <div className={`l-shell ${styles.inner}`}>
        <ProgressBar
          introDone={state.introDone}
          completedThrough={state.completedThrough}
        />
        <Outlet />
        <p className="l-footerLink">
          <Link to="/lab/qr">Все ссылки для теста (как QR)</Link>
        </p>
      </div>
      <DevReset />
    </>
  );
}
