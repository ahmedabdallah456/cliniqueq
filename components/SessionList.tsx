// FILE: app/study/components/SessionList.tsx
"use client";

import { useState } from "react";
import { Session } from "@/app/study/page.tsx";

interface SessionListProps {
  sessions: Session[];
  formatTime: (ms: number) => string;
}

export default function SessionList({ sessions, formatTime }: SessionListProps) {
  const [subjectSearch, setSubjectSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("all"); // all, 7, 30

  const filteredSessions = sessions
    .filter((s) =>
      s.subject.toLowerCase().includes(subjectSearch.toLowerCase())
    )
    .filter((s) => (tagFilter ? s.tags.includes(tagFilter) : true))
    .filter((s) => {
      if (timeFilter === "all") return true;
      const days = parseInt(timeFilter);
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      return s.start >= cutoff;
    })
    .sort((a, b) => b.start - a.start);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by subject"
          value={subjectSearch}
          onChange={(e) => setSubjectSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Filter by tag"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="border p-2 rounded flex-1"
        >
          <option value="all">All</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>
      <div className="overflow-y-auto max-h-96">
        {filteredSessions.map((session) => (
          <div key={session.id} className="mb-4 p-3 border rounded bg-gray-50">
            <div className="font-bold">{session.subject}</div>
            <div className="text-sm">
              {new Date(session.start).toLocaleString()} - {new Date(session.end).toLocaleString()}
            </div>
            <div>Duration: {formatTime(session.duration)}</div>
            <div>
              Tags:{" "}
              {session.tags.map((tag) => (
                <span key={tag} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-sm italic">
              Notes: {session.notes.slice(0, 100)}{session.notes.length > 100 ? "..." : ""}
            </div>
          </div>
        ))}
        {filteredSessions.length === 0 && <p>No sessions found.</p>}
      </div>
    </div>
  );
}