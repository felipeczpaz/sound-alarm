import React, { useState, useEffect } from "react";

const Alarm: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [intervalHours, setIntervalHours] = useState(1);
  const [alarmSound, setAlarmSound] = useState<HTMLAudioElement | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (isActive) {
      const sound = new Audio("/alarm-sound.mp3"); // Replace with your sound file
      setAlarmSound(sound);
      const interval = intervalHours * 3600000; // Convert hours to milliseconds
      setTimeLeft(interval);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev && prev > 1000) {
            return prev - 1000; // Decrease by 1 second
          } else {
            sound.play();
            return null; // Reset timer when it reaches 0
          }
        });
      }, 1000); // Update every second

      return () => {
        clearInterval(timer);
        clearInterval(interval);
      };
    } else {
      setTimeLeft(null); // Reset time left when not active
    }
  }, [isActive, intervalHours]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
    if (alarmSound) {
      alarmSound.pause();
      alarmSound.currentTime = 0;
    }
  };

  const formatTime = (milliseconds: number | null) => {
    if (milliseconds === null) return "00:00:00";
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0",
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Sound Alarm</h1>
        <div className="mb-4 text-center">
          <label className="mr-2">Repeat every (hours):</label>
          <input
            type="number"
            value={intervalHours}
            onChange={(e) => setIntervalHours(Number(e.target.value))}
            className="border p-2 rounded w-24 text-center"
          />
        </div>
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Time Left:</h2>
          <p className="text-2xl">{formatTime(timeLeft)}</p>
        </div>
        <button
          onClick={isActive ? handleStop : handleStart}
          className={`w-full px-4 py-2 rounded ${isActive ? "bg-red-500" : "bg-green-500"} text-white`}
        >
          {isActive ? "Stop Alarm" : "Start Alarm"}
        </button>
      </div>
    </div>
  );
};

export default Alarm;
