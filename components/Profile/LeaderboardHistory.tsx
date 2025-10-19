// components/Profile/LeaderboardHistory.tsx
export default function LeaderboardHistory() {
    const rankings = [
      { month: 'Jan', position: 15 },
      { month: 'Feb', position: 8 },
      { month: 'Mar', position: 4 },
      { month: 'Apr', position: 12 },
      { month: 'May', position: 6 },
    ];
  
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-black">Leaderboard History</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {rankings.map((ranking) => (
            <div key={ranking.month} className="flex-shrink-0 w-32 p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-sm font-medium text-blue-600">{ranking.month}</div>
              <div className="text-2xl font-bold text-black mt-2">#{ranking.position}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }