import type { SystemMessagesFile } from "../content/types";

/** Детерминированный выбор по номеру шага (и типу). */
export function pickBeforeIntro(
  pack: SystemMessagesFile,
  stepNumber: number,
): string {
  const i = Math.abs((stepNumber * 11 + 4) % pack.beforeIntro.length);
  return pack.beforeIntro[i]!;
}

export function pickTooEarly(
  pack: SystemMessagesFile,
  stepNumber: number,
): string {
  const i = Math.abs((stepNumber * 13 + 2) % pack.tooEarly.length);
  return pack.tooEarly[i]!;
}
