/** Количество малых шагов квеста (QR 01…NN). */
export const QUEST_STEP_COUNT = 11;

/** Смена ключа при несовместимом изменении числа шагов (старый прогресс не подмешивается). */
export const QUEST_STORAGE_KEY = "22qr.quest.v2";

export type QuestState = {
  introDone: boolean;
  /** Максимальный номер шага, по которому нажали «Дальше» (0…QUEST_STEP_COUNT). */
  completedThrough: number;
  /** Досмотрели видео на /intro — после этого показываем ProgressBar до конца сессии. */
  introVideoSeen: boolean;
};

export function defaultState(): QuestState {
  return { introDone: false, completedThrough: 0, introVideoSeen: false };
}

export function loadQuestState(): QuestState {
  try {
    const raw = localStorage.getItem(QUEST_STORAGE_KEY);
    if (!raw) return defaultState();
    const o = JSON.parse(raw) as Record<string, unknown>;
    const completedThrough = Math.min(
      QUEST_STEP_COUNT,
      Math.max(0, Number(o.completedThrough) || 0),
    );
    const introDone = Boolean(o.introDone);
    const hasIntroVideoSeenKey = Object.prototype.hasOwnProperty.call(o, "introVideoSeen");
    const legacyProgress = introDone || completedThrough > 0;
    let introVideoSeen = Boolean(o.introVideoSeen);
    /* Старые сохранения без поля: если квест уже начат — считаем видео пройденным один раз */
    if (!hasIntroVideoSeenKey && legacyProgress) {
      introVideoSeen = true;
    }
    const next: QuestState = { introDone, completedThrough, introVideoSeen };
    if (!hasIntroVideoSeenKey && legacyProgress) {
      saveQuestState(next);
    }
    return next;
  } catch {
    return defaultState();
  }
}

export function saveQuestState(state: QuestState): void {
  localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(state));
}

export function resetQuestState(): void {
  localStorage.removeItem(QUEST_STORAGE_KEY);
}
