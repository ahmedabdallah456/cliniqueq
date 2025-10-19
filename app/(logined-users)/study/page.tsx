// FILE: app/study/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface StudySession {
  id: string;
  subject: string;
  tags: string[];
  notes: string;
  startTime: number; // Unix timestamp
  endTime: number; // Unix timestamp
  duration: number; // seconds
}

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: number | null;
  pausedTime: number; // accumulated seconds when paused
  currentSubject: string;
  currentTags: string;
  currentNotes: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Format seconds to HH:MM:SS
function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Format duration in a human-readable way (e.g., "2h 15m")
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${seconds}s`;
}

// Format date/time for display
function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Export sessions as CSV
function exportToCSV(sessions: StudySession[]) {
  const headers = ["Subject", "Tags", "Start Time", "End Time", "Duration (min)", "Notes"];
  const rows = sessions.map((s) => [
    s.subject,
    s.tags.join("; "),
    new Date(s.startTime).toLocaleString(),
    new Date(s.endTime).toLocaleString(),
    (s.duration / 60).toFixed(2),
    s.notes.replace(/"/g, '""'), // Escape quotes
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `study-sessions-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function StudyPage() {
  // Timer state
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    startTime: null,
    pausedTime: 0,
    currentSubject: "",
    currentTags: "",
    currentNotes: "",
  });

  // Display time in seconds
  const [displayTime, setDisplayTime] = useState(0);

  // Sessions list
  const [sessions, setSessions] = useState<StudySession[]>([]);

  // Filters
  const [subjectFilter, setSubjectFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState<"all" | "7d" | "30d">("all");

  // Timer interval ref
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // PERSISTENCE: Load from localStorage on mount
  // ============================================================================
  useEffect(() => {
    const savedSessions = localStorage.getItem("studySessions");
    const savedTimerState = localStorage.getItem("studyTimerState");

    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error("Failed to parse saved sessions", e);
      }
    }

    if (savedTimerState) {
      try {
        const state = JSON.parse(savedTimerState);
        setTimerState(state);
        // Calculate elapsed time if timer was running
        if (state.isRunning && !state.isPaused && state.startTime) {
          const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
          setDisplayTime(state.pausedTime + elapsed);
        } else {
          setDisplayTime(state.pausedTime);
        }
      } catch (e) {
        console.error("Failed to parse saved timer state", e);
      }
    }
  }, []);

  // ============================================================================
  // PERSISTENCE: Save to localStorage when sessions or timer state changes
  // ============================================================================
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("studySessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("studyTimerState", JSON.stringify(timerState));
  }, [timerState]);

  // ============================================================================
  // TIMER LOGIC: Update display time every second when running
  // ============================================================================
  useEffect(() => {
    if (timerState.isRunning && !timerState.isPaused && timerState.startTime) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerState.startTime!) / 1000);
        setDisplayTime(timerState.pausedTime + elapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState.isRunning, timerState.isPaused, timerState.startTime, timerState.pausedTime]);

  // ============================================================================
  // TIMER CONTROLS
  // ============================================================================

  const handleStart = () => {
    if (!timerState.currentSubject.trim()) {
      alert("Please enter a subject before starting the timer.");
      return;
    }

    setTimerState({
      ...timerState,
      isRunning: true,
      isPaused: false,
      startTime: Date.now(),
    });
  };

  const handlePause = () => {
    if (timerState.startTime) {
      const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
      const totalTime = timerState.pausedTime + elapsed;
      setTimerState({
        ...timerState,
        isPaused: true,
        pausedTime: totalTime,
        startTime: null,
      });
      setDisplayTime(totalTime);
    }
  };

  const handleResume = () => {
    setTimerState({
      ...timerState,
      isPaused: false,
      startTime: Date.now(),
    });
  };

  const handleStop = () => {
    if (!timerState.isRunning) return;

    // Calculate final duration
    let finalDuration = timerState.pausedTime;
    if (timerState.startTime && !timerState.isPaused) {
      const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
      finalDuration = timerState.pausedTime + elapsed;
    }

    // Create session record
    const now = Date.now();
    const sessionStartTime = now - finalDuration * 1000;
    const newSession: StudySession = {
      id: `session-${now}`,
      subject: timerState.currentSubject,
      tags: timerState.currentTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      notes: timerState.currentNotes,
      startTime: sessionStartTime,
      endTime: now,
      duration: finalDuration,
    };

    // Add to sessions list
    setSessions([newSession, ...sessions]);

    // Reset timer state
    setTimerState({
      isRunning: false,
      isPaused: false,
      startTime: null,
      pausedTime: 0,
      currentSubject: "",
      currentTags: "",
      currentNotes: "",
    });
    setDisplayTime(0);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the timer? This will discard the current session.")) {
      setTimerState({
        isRunning: false,
        isPaused: false,
        startTime: null,
        pausedTime: 0,
        currentSubject: timerState.currentSubject,
        currentTags: timerState.currentTags,
        currentNotes: timerState.currentNotes,
      });
      setDisplayTime(0);
    }
  };

  // ============================================================================
  // FILTERING LOGIC
  // ============================================================================

  const filteredSessions = sessions.filter((session) => {
    // Subject filter
    if (subjectFilter && !session.subject.toLowerCase().includes(subjectFilter.toLowerCase())) {
      return false;
    }

    // Tag filter
    if (tagFilter) {
      const hasTag = session.tags.some((tag) => tag.toLowerCase().includes(tagFilter.toLowerCase()));
      if (!hasTag) return false;
    }

    // Date range filter
    if (dateRangeFilter !== "all") {
      const now = Date.now();
      const days = dateRangeFilter === "7d" ? 7 : 30;
      const cutoff = now - days * 24 * 60 * 60 * 1000;
      if (session.startTime < cutoff) return false;
    }

    return true;
  });

  // ============================================================================
  // STATISTICS CALCULATION
  // ============================================================================

  const now = Date.now();
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const weekStart = now - 7 * 24 * 60 * 60 * 1000;

  const todaySessions = sessions.filter((s) => s.startTime >= todayStart);
  const weekSessions = sessions.filter((s) => s.startTime >= weekStart);

  const todayTotal = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  const weekTotal = weekSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalSessions = sessions.length;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Study Session Tracker</h1>
          <p className="text-gray-600">Track your study time, organize by subject, and analyze your progress</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN: Timer & Controls */}
          <div className="space-y-6">
            {/* Timer Display Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="text-center mb-6">
                <div
                  className="text-5xl sm:text-6xl font-mono font-bold text-indigo-600 mb-4"
                  role="timer"
                  aria-live="polite"
                  aria-label={`Timer: ${formatTime(displayTime)}`}
                >
                  {formatTime(displayTime)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  {timerState.isRunning && (
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        timerState.isPaused ? "bg-yellow-500" : "bg-green-500 animate-pulse"
                      }`}
                    />
                  )}
                  <span className="text-sm text-gray-500">
                    {timerState.isRunning
                      ? timerState.isPaused
                        ? "Paused"
                        : "Running"
                      : "Ready to start"}
                  </span>
                </div>
              </div>

              {/* Session Info Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={timerState.currentSubject}
                    onChange={(e) => setTimerState({ ...timerState, currentSubject: e.target.value })}
                    disabled={timerState.isRunning}
                    placeholder="e.g., Mathematics, Biology, Programming"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={timerState.currentTags}
                    onChange={(e) => setTimerState({ ...timerState, currentTags: e.target.value })}
                    disabled={timerState.isRunning}
                    placeholder="e.g., exam prep, homework, review"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    value={timerState.currentNotes}
                    onChange={(e) => setTimerState({ ...timerState, currentNotes: e.target.value })}
                    disabled={timerState.isRunning}
                    placeholder="What are you working on?"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition resize-none"
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap gap-3">
                {!timerState.isRunning && (
                  <button
                    onClick={handleStart}
                    aria-label="Start timer"
                    className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Start
                  </button>
                )}

                {timerState.isRunning && !timerState.isPaused && (
                  <button
                    onClick={handlePause}
                    aria-label="Pause timer"
                    className="flex-1 min-w-[120px] bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    Pause
                  </button>
                )}

                {timerState.isRunning && timerState.isPaused && (
                  <button
                    onClick={handleResume}
                    aria-label="Resume timer"
                    className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Resume
                  </button>
                )}

                {timerState.isRunning && (
                  <button
                    onClick={handleStop}
                    aria-label="Stop timer and save session"
                    className="flex-1 min-w-[120px] bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Stop & Save
                  </button>
                )}

                {timerState.isRunning && (
                  <button
                    onClick={handleReset}
                    aria-label="Reset timer"
                    className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Statistics</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{formatDuration(todayTotal)}</div>
                  <div className="text-sm text-gray-600 mt-1">Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{formatDuration(weekTotal)}</div>
                  <div className="text-sm text-gray-600 mt-1">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{totalSessions}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Sessions</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Session List */}
          <div className="space-y-6">
            {/* Filters Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="subjectFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Search by Subject
                  </label>
                  <input
                    id="subjectFilter"
                    type="text"
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    placeholder="Filter by subject..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="tagFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Tag
                  </label>
                  <input
                    id="tagFilter"
                    type="text"
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    placeholder="Filter by tag..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDateRangeFilter("7d")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        dateRangeFilter === "7d"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      7 Days
                    </button>
                    <button
                      onClick={() => setDateRangeFilter("30d")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        dateRangeFilter === "30d"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      30 Days
                    </button>
                    <button
                      onClick={() => setDateRangeFilter("all")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        dateRangeFilter === "all"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      All
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => exportToCSV(filteredSessions)}
                  disabled={filteredSessions.length === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Export to CSV ({filteredSessions.length})
                </button>
              </div>
            </div>

            {/* Sessions List Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Recent Sessions ({filteredSessions.length})
              </h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredSessions.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No sessions found. Start tracking your study time!
                  </div>
                ) : (
                  filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800 text-lg">{session.subject}</h3>
                        <span className="text-indigo-600 font-bold">{formatDuration(session.duration)}</span>
                      </div>

                      {session.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {session.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-sm text-gray-600 mb-2">
                        <div>Started: {formatDateTime(session.startTime)}</div>
                        <div>Ended: {formatDateTime(session.endTime)}</div>
                      </div>

                      {session.notes && (
                        <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-2">
                          {session.notes}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}