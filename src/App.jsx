import { useState } from "react";
import TypingTest from "./components/TypingTest";
import Controls from "./components/Controls";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "React is a JavaScript library for building user interfaces.",
  "Tailwind CSS is a utility-first CSS framework for rapidly building custom designs.",
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [timerMode, setTimerMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTestActive, setIsTestActive] = useState(false);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <Controls
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          timerMode={timerMode}
          setTimerMode={setTimerMode}
          timeLeft={timeLeft}
          isTestActive={isTestActive}
        />
        <TypingTest
          sampleTexts={sampleTexts}
          darkMode={darkMode}
          timerMode={timerMode}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          setIsTestActive={setIsTestActive}
        />
      </div>
    </div>
  );
}

export default App;
