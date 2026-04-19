import type { StepDoc } from "./types";

const loaders = import.meta.glob<{ default: StepDoc }>("./steps/*.json");

export async function loadStepDoc(stepNumber: number): Promise<StepDoc | null> {
  const pad = String(stepNumber).padStart(2, "0");
  const path = `./steps/${pad}.json`;
  const loader = loaders[path];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
