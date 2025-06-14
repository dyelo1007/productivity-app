import Header from "./components/Header";
import PomodoroTimer from "./components/PomodoroTimer";
import TodoList from "./components/TodoList";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center font-sans text-gray-800">
      <Header />
      <main className="w-[90%] max-w-6xl mx-auto flex flex-col gap-10 mt-32">
        <TodoList />
        <PomodoroTimer />
      </main>
    </div>
  );
};

export default App;
