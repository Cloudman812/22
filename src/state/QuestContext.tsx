import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultState,
  loadQuestState,
  QUEST_STEP_COUNT,
  resetQuestState,
  saveQuestState,
  type QuestState,
} from "./questStorage";

type QuestApi = {
  state: QuestState;
  completeIntro: () => void;
  completeStep: (stepNumber: number) => void;
  reset: () => void;
};

const QuestContext = createContext<QuestApi | null>(null);

export function QuestProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuestState>(() => loadQuestState());

  const completeIntro = useCallback(() => {
    setState((s) => {
      const next = { ...s, introDone: true };
      saveQuestState(next);
      return next;
    });
  }, []);

  const completeStep = useCallback((stepNumber: number) => {
    const n = Math.min(QUEST_STEP_COUNT, Math.max(1, stepNumber));
    setState((s) => {
      const next = {
        ...s,
        completedThrough: Math.max(s.completedThrough, n),
      };
      saveQuestState(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    resetQuestState();
    setState(defaultState());
  }, []);

  const api = useMemo(
    () => ({
      state,
      completeIntro,
      completeStep,
      reset,
    }),
    [state, completeIntro, completeStep, reset],
  );

  return (
    <QuestContext.Provider value={api}>{children}</QuestContext.Provider>
  );
}

export function useQuest(): QuestApi {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuest requires QuestProvider");
  return ctx;
}
