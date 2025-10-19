// components/Profile/CorrectAnswersGraph.tsx
"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', correct: 12 },
  { day: 'Tue', correct: 15 },
  { day: 'Wed', correct: 8 },
  { day: 'Thu', correct: 20 },
  { day: 'Fri', correct: 18 },
  { day: 'Sat', correct: 10 },
  { day: 'Sun', correct: 14 },
];

export default function CorrectAnswersGraph() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-black">Correct Answers</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Bar 
              dataKey="correct" 
              fill="#2563eb" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
  
}