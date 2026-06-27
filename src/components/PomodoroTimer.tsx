import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useTimer } from "@/hooks/useTimer";
import { playBeep } from "@/lib/audio";
import { requestNotificationPermission, showTimerNotification } from "@/lib/notification";
import TimerModeSelector from "./TimerModeSelector";
import TimerSettingsModal from "./TimerSettingsModal";
import ConfirmSwitchModal from "./ConfirmSwitchModal";
import type { TimerMode, PomodoroPhase } from "@/types/timer";

const PomodoroTimer = () => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("timerSound") !== "off";
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSwitch, setPendingSwitch] = useState<TimerMode | null>(null);
  const [pendingPhase, setPendingPhase] = useState<PomodoroPhase | null>(null);

  const handleComplete = useCallback(() => {
    if (soundEnabled) playBeep();
    showTimerNotification(pomodoroPhaseRef.current);
    toast.success("Time's up!");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundEnabled]);

  const {
    timerMode,
    pomodoroPhase,
    timeLeft,
    isRunning,
    settings,
    customDuration,
    pomodoroPhaseRef,
    switchTimerMode,
    switchPomodoroPhase,
    setCustomTime,
    updateSettings,
    start,
    pause,
    reset,
    formatTime,
  } = useTimer(handleComplete);

  const handleStart = () => {
    requestNotificationPermission();
    start();
    toast.info("Timer resumed");
  };

  const handlePause = () => {
    pause();
    toast.info("Timer paused");
  };

  const handleReset = () => {
    reset();
    toast.warning("Timer reset");
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("timerSound", next ? "on" : "off");
      return next;
    });
  };

  const handlePendingModeSwitch = useCallback((mode: TimerMode) => {
    setPendingSwitch(mode);
    setPendingPhase(null);
    setConfirmOpen(true);
  }, []);

  const handlePendingPhaseSwitch = useCallback((phase: PomodoroPhase) => {
    setPendingPhase(phase);
    setPendingSwitch(null);
    setConfirmOpen(true);
  }, []);

  const handleConfirmSwitch = useCallback(() => {
    if (pendingSwitch) {
      switchTimerMode(pendingSwitch);
      toast.info("Timer switched");
    } else if (pendingPhase) {
      switchPomodoroPhase(pendingPhase);
      toast.info("Timer switched");
    }
    setConfirmOpen(false);
    setPendingSwitch(null);
    setPendingPhase(null);
  }, [pendingSwitch, pendingPhase, switchTimerMode, switchPomodoroPhase]);

  const getPhaseLabel = () => {
    if (timerMode === "stopwatch") return "Stopwatch";
    if (timerMode === "custom") return "Custom Timer";
    switch (pomodoroPhase) {
      case "focus": return "Focus";
      case "short_break": return "Short Break";
      case "long_break": return "Long Break";
    }
  };

  return (
    <section className="w-full mx-auto p-4 sm:p-6 md:p-10 2xl:px-20 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center dark:bg-card dark:border-border">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Timer
      </h2>

      <TimerModeSelector
        timerMode={timerMode}
        pomodoroPhase={pomodoroPhase}
        customDuration={customDuration}
        isRunning={isRunning}
        onTimerModeChange={switchTimerMode}
        onPomodoroPhaseChange={switchPomodoroPhase}
        onCustomDurationChange={setCustomTime}
        onPendingModeSwitch={handlePendingModeSwitch}
        onPendingPhaseSwitch={handlePendingPhaseSwitch}
      />

      {/* Phase Label + Controls Row */}
      <div className="flex items-center justify-between w-full mt-6 mb-4">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {getPhaseLabel()}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            title={soundEnabled ? "Mute sound" : "Enable sound"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
          <TimerSettingsModal settings={settings} onSave={updateSettings} />
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-6xl font-bold mb-8 text-gray-800 dark:text-white tabular-nums">
        {formatTime(timeLeft)}
      </div>

      {/* Timer Controls */}
      <div className="flex gap-4">
        <button
          className="px-8 py-3 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleStart}
          disabled={isRunning}
        >
          {isRunning ? "Running..." : "Start"}
        </button>
        <button
          className="px-8 py-3 bg-yellow-500 text-white rounded-full shadow hover:bg-yellow-600 transition font-medium"
          onClick={handlePause}
        >
          Pause
        </button>
        <button
          className="px-8 py-3 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition font-medium"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <ConfirmSwitchModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmSwitch}
      />
    </section>
  );
};

export default PomodoroTimer;
