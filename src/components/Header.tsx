import React from "react";
import DarkModeToggle from "./DarkModeToggle";

const Header = () => {
  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl bg-white border border-gray-200 rounded-2xl shadow-md p-5 flex justify-between items-center z-50 backdrop-blur-md">
      <h1 className="text-2xl font-bold">🧠 Productivity</h1>
      <DarkModeToggle />
    </header>
  );
};

export default Header;
