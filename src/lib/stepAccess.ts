export type StepAccess =
  | { kind: "before_intro" }
  | { kind: "too_early" }
  | { kind: "active" }
  | { kind: "replay" };

export function getStepAccess(args: {
  introDone: boolean;
  completedThrough: number;
  stepNumber: number;
}): StepAccess {
  const { introDone, completedThrough, stepNumber } = args;
  if (!introDone) return { kind: "before_intro" };
  const nextRequired = completedThrough + 1;
  if (stepNumber > nextRequired) return { kind: "too_early" };
  if (stepNumber === nextRequired) return { kind: "active" };
  return { kind: "replay" };
}
