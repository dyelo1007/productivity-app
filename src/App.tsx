import Header from "./components/Header";
import PomodoroTimer from "./components/PomodoroTimer";
import TodoList from "./components/TodoList";
import { Toaster } from "sonner";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    document.title = "🧠 Productivity App";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center font-sans text-gray-800 dark:text-gray-100 dark:bg-background">
      <Header />
      <main className="w-[90%] max-w-6xl mx-auto flex flex-col gap-10 mt-32">
        <TodoList />
        <PomodoroTimer />
      </main>
      <Toaster position="bottom-right" richColors />
    </div>
  );
};

export default App;
