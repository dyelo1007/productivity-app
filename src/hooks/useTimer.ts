import { useState, useEffect, useRef, useCallback } from "react";
import type { TimerMode, PomodoroPhase, TimerSettings } from "@/types/timer";
import { DEFAULT_SETTINGS } from "@/types/timer";

interface Snapshots {
  pomodoro: Record<PomodoroPhase, number>;
  stopwatch: number;
  custom: number;
}

const loadSettings = (): TimerSettings => {
  try {
    const stored = localStorage.getItem("timerSettings");
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const makeInitialSnapshots = (s: TimerSettings): Snapshots => ({
  pomodoro: {
    focus: s.pomodoro * 60,
    short_break: s.shortBreak * 60,
    long_break: s.longBreak * 60,
  },
  stopwatch: 0,
  custom: 10 * 60,
});

const getInitialSeconds = (
  mode: TimerMode,
  phase: PomodoroPhase,
  settings: TimerSettings,
  customDuration: number
): number => {
  switch (mode) {
    case "pomodoro":
      switch (phase) {
        case "focus": return settings.pomodoro * 60;
        case "short_break": return settings.shortBreak * 60;
        case "long_break": return settings.longBreak * 60;
      }
      break;
    case "stopwatch": return 0;
    case "custom": return customDuration;
  }
};

export const useTimer = (onComplete?: () => void) => {
  const [settings, setSettings] = useState<TimerSettings>(loadSettings);
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>("focus");
  const [customDuration, setCustomDuration] = useState(10 * 60);
  const [timeLeft, setTimeLeft] = useState(() =>
    getInitialSeconds("pomodoro", "focus", loadSettings(), 10 * 60)
  );
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const timerModeRef = useRef(timerMode);
  timerModeRef.current = timerMode;

  const pomodoroPhaseRef = useRef(pomodoroPhase);
  pomodoroPhaseRef.current = pomodoroPhase;

  const snapshotsRef = useRef<Snapshots>(makeInitialSnapshots(settings));

  const isCountdown = timerMode !== "stopwatch";

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (isCountdown) {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              setIsRunning(false);
              onCompleteRef.current?.();
              return 0;
            }
            return prev - 1;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isCountdown]);

  const saveSnapshot = useCallback((currentTime: number) => {
    if (timerModeRef.current === "pomodoro") {
      snapshotsRef.current.pomodoro[pomodoroPhaseRef.current] = currentTime;
    } else if (timerModeRef.current === "stopwatch") {
      snapshotsRef.current.stopwatch = currentTime;
    } else {
      snapshotsRef.current.custom = currentTime;
    }
  }, []);

  const switchTimerMode = useCallback(
    (newMode: TimerMode) => {
      saveSnapshot(timeLeft);
      setTimerMode(newMode);

      let restored: number;
      if (newMode === "pomodoro") {
        restored = snapshotsRef.current.pomodoro[pomodoroPhase] ?? getInitialSeconds("pomodoro", pomodoroPhase, settings, customDuration);
      } else if (newMode === "stopwatch") {
        restored = snapshotsRef.current.stopwatch;
      } else {
        restored = snapshotsRef.current.custom;
      }
      setTimeLeft(restored);
      setIsRunning(false);
    },
    [timeLeft, saveSnapshot, pomodoroPhase, settings, customDuration]
  );

  const switchPomodoroPhase = useCallback(
    (newPhase: PomodoroPhase) => {
      saveSnapshot(timeLeft);
      setPomodoroPhase(newPhase);
      setTimerMode("pomodoro");
      const restored = snapshotsRef.current.pomodoro[newPhase] ?? getInitialSeconds("pomodoro", newPhase, settings, customDuration);
      setTimeLeft(restored);
      setIsRunning(false);
    },
    [timeLeft, saveSnapshot, settings, customDuration]
  );

  const setCustomTime = useCallback(
    (seconds: number) => {
      setCustomDuration(seconds);
      if (timerMode === "custom") {
        setTimeLeft(seconds);
        setIsRunning(false);
      }
    },
    [timerMode]
  );

  const updateSettings = useCallback(
    (newSettings: TimerSettings) => {
      setSettings(newSettings);
      localStorage.setItem("timerSettings", JSON.stringify(newSettings));
      snapshotsRef.current = makeInitialSnapshots(newSettings);
      if (timerMode === "pomodoro") {
        setTimeLeft(
          getInitialSeconds("pomodoro", pomodoroPhase, newSettings, customDuration)
        );
        setIsRunning(false);
      }
    },
    [timerMode, pomodoroPhase, customDuration]
  );

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);

  const reset = () => {
    setTimeLeft(
      getInitialSeconds(timerMode, pomodoroPhase, settings, customDuration)
    );
    setIsRunning(false);
    saveSnapshot(timeLeft);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  };

  return {
    timerMode,
    pomodoroPhase,
    timeLeft,
    isRunning,
    settings,
    customDuration,
    timerModeRef,
    pomodoroPhaseRef,
    switchTimerMode,
    switchPomodoroPhase,
    setCustomTime,
    updateSettings,
    start,
    pause,
    reset,
    formatTime,
  };
};
