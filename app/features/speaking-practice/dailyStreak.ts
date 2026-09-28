const storageKey = "randomword.daily-streak.v1";
let memoryFallback: StoredStreak | null = null;

type StoredStreak = {
  version: 1;
  lastCompletedDate: string;
  currentStreak: number;
  completedToday: number;
  longestStreak: number;
  totalCompleted: number;
};

export type StreakCompletion = {
  streak: number;
  completedToday: number;
};

export type DailyStreakStatus = StreakCompletion & {
  activeToday: boolean;
  longestStreak: number;
  totalCompleted: number;
  lastActiveDate: string | null;
};

const inactiveStatus: DailyStreakStatus = {
  streak: 0,
  completedToday: 0,
  activeToday: false,
  longestStreak: 0,
  totalCompleted: 0,
  lastActiveDate: null,
};
let cachedStatus = inactiveStatus;

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeStoredStreak(value: unknown): StoredStreak | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<StoredStreak>;
  if (record.version !== 1
    || typeof record.lastCompletedDate !== "string"
    || !/^\d{4}-\d{2}-\d{2}$/.test(record.lastCompletedDate)
    || !Number.isSafeInteger(record.currentStreak)
    || (record.currentStreak ?? 0) < 1
    || !Number.isSafeInteger(record.completedToday)
    || (record.completedToday ?? 0) < 1) return null;

  return {
    version: 1,
    lastCompletedDate: record.lastCompletedDate,
    currentStreak: record.currentStreak!,
    completedToday: record.completedToday!,
    longestStreak: Number.isSafeInteger(record.longestStreak) && (record.longestStreak ?? 0) > 0
      ? record.longestStreak!
      : record.currentStreak!,
    totalCompleted: Number.isSafeInteger(record.totalCompleted) && (record.totalCompleted ?? 0) >= 0
      ? record.totalCompleted!
      : record.completedToday!,
  };
}

function readStoredStreak(): StoredStreak | null {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return memoryFallback;
    return normalizeStoredStreak(JSON.parse(saved)) ?? memoryFallback;
  } catch {
    return memoryFallback;
  }
}

export function getDailyStreakSnapshot(): DailyStreakStatus {
  const record = readStoredStreak();
  if (!record) return setCachedStatus(inactiveStatus);

  const now = new Date();
  const today = localDateKey(now);
  const yesterday = localDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  const isToday = record.lastCompletedDate === today;
  const isYesterday = record.lastCompletedDate === yesterday;
  const nextStatus: DailyStreakStatus = {
    streak: isToday || isYesterday ? record.currentStreak : 0,
    completedToday: isToday ? record.completedToday : 0,
    activeToday: isToday,
    longestStreak: record.longestStreak,
    totalCompleted: record.totalCompleted,
    lastActiveDate: record.lastCompletedDate,
  };

  return setCachedStatus(nextStatus);
}

function setCachedStatus(status: DailyStreakStatus) {
  if (cachedStatus.streak === status.streak
    && cachedStatus.completedToday === status.completedToday
    && cachedStatus.activeToday === status.activeToday
    && cachedStatus.longestStreak === status.longestStreak
    && cachedStatus.totalCompleted === status.totalCompleted
    && cachedStatus.lastActiveDate === status.lastActiveDate) return cachedStatus;
  cachedStatus = status;
  return cachedStatus;
}

export function getServerDailyStreakSnapshot() {
  return inactiveStatus;
}

export function subscribeToDailyStreak(callback: () => void) {
  const refresh = () => callback();
  let midnightTimer = 0;
  const refreshAtNextLocalDay = () => {
    const nextLocalDay = new Date();
    nextLocalDay.setHours(24, 0, 0, 100);
    midnightTimer = window.setTimeout(() => {
      callback();
      refreshAtNextLocalDay();
    }, Math.max(1000, nextLocalDay.getTime() - Date.now()));
  };

  window.addEventListener("randomword:streak-updated", refresh);
  window.addEventListener("storage", refresh);
  window.addEventListener("focus", refresh);
  document.addEventListener("visibilitychange", refresh);
  refreshAtNextLocalDay();
  return () => {
    window.clearTimeout(midnightTimer);
    window.removeEventListener("randomword:streak-updated", refresh);
    window.removeEventListener("storage", refresh);
    window.removeEventListener("focus", refresh);
    document.removeEventListener("visibilitychange", refresh);
  };
}

export function recordOneMinuteCompletion(date = new Date()): StreakCompletion {
  const today = localDateKey(date);
  const previousDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
  const yesterday = localDateKey(previousDate);
  const previous = readStoredStreak();

  let streak: number;
  let completedToday: number;
  if (previous?.lastCompletedDate === today) {
    streak = previous.currentStreak;
    completedToday = previous.completedToday + 1;
  } else {
    streak = previous?.lastCompletedDate === yesterday ? previous.currentStreak + 1 : 1;
    completedToday = 1;
  }

  const updated: StoredStreak = {
    version: 1,
    lastCompletedDate: today,
    currentStreak: streak,
    completedToday,
    longestStreak: Math.max(previous?.longestStreak ?? 0, streak),
    totalCompleted: (previous?.totalCompleted ?? 0) + 1,
  };

  memoryFallback = updated;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(updated));
  } catch {
    // The celebration still works when browser storage is disabled or full.
  }

  window.dispatchEvent(new Event("randomword:streak-updated"));

  return { streak, completedToday };
}
