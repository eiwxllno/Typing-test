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
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100 });
  const inputRef = useRef(null);

  // Generate random text
  const generateNewText = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setText(sampleTexts[randomIndex]);
    setInput("");
    setStartTime(null);
    setIsCompleted(false);
    setStats({ wpm: 0, accuracy: 100 });
    inputRef.current?.focus();
  }, []);

  // Initialize with random text
  useEffect(() => {
    generateNewText();
  }, [generateNewText]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Start timer on first keystroke
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    // Check for completion
    if (value === text) {
      const endTime = Date.now();
      const timeInMinutes = (endTime - startTime) / 60000;
      const words = text.trim().split(/\s+/).length;
      const wpm = Math.round(words / timeInMinutes);

      // Calculate accuracy
      let correctChars = 0;
      for (let i = 0; i < text.length; i++) {
        if (i < value.length && text[i] === value[i]) {
          correctChars++;
        }
      }
      const accuracy = Math.round((correctChars / text.length) * 100);

      setStats({ wpm, accuracy });
      setIsCompleted(true);

      // Celebration for good performance
      if (wpm > 40 && accuracy > 90) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const getCharClass = (char, idx) => {
    if (idx >= input.length) return "text-gray-700";
    return char === input[idx] ? "text-success" : "text-error";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">
          Typing Speed Test
        </h1>

        <div className="mb-6">
          <div className="text-lg font-medium mb-2">
            Type the following text:
          </div>
          <div
            className="bg-gray-50 p-4 rounded-lg mb-4 h-32 overflow-y-auto font-mono text-lg leading-relaxed"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
            rows="4"
            placeholder="Start typing here..."
            disabled={isCompleted}
            autoFocus
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-center bg-gray-100 p-3 rounded-lg flex-1 mx-2">
            <div className="text-sm text-gray-500">WPM</div>
            <div className="text-2xl font-bold">{stats.wpm}</div>
          </div>
          <div className="text-center bg-gray-100 p-3 rounded-lg flex-1 mx-2">
            <div className="text-sm text-gray-500">Accuracy</div>
            <div className="text-2xl font-bold">{stats.accuracy}%</div>
          </div>
        </div>

        <button
          onClick={generateNewText}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          {isCompleted ? "Try Another Text" : "Restart Test"}
        </button>

        {isCompleted && (
          <div className="mt-4 p-3 bg-success/10 text-success text-center rounded-lg">
            Test completed! {stats.wpm} WPM with {stats.accuracy}% accuracy.
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingTest;
