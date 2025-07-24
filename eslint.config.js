import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "React is a JavaScript library for building user interfaces.",
  "Tailwind CSS is a utility-first CSS framework for rapidly building custom designs.",
  "The only way to learn a new programming language is by writing programs in it.",
];

const TypingTest = () => {
  // State management
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100 });
  const [darkMode, setDarkMode] = useState(false);
  const [timerMode, setTimerMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds default
  const inputRef = useRef(null);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle timer mode
  const toggleTimerMode = () => {
    setTimerMode(!timerMode);
    if (!timerMode) {
      setTimeLeft(60); // Reset timer when enabling timer mode
    }
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerMode && timeLeft > 0 && startTime && !isCompleted) {
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
    return () => clearInterval(interval);
  }, [timerMode, timeLeft, startTime, isCompleted]);

  // Generate random text
  const generateNewText = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setText(sampleTexts[randomIndex]);
    setInput("");
    setStartTime(null);
    setIsCompleted(false);
    setStats({ wpm: 0, accuracy: 100 });
    if (timerMode) setTimeLeft(60);
    inputRef.current?.focus();
  }, [timerMode]);

  // Handle test completion
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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // Handle input changes
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

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Character styling
  const getCharClass = (char, idx) => {
    if (idx >= input.length)
      return darkMode ? "text-gray-400" : "text-gray-700";
    return char === input[idx]
      ? "text-green-500 dark:text-green-400"
      : "text-red-500 dark:text-red-400";
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header with controls */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            Typing Speed Test
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-lg transition ${
                darkMode
                  ? "bg-gray-700 text-yellow-300"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={toggleTimerMode}
              className={`px-4 py-2 rounded-lg transition ${
                timerMode
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              ⏱️ {timerMode ? "Timer On" : "Timer Off"}
            </button>
          </div>
        </div>

        {/* Main test area */}
        <div
          className={`max-w-3xl mx-auto p-6 rounded-xl transition ${
            darkMode ? "bg-gray-800" : "bg-white shadow-md"
          }`}
        >
          {/* Timer display */}
          {timerMode && (
            <div className="mb-4 text-center">
              <div
                className={`text-2xl font-mono ${
                  timeLeft <= 10
                    ? "text-red-500 animate-pulse"
                    : "text-blue-500"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
            </div>
          )}

          {/* Text to type */}
          <div className="mb-6">
            <div
              className={`text-lg font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Type the following text:
            </div>
            <div
              className={`p-4 rounded-md mb-4 h-32 overflow-y-auto font-mono text-lg leading-relaxed ${
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

            {/* Input area */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 focus:ring-blue-500 text-white"
                  : "bg-white border-gray-300 focus:ring-blue-400"
              }`}
              rows="4"
              placeholder="Start typing here..."
              disabled={isCompleted || (timerMode && timeLeft === 0)}
              autoFocus
            />
          </div>

          {/* Stats display */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div
              className={`p-3 rounded-lg text-center ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div className="text-sm text-gray-500 dark:text-gray-400">
                WPM
              </div>
              <div className="text-2xl font-bold">{stats.wpm}</div>
            </div>
            <div
              className={`p-3 rounded-lg text-center ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Accuracy
              </div>
              <div className="text-2xl font-bold">{stats.accuracy}%</div>
            </div>
            <div
              className={`p-3 rounded-lg text-center ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Chars
              </div>
              <div className="text-2xl font-bold">{input.length}</div>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex space-x-4">
            <button
              onClick={generateNewText}
              className={`flex-1 py-3 px-4 rounded-lg transition ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isCompleted ? "Try Another Text" : "Restart Test"}
            </button>
          </div>

          {/* Completion message */}
          {isCompleted && (
            <div
              className={`mt-4 p-3 rounded-lg text-center ${
                darkMode
                  ? "bg-green-900/30 text-green-400"
                  : "bg-green-100 text-green-700"
              }`}
            >
              Test completed! {stats.wpm} WPM with {stats.accuracy}% accuracy.
            </div>
          )}

          {/* Time's up message */}
          {timerMode && timeLeft === 0 && !isCompleted && (
            <div
              className={`mt-4 p-3 rounded-lg text-center ${
                darkMode
                  ? "bg-red-900/30 text-red-400"
                  : "bg-red-100 text-red-700"
              }`}
            >
              Time's up! Your progress has been recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
