// components/Profile/DailyTracker.tsx
'use client';

import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaFire } from 'react-icons/fa';
import { LuCalendarClock, LuFlame, LuTarget, LuHash } from "react-icons/lu";

import 'react-calendar-heatmap/dist/styles.css';
import './DailyTracker.css'; // We'll create this file for custom styles

// --- Helper Functions to Generate and Process Data ---

// 1. Generate dummy data for the specified date range
const generateHeatmapData = (startDate: Date, endDate: Date, today: Date) => {
  const data = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    let count = 0;
    if (currentDate <= today) {
      count = Math.random() > 0.4 ? Math.floor(Math.random() * 10) + 1 : 0;
    } // Future dates remain 0
    data.push({
      date: dateStr,
      count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

// 2. Calculate streaks and stats from the data, considering only up to today
const calculateStats = (data: { date: string; count: number }[], today: Date) => {
  const pastData = data.filter(d => new Date(d.date) <= today);

  let currentStreak = 0;
  let longestStreak = 0;
  let totalQuestions = 0;

  const todayStr = today.toISOString().slice(0, 10);
  const todayData = pastData.find(d => d.date === todayStr);

  if (todayData && todayData.count > 0) {
    for (let i = pastData.length - 1; i >= 0; i--) {
      if (pastData[i].count > 0) {
        currentStreak++;
      } else {
        break; // Streak is broken
      }
    }
  }

  // Calculate longest streak and total questions
  let tempStreak = 0;
  pastData.forEach(day => {
    totalQuestions += day.count;
    if (day.count > 0) {
      tempStreak++;
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      tempStreak = 0;
    }
  });
  // Final check in case the longest streak goes up to the last day
  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }
  
  const avgQuestions = pastData.length > 0 ? totalQuestions / pastData.length : 0;

  // Dummy average score
  const avgScore = 78;

  return { currentStreak, longestStreak, avgQuestions, avgScore };
};


// --- The Main Component ---

const DailyTracker: React.FC = () => {
  const today = new Date();
  const startDate = new Date('2025-10-01');
  const endDate = new Date('2026-6-31');

  const heatmapData = generateHeatmapData(startDate, endDate, today);
  const { currentStreak, longestStreak, avgQuestions, avgScore } = calculateStats(heatmapData, today);

  return (
    <div className="bg-[#1C1C1E] text-white p-6 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#FF9500] p-2 rounded-lg">
            <LuFlame size={20} />
          </div>
          <h2 className="text-xl font-bold">Clinique Heatmap</h2>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-sm">
        <StatCard icon={<LuCalendarClock />} label="Current streak" value={`${currentStreak} days`} />
        <StatCard icon={<LuFlame />} label="Longest streak" value={`${longestStreak} days`} />
        <StatCard icon={<LuHash />} label="Avg. no. of Q's" value={`${avgQuestions.toFixed(1)} / day`} />
        <StatCard icon={<LuTarget />} label="Avg. score" value={`${avgScore}%`} />
      </div>

      {/* Heatmap */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 tracking-wider mb-2">HEATMAP (2025 - 2026)</h3>
        <div className="heatmap-container text-xs">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={heatmapData}
            classForValue={(value) => {
              if (!value || value.count === 0) {
                return 'color-empty';
              }
              if (value.count > 8) return 'color-scale-4';
              if (value.count > 5) return 'color-scale-3';
              if (value.count > 2) return 'color-scale-2';
              return 'color-scale-1';
            }}
            tooltipDataAttrs={(value: { date: string; count: number }) => {
              const dateStr = value.date ? new Date(value.date).toDateString() : '';
              return {
                'data-tooltip-id': 'heatmap-tooltip',
                'data-tooltip-content': `${value.count || 0} questions on ${dateStr}`,
              };
            }}
            showWeekdayLabels={false}
          />
          <ReactTooltip id="heatmap-tooltip" place="top" effect="solid" />
        </div>
      </div>
      
       {/* Legend */}
       <div className="flex items-center justify-start mt-4 text-xs text-gray-400 gap-2">
            <span>Number of questions completed by day: 0</span>
            <div className="flex items-center gap-1">
               <div className="w-4 h-4 rounded-sm bg-[#404040]"></div>
               <div className="w-4 h-4 rounded-sm bg-[#FFD27C]"></div>
               <div className="w-4 h-4 rounded-sm bg-[#FFC145]"></div>
               <div className="w-4 h-4 rounded-sm bg-[#FFB000]"></div>
            </div>
            <span>&infin;</span>
          </div>
    </div>
  );
};

// --- Sub-component for Stat Cards ---

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
    <div className="bg-[#2C2C2E] p-4 rounded-lg flex flex-col justify-start">
        <div className="text-gray-400 text-lg mb-2">{icon}</div>
        <div className="font-semibold text-lg">{value}</div>
        <div className="text-gray-400 text-xs">{label}</div>
    </div>
);

export default DailyTracker;