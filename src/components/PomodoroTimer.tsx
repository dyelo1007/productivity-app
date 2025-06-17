import { useState, useEffect, useRef } from "react";

const PomodoroTimer = () => {
  const MODES = {
    pomodoro: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  const [mode, setMode] = useState<keyof typeof MODES>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODES["pomodoro"]);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current!);
  }, [isRunning]);

  // Handle mode switching
  const handleModeChange = (newMode: keyof typeof MODES) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode]);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <section className="w-full mx-auto p-4 sm:p-6 md:p-10 2xl:px-20 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center dark:bg-[#1e1e1e]">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Pomodoro Timer
      </h2>

      {/* Mode Selector */}
      <div className="flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-full shadow font-medium ${
            mode === "pomodoro"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleModeChange("pomodoro")}
        >
          Pomodoro
        </button>
        <button
          className={`px-4 py-2 rounded-full shadow font-medium ${
            mode === "short_break"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleModeChange("short_break")}
        >
          Short Break
        </button>
        <button
          className={`px-4 py-2 rounded-full shadow font-medium ${
            mode === "long_break"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleModeChange("long_break")}
        >
          Long Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="text-6xl font-bold mb-8 text-gray-800 dark:text-white">
        {formatTime(timeLeft)}
      </div>

      {/* Timer Controls */}
      <div className="flex gap-6">
        <button
          className="px-8 py-3 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition font-medium"
          onClick={() => setIsRunning(true)}
        >
          Start
        </button>
        <button
          className="px-8 py-3 bg-yellow-500 text-white rounded-full shadow hover:bg-yellow-600 transition font-medium"
          onClick={() => setIsRunning(false)}
        >
          Pause
        </button>
        <button
          className="px-8 py-3 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition font-medium"
          onClick={() => handleModeChange(mode)}
        >
          Reset
        </button>
      </div>
    </section>
  );
};

export default PomodoroTimer;
