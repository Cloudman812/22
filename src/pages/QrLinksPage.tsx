import { useMemo } from "react";
import { QUEST_STEP_COUNT } from "../state/questStorage";

const STEP_PATHS = Array.from({ length: QUEST_STEP_COUNT }, (_, i) => {
  const n = i + 1;
  return `/step/${String(n).padStart(2, "0")}`;
});

export function QrLinksPage() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const base = import.meta.env.BASE_URL;

  const rows = useMemo(() => {
    const list: { label: string; path: string }[] = [
      { label: "Большой QR · ввод", path: "/intro" },
      ...STEP_PATHS.map((path, i) => ({
        label: `Малый QR · шаг ${i + 1}`,
        path,
      })),
    ];
    return list.map(({ label, path }) => {
      const rel = path.replace(/^\//, "");
      const href = `${origin}${base}${rel}`;
      return {
        label,
        href,
        path,
      };
    });
  }, [origin, base]);

  return (
    <article className="l-glass" style={{ padding: "1.35rem 1.25rem" }}>
      <p
        style={{
          fontFamily: "var(--font-brand)",
          fontSize: "0.72rem",
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          color: "rgba(28, 29, 38, 0.45)",
          marginBottom: "0.65rem",
        }}
      >
        Тест без печати
      </p>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.45rem",
          fontWeight: 600,
          margin: "0 0 0.75rem",
        }}
      >
        Все маршруты как после сканирования QR
      </h2>
      <p
        style={{
          fontSize: "0.86rem",
          lineHeight: 1.55,
          color: "var(--lum-muted)",
          marginBottom: "1rem",
        }}
      >
        Открой любую ссылку — поведение то же, что при переходе по распечатанному коду.
        Логика очереди и заглушек сохраняется (проверь после прохождения ввода и шагов).
      </p>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.55rem",
          maxHeight: "55vh",
          overflowY: "auto",
        }}
      >
        {rows.map(({ label, href, path }) => (
          <li key={path}>
            <a
              href={href}
              style={{
                display: "block",
                padding: "0.65rem 0.75rem",
                borderRadius: "12px",
                border: "1px solid rgba(91, 75, 219, 0.18)",
                background: "rgba(91, 75, 219, 0.04)",
                color: "var(--lum-ink)",
                textDecoration: "none",
                fontSize: "0.84rem",
              }}
            >
              <span style={{ fontWeight: 600, display: "block" }}>{label}</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "var(--lum-muted)",
                  wordBreak: "break-all",
                }}
              >
                {href}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
