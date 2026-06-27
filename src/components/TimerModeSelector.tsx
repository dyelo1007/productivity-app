import { Tabs } from "radix-ui";
import type { TimerMode, PomodoroPhase } from "@/types/timer";

type Props = {
  timerMode: TimerMode;
  pomodoroPhase: PomodoroPhase;
  customDuration: number;
  isRunning: boolean;
  onTimerModeChange: (mode: TimerMode) => void;
  onPomodoroPhaseChange: (phase: PomodoroPhase) => void;
  onCustomDurationChange: (seconds: number) => void;
  onPendingModeSwitch: (mode: TimerMode) => void;
  onPendingPhaseSwitch: (phase: PomodoroPhase) => void;
};

const formatMinutes = (seconds: number) => Math.round(seconds / 60);

const TimerModeSelector = ({
  timerMode,
  pomodoroPhase,
  customDuration,
  isRunning,
  onTimerModeChange,
  onPomodoroPhaseChange,
  onCustomDurationChange,
  onPendingModeSwitch,
  onPendingPhaseSwitch,
}: Props) => {
  const handleTabChange = (value: string) => {
    const newMode = value as TimerMode;
    if (newMode === timerMode) return;
    if (isRunning) {
      onPendingModeSwitch(newMode);
    } else {
      onTimerModeChange(newMode);
    }
  };

  const handlePhaseChange = (newPhase: PomodoroPhase) => {
    if (newPhase === pomodoroPhase && timerMode === "pomodoro") return;
    if (isRunning) {
      onPendingPhaseSwitch(newPhase);
    } else {
      onPomodoroPhaseChange(newPhase);
    }
  };

  return (
    <div className="w-full">
      <Tabs.Root value={timerMode} onValueChange={handleTabChange}>
        <Tabs.List className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 dark:bg-muted">
          <Tabs.Trigger
            value="pomodoro"
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-blue-600 text-gray-600 dark:text-gray-400 dark:data-[state=active]:bg-card dark:data-[state=active]:text-white"
          >
            Pomodoro
          </Tabs.Trigger>
          <Tabs.Trigger
            value="stopwatch"
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-blue-600 text-gray-600 dark:text-gray-400 dark:data-[state=active]:bg-card dark:data-[state=active]:text-white"
          >
            Stopwatch
          </Tabs.Trigger>
          <Tabs.Trigger
            value="custom"
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-blue-600 text-gray-600 dark:text-gray-400 dark:data-[state=active]:bg-card dark:data-[state=active]:text-white"
          >
            Custom
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="pomodoro">
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handlePhaseChange("focus")}
              className={`px-4 py-2 rounded-full shadow font-medium transition text-sm ${
                pomodoroPhase === "focus"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-muted dark:text-gray-300"
              }`}
            >
              Focus
            </button>
            <button
              onClick={() => handlePhaseChange("short_break")}
              className={`px-4 py-2 rounded-full shadow font-medium transition text-sm ${
                pomodoroPhase === "short_break"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-muted dark:text-gray-300"
              }`}
            >
              Short Break
            </button>
            <button
              onClick={() => handlePhaseChange("long_break")}
              className={`px-4 py-2 rounded-full shadow font-medium transition text-sm ${
                pomodoroPhase === "long_break"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-muted dark:text-gray-300"
              }`}
            >
              Long Break
            </button>
          </div>
        </Tabs.Content>

        <Tabs.Content value="stopwatch">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Count up from zero — track elapsed time
          </p>
        </Tabs.Content>

        <Tabs.Content value="custom">
          <div className="flex items-center justify-center gap-3">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Minutes:
            </label>
            <input
              type="number"
              min={1}
              max={480}
              value={formatMinutes(customDuration)}
              onChange={(e) =>
                onCustomDurationChange(
                  (Number(e.target.value) || 1) * 60
                )
              }
              className="w-20 p-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-muted dark:border-gray-600 dark:text-white"
            />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default TimerModeSelector;
