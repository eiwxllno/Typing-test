import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import TimerDisplay from "./TimerDisplay";

const TypingTest = ({
  sampleTexts,
  darkMode,
  timerMode,
  timeLeft,
  setTimeLeft,
  setIsTestActive,
}) => {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100 });
  const inputRef = useRef(null);

  // Generate random text
  const generateNewText = () => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setText(sampleTexts[randomIndex]);
    setInput("");
    setStartTime(null);
    setIsCompleted(false);
    setStats({ wpm: 0, accuracy: 100 });
    if (timerMode) setTimeLeft(60);
    inputRef.current?.focus();
  };

  // Initialize
  useEffect(() => {
    generateNewText();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerMode && timeLeft > 0 && startTime && !isCompleted) {
      setIsTestActive(true);
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleTestCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      setIsTestActive(false);
    };
  }, [timerMode, timeLeft, startTime, isCompleted]);

  const handleTestCompletion = () => {
    const endTime = Date.now();
    const timeInMinutes = timerMode
      ? (60 - timeLeft) / 60
      : (endTime - startTime) / 60000;

    const words = text.trim().split(/\s+/).length;
    const wpm = Math.round(words / timeInMinutes);

    let correctChars = 0;
    for (let i = 0; i < text.length; i++) {
      if (i < input.length && text[i] === input[i]) {
        correctChars++;
      }
    }
    const accuracy = Math.round((correctChars / text.length) * 100);

    setStats({ wpm, accuracy });
    setIsCompleted(true);

    if (wpm > 40 && accuracy > 90) {
      confetti({ particleCount: 100, spread: 70 });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    if (value === text) {
      handleTestCompletion();
    }
  };

  const getCharClass = (char, idx) => {
    if (idx >= input.length)
      return darkMode ? "text-gray-400" : "text-gray-700";
    return char === input[idx]
      ? "text-green-500 dark:text-green-400"
      : "text-red-500 dark:text-red-400";
  };

  return (
    <div
      className={`max-w-3xl mx-auto p-6 rounded-xl ${
        darkMode ? "bg-gray-800" : "bg-white shadow-md"
      }`}
    >
      {timerMode && <TimerDisplay timeLeft={timeLeft} />}

      <div className="mb-6">
        <div
          className={`text-lg mb-2 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Type the following:
        </div>
        <div
          className={`p-4 mb-4 h-32 overflow-y-auto font-mono text-lg ${
            darkMode ? "bg-gray-700" : "bg-gray-50"
          }`}
          onClick={() => inputRef.current?.focus()}
        >
          {text.split("").map((char, idx) => (
            <span key={idx} className={getCharClass(char, idx)}>
              {char}
            </span>
          ))}
        </div>

        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          className={`w-full p-3 rounded-lg border ${
            darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-white border-gray-300"
          }`}
          rows="4"
          placeholder="Start typing here..."
          disabled={isCompleted || (timerMode && timeLeft === 0)}
          autoFocus
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          className={`p-3 rounded-lg text-center ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <div className="text-sm text-gray-500">WPM</div>
          <div className="text-2xl font-bold">{stats.wpm}</div>
        </div>
        <div
          className={`p-3 rounded-lg text-center ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <div className="text-sm text-gray-500">Accuracy</div>
          <div className="text-2xl font-bold">{stats.accuracy}%</div>
        </div>
        <div
          className={`p-3 rounded-lg text-center ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <div className="text-sm text-gray-500">Chars</div>
          <div className="text-2xl font-bold">{input.length}</div>
        </div>
      </div>

      <button
        onClick={generateNewText}
        className={`w-full py-3 px-4 rounded-lg ${
          darkMode
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        {isCompleted ? "Try Another Text" : "Restart Test"}
      </button>

      {isCompleted && (
        <div
          className={`mt-4 p-3 rounded-lg text-center ${
            darkMode
              ? "bg-green-900/30 text-green-400"
              : "bg-green-100 text-green-700"
          }`}
        >
          Completed! {stats.wpm} WPM, {stats.accuracy}% accuracy
        </div>
      )}
    </div>
  );
};

export default TypingTest;
