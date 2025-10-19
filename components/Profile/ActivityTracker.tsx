"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, Flag, History, User, Users, MoreHorizontal, Circle } from 'lucide-react';

// Mock data for the progress chart.
// The 'value' represents progress, from 0.0 to 1.0.
const progressData = [
  { name: 'Jun 20, 2025', value: 0.2 },
  { name: 'Jun 21, 2025', value: 0.4 },
  { name: 'Jun 22, 2025', value: 0.3 },
  { name: 'Jun 23, 2025', value: 0.7 },
  { name: 'Jun 24, 2025', value: 0.5 },
  { name: 'Jun 25, 2025', value: 0.8 },
  { name: 'Jun 26, 2025', value: 0.6 },
];

// Mock data for the activity history list.
const activityHistory = [
  {
    date: 'Jun 25, 2025',
    presetName: '[Anatomy] Abdominal anatomy + 5',
    correctAnswers: 18,
    totalQuestions: 28,
    presetType: 'Custom set',
  },
    {
    date: 'Jun 24, 2025',
    presetName: '[Physiology] Cardiovascular System',
    correctAnswers: 15,
    totalQuestions: 20,
    presetType: 'Standard',
  },
    {
    date: 'Jun 23, 2025',
    presetName: '[Pathology] Neoplasia',
    correctAnswers: 22,
    totalQuestions: 30,
    presetType: 'Custom set',
  },
];

// A custom tooltip component for the Recharts graph for better styling.
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 shadow-lg">
        <p className="font-semibold">{label}</p>
        <p className="text-sm">{`Progress: ${(payload[0].value * 100).toFixed(0)}%`}</p>
      </div>
    );
  }
  return null;
};


/**
 * ActivityTracker component displays user's study progress and history.
 * It features an interactive progress chart and a list of recent activities.
 */
export default function ActivityTracker() {
  const [activeTab, setActiveTab] = useState('tracker');
  const [selectedDate, setSelectedDate] = useState('Jun 25, 2025');
  const [studyType, setStudyType] = useState('solo');

  // Handles click events on the bar chart bars to update the selected date.
  const handleBarClick = (data) => {
      if (data && data.name) {
        setSelectedDate(data.name);
      }
  }

  return (
    <div className="bg-[#121212] text-white p-4 sm:p-6 md:p-8 rounded-2xl font-sans w-full max-w-6xl mx-auto shadow-2xl">
      <header className="flex items-center gap-4 mb-6">
        <div className="bg-blue-500/10 p-2 rounded-lg">
            <Target className="h-6 w-6 text-blue-500" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-100">Activity</h1>
      </header>

      {/* Tabs for navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 focus:outline-none ${
            activeTab === 'tracker'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Target className="h-5 w-5" />
          <span>TRACKER</span>
        </button>
        <button
          onClick={() => setActiveTab('flags')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 focus:outline-none ${
            activeTab === 'flags'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Flag className="h-5 w-5" />
          <span>FLAGS</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 focus:outline-none ${
            activeTab === 'history'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <History className="h-5 w-5" />
          <span>HISTORY</span>
        </button>
      </div>

      {/* Conditional rendering based on the active tab */}
      {activeTab === 'tracker' && (
        <div className="space-y-8">
          {/* Progress Tracker Section */}
          <div className="bg-[#1e1e1e] p-4 sm:p-6 rounded-xl border border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-100">Progress Tracker</h2>
                    <p className="text-gray-400 text-sm">Selected date: {selectedDate}</p>
                </div>
                <div className="flex items-center bg-gray-800 rounded-lg p-1">
                    <button onClick={() => setStudyType('solo')} className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors ${studyType === 'solo' ? 'bg-white text-black' : 'text-gray-300 hover:bg-gray-700'}`}>
                        <User className="h-4 w-4" />
                        SOLO STUDY
                    </button>
                     <button onClick={() => setStudyType('group')} className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors ${studyType === 'group' ? 'bg-white text-black' : 'text-gray-300 hover:bg-gray-700'}`}>
                        <Users className="h-4 w-4" />
                        GROUP STUDY
                    </button>
                </div>
            </div>

            {/* Responsive Chart Container */}
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={progressData} margin={{ top: 20, right: 10, left: -25, bottom: 5 }} barCategoryGap="40%" onClick={handleBarClick}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={{ stroke: '#4b5563' }} tickLine={false} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 1]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }} />
                  <Bar dataKey="value">
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === selectedDate ? '#3b82f6' : '#4b5563'} className="cursor-pointer" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity History List */}
          <div className="bg-[#1e1e1e] p-4 sm:p-6 rounded-xl border border-gray-800">
             <div className="hidden lg:grid grid-cols-12 gap-4 text-gray-400 font-semibold text-xs uppercase mb-4 px-4">
                <div className="col-span-2">Date</div>
                <div className="col-span-4">Preset Name</div>
                <div className="col-span-3">Progress</div>
                <div className="col-span-2">Preset Type</div>
                <div className="col-span-1 text-right">Actions</div>
            </div>

            <div className="space-y-4">
              {activityHistory.map((item, index) => {
                  const correctPercentage = (item.correctAnswers / item.totalQuestions) * 100;
                  const incorrectPercentage = 100 - correctPercentage;
                return (
                  <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-gray-800/50 hover:bg-gray-800 p-4 rounded-lg transition-colors">
                    <div className="lg:col-span-2 text-white font-medium text-sm">{item.date}</div>
                    <div className="lg:col-span-4">
                      <p className="font-semibold text-white">{item.presetName}</p>
                    </div>
                    <div className="lg:col-span-3">
                       <p className="text-xs text-gray-400 mb-1 lg:hidden">Correct answers: {item.correctAnswers}/{item.totalQuestions}</p>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                           <div className="bg-green-500 h-2 rounded-l-full" style={{ width: `${correctPercentage}%`}}></div>
                        </div>
                        <div className="flex justify-between mt-1">
                           <span className="flex items-center gap-1.5 text-xs text-gray-400"><Circle className="h-2 w-2 text-green-500" fill="currentColor"/> Correct</span>
                           <span className="flex items-center gap-1.5 text-xs text-gray-400"><Circle className="h-2 w-2 text-red-500" fill="currentColor"/> Incorrect</span>
                        </div>
                    </div>
                     <div className="lg:col-span-2 text-sm text-gray-300">{item.presetType}</div>
                    <div className="lg:col-span-1 flex justify-end">
                      <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
      {/* Placeholder content for other tabs */}
      {activeTab === 'flags' && (
          <div className="flex flex-col justify-center items-center h-64 bg-[#1e1e1e] rounded-xl border border-gray-800">
            <Flag className="h-12 w-12 text-gray-600 mb-4" />
            <p className="text-gray-400">Flagged items will appear here.</p>
          </div>
      )}
      {activeTab === 'history' && (
           <div className="flex flex-col justify-center items-center h-64 bg-[#1e1e1e] rounded-xl border border-gray-800">
            <History className="h-12 w-12 text-gray-600 mb-4" />
            <p className="text-gray-400">Your full activity history will be shown here.</p>
          </div>
      )}
    </div>
  );
}
