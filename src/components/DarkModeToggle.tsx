const DarkModeToggle = () => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" />
      <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-gray-700 transition">
        <div className="absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow peer-checked:translate-x-6 transition"></div>
      </div>
    </label>
  );
};

export default DarkModeToggle;
