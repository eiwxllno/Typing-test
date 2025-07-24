const Controls = ({
  darkMode,
  setDarkMode,
  timerMode,
  setTimerMode,
  isTestActive,
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Typing Speed Test</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-lg ${
            darkMode
              ? "bg-gray-700 text-yellow-300"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        <button
          onClick={() => !isTestActive && setTimerMode(!timerMode)}
          className={`px-4 py-2 rounded-lg ${
            timerMode ? "bg-blue-600 text-white" : "bg-gray-200"
          } ${isTestActive ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isTestActive}
        >
          ⏱️ {timerMode ? "Timer On" : "Timer Off"}
        </button>
      </div>
    </div>
  );
};

export default Controls;
