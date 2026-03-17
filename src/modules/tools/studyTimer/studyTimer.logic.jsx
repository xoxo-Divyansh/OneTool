export const studyTimerDefaults = {
  focusMinutes: 25,
  breakMinutes: 5,
  goalSessions: 4,
};

const STORAGE_KEY = "onetool.studyTimer.sessions";
const TIMER_KEY = "onetool.studyTimer.timer";

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function clampMinutes(value, min = 1, max = 90) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

export function loadSessionState() {
  const today = getTodayKey();

  if (typeof window === "undefined") {
    return { count: 0, date: today };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { count: 0, date: today };
    }

    const parsed = JSON.parse(raw);
    if (parsed?.date !== today) {
      return { count: 0, date: today };
    }

    return {
      count: Number(parsed?.count) || 0,
      date: today,
    };
  } catch {
    return { count: 0, date: today };
  }
}

export function saveSessionState(count) {
  if (typeof window === "undefined") return;

  const payload = {
    count,
    date: getTodayKey(),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage errors
  }
}

export function loadTimerState() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(TIMER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveTimerState(state) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(TIMER_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function clearTimerState() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(TIMER_KEY);
  } catch {
    // ignore storage errors
  }
}

export function getInitialTimerSnapshot(defaults) {
  const safeDefaults = defaults ?? studyTimerDefaults;
  const sessionState = loadSessionState();
  const savedTimer = loadTimerState();

  const focusMinutes = clampMinutes(
    Number(savedTimer?.focusMinutes ?? safeDefaults.focusMinutes),
    5,
    90,
  );
  const breakMinutes = clampMinutes(
    Number(savedTimer?.breakMinutes ?? safeDefaults.breakMinutes),
    3,
    30,
  );
  const mode = savedTimer?.mode === "break" ? "break" : "focus";
  const fallbackTime = mode === "focus" ? focusMinutes * 60 : breakMinutes * 60;
  let sessionsCompleted = sessionState.count;
  let persist = null;

  if (!savedTimer) {
    return {
      state: {
        mode,
        status: "idle",
        focusMinutes,
        breakMinutes,
        timeLeft: fallbackTime,
        endTime: null,
        sessionsCompleted,
        message: "Ready to focus when you are.",
      },
      persist,
    };
  }

  if (savedTimer.status === "running" && savedTimer.endTime) {
    const remaining = Math.ceil((savedTimer.endTime - Date.now()) / 1000);
    if (remaining > 0) {
      return {
        state: {
          mode,
          status: "running",
          focusMinutes,
          breakMinutes,
          timeLeft: remaining,
          endTime: savedTimer.endTime,
          sessionsCompleted,
          message:
            mode === "focus"
              ? "Stay focused. You are building momentum."
              : "Break time. Recharge.",
        },
        persist,
      };
    }

    if (mode === "focus") {
      const nextTime = breakMinutes * 60;
      persist = {
        timerState: {
          status: "idle",
          mode: "break",
          timeLeft: nextTime,
          focusMinutes,
          breakMinutes,
        },
      };
      return {
        state: {
          mode: "break",
          status: "idle",
          focusMinutes,
          breakMinutes,
          timeLeft: nextTime,
          endTime: null,
          sessionsCompleted,
          message: "Focus complete! Time for a break.",
        },
        persist,
      };
    }

    sessionsCompleted += 1;
    const nextTime = focusMinutes * 60;
    persist = {
      timerState: {
        status: "idle",
        mode: "focus",
        timeLeft: nextTime,
        focusMinutes,
        breakMinutes,
      },
      sessionCount: sessionsCompleted,
    };
    return {
      state: {
        mode: "focus",
        status: "idle",
        focusMinutes,
        breakMinutes,
        timeLeft: nextTime,
        endTime: null,
        sessionsCompleted,
        message: "Break complete! Ready to focus again.",
      },
      persist,
    };
  }

  if (savedTimer.status === "paused") {
    const pausedLeft = Number(savedTimer.timeLeft ?? fallbackTime);
    return {
      state: {
        mode,
        status: "paused",
        focusMinutes,
        breakMinutes,
        timeLeft: Math.max(1, pausedLeft),
        endTime: null,
        sessionsCompleted,
        message: "Timer paused. Resume when ready.",
      },
      persist,
    };
  }

  return {
    state: {
      mode,
      status: "idle",
      focusMinutes,
      breakMinutes,
      timeLeft: Number(savedTimer.timeLeft ?? fallbackTime),
      endTime: null,
      sessionsCompleted,
      message: "Ready to focus when you are.",
    },
    persist,
  };
}
