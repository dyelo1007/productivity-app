export type TimerMode = "pomodoro" | "stopwatch" | "custom";

export type PomodoroPhase = "focus" | "short_break" | "long_break";

export interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
};
