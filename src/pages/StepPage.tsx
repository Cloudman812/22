import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadStepDoc } from "../content/loadStep";
import systemPack from "../content/system-messages.json";
import type { StepDoc, SystemMessagesFile } from "../content/types";
import { getStepAccess } from "../lib/stepAccess";
import { pickBeforeIntro, pickTooEarly } from "../lib/pickSystemMessage";
import { useQuest } from "../state/QuestContext";
import { QUEST_STEP_COUNT } from "../state/questStorage";
import { StepContent } from "./StepContent";
import { StubScreen } from "./StubScreen";

const messages = systemPack as SystemMessagesFile;

function parseStepId(raw: string | undefined): number | null {
  if (!raw || !/^\d{2}$/.test(raw)) return null;
  const n = parseInt(raw, 10);
  if (n < 1 || n > QUEST_STEP_COUNT) return null;
  return n;
}

export function StepPage() {
  const { stepId } = useParams();
  const stepNumber = parseStepId(stepId);
  const { state, completeStep } = useQuest();

  const [doc, setDoc] = useState<StepDoc | null>(null);
  const [loadError, setLoadError] = useState(false);

  const access = useMemo(() => {
    if (stepNumber === null) return null;
    return getStepAccess({
      introDone: state.introDone,
      completedThrough: state.completedThrough,
      stepNumber,
    });
  }, [stepNumber, state.introDone, state.completedThrough]);

  useEffect(() => {
    setDoc(null);
    setLoadError(false);
  }, [stepNumber]);

  useEffect(() => {
    if (
      stepNumber === null ||
      !access ||
      (access.kind !== "active" && access.kind !== "replay")
    ) {
      return;
    }
    let cancelled = false;
    loadStepDoc(stepNumber)
      .then((d) => {
        if (cancelled) return;
        if (!d) setLoadError(true);
        else setDoc(d);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [stepNumber, access]);

  if (stepNumber === null) {
    return (
      <article className="l-glass" style={{ padding: "1.25rem" }}>
        <p>Некорректный адрес шага.</p>
        <p style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
          <Link to="/intro">К вводу</Link>
        </p>
      </article>
    );
  }

  if (!access) return null;

  if (access.kind === "before_intro") {
    return (
      <StubScreen
        tag="Сначала ввод"
        title="Сначала большой код"
        bodyMd={pickBeforeIntro(messages, stepNumber)}
      />
    );
  }

  if (access.kind === "too_early") {
    return (
      <StubScreen
        tag="Не на очереди"
        title="Пока рано для этого кода"
        bodyMd={pickTooEarly(messages, stepNumber)}
      />
    );
  }

  if (loadError || !doc) {
    return (
      <article className="l-glass" style={{ padding: "1.25rem" }}>
        <p>{loadError ? "Не удалось загрузить шаг." : "Загрузка…"}</p>
      </article>
    );
  }

  const mode = access.kind === "active" ? "active" : "replay";

  return (
    <StepContent
      stepNumber={stepNumber}
      doc={doc}
      mode={mode}
      onComplete={() => completeStep(stepNumber)}
    />
  );
}
