// FILE: app/study/components/Stats.tsx
"use client";

import { useMemo } from "react";
import { Session } from "@/app/study/page.tsx";
import { formatTime } from "@/app/study/page.tsx";

interface StatsProps {
  sessions: Session[];
}

export default function Stats({ sessions }: StatsProps) {
  // Calculate aggregates
  const totalToday = useMemo(() => {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    return sessions
      .filter((s) => s.start >= todayStart)
      .reduce((acc, s) => acc + s.duration, 0);
  }, [sessions]);

  const totalThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return sessions
      .filter((s) => s.start >= weekAgo)
      .reduce((acc, s) => acc + s.duration, 0);
  }, [sessions]);

  const sessionCount = sessions.length;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Statistics</h2>
      <ul className="list-disc pl-5">
        <li>Total time today: {formatTime(totalToday)}</li>
        <li>Total time this week: {formatTime(totalThisWeek)}</li>
        <li>Number of sessions: {sessionCount}</li>
      </ul>
    </div>
  );
}