import { QUEST_STEP_COUNT } from "../state/questStorage";

function matchQuestPath(pathNoTrailing: string): string | null {
  const p = pathNoTrailing.startsWith("/") ? pathNoTrailing : `/${pathNoTrailing}`;
  if (p === "/intro") return "/intro";

  const stepMatch = p.match(/^\/step\/(\d{1,2})$/);
  if (!stepMatch) return null;

  const num = parseInt(stepMatch[1], 10);
  if (num < 1 || num > QUEST_STEP_COUNT) return null;

  return `/step/${String(num).padStart(2, "0")}`;
}

/**
 * Из строки QR (полный URL или путь) извлекает маршрут приложения `/intro` или `/step/NN`.
 * Хост в QR игнорируется — подходит ссылка с любого домена (главное совпадение пути).
 */
export function parseQuestQrToPath(raw: string): string | null {
  const trimmed = raw.trim();

  try {
    const u = new URL(trimmed);
    let p = u.pathname.replace(/\/+$/, "") || "";
    if (p === "") return null;
    return matchQuestPath(p);
  } catch {
    if (!trimmed.startsWith("/")) return null;
    const p = (trimmed.split(/[?#]/)[0] ?? "").replace(/\/+$/, "") || "";
    if (p === "") return null;
    return matchQuestPath(p);
  }
}
