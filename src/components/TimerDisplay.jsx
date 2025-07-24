const TimerDisplay = ({ timeLeft }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className={`mb-4 text-center text-2xl font-mono ${
        timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-blue-500"
      }`}
    >
      {formatTime(timeLeft)}
    </div>
  );
};

export default TimerDisplay;
