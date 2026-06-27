import { ModeToggle } from "./mode-toggle";
// import DarkModeToggle from "./DarkModeToggle";

const Header = () => {
  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl bg-white border border-gray-200 rounded-2xl shadow-md p-5 flex justify-between items-center z-50 backdrop-blur-md text-gray-800 dark:text-gray-100 dark:bg-card dark:border-border">
      <h1 className="text-2xl font-bold">🧠 Productivity</h1>
      <ModeToggle />
    </header>
  );
};

export default Header;
