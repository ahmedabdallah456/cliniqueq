// FILE: app/study/components/TimerControls.tsx
"use client";

import { formatTime } from "@/app/study/page.tsx"; // Import from page, or duplicate if needed

interface TimerControlsProps {
  isRunning: boolean;
  currentDuration: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
}

export default function TimerControls({
  isRunning,
  currentDuration,
  onStart,
  onPause,
  onStop,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="text-center">
      <div className="text-4xl font-mono mb-4">{formatTime(currentDuration)}</div>
      <div className="flex justify-center gap-2">
        <button
          onClick={onStart}
          disabled={isRunning}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
          aria-label="Start timer"
        >
          Start
        </button>
        <button
          onClick={onPause}
          disabled={!isRunning}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition disabled:opacity-50"
          aria-label="Pause timer"
        >
          Pause
        </button>
        <button
          onClick={onStop}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          aria-label="Stop timer"
        >
          Stop
        </button>
        <button
          onClick={onReset}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          aria-label="Reset timer"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

