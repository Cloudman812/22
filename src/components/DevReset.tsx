import { QUEST_STORAGE_KEY } from "../state/questStorage";

export function DevReset() {
  if (!import.meta.env.DEV) return null;

  return (
    <div className="l-devReset">
      <button
        type="button"
        onClick={() => {
          localStorage.removeItem(QUEST_STORAGE_KEY);
          window.location.reload();
        }}
      >
        Сбросить прогресс (dev)
      </button>
    </div>
  );
}
