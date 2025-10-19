// components/Profile/MatchesHistory.tsx
export default function MatchesHistory() {
    const matches = [
      { date: '2024-03-01', result: 'Won', topic: 'Pathology', score: '8/10' },
      { date: '2024-03-03', result: 'Lost', topic: 'Anatomy', score: '6/10' },
      { date: '2024-03-05', result: 'Won', topic: 'Pharmacology', score: '9/10' },
    ];
  
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-black">Recent Matches</h2>
        <div className="space-y-3">
          {matches.map((match) => (
            <div key={match.date} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div>
                <span className="font-medium text-black">{match.date}</span>
                <span className="ml-2 text-sm text-blue-600">{match.topic}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded ${match.result === 'Won' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {match.result}
                </span>
                <span className="font-medium text-black">{match.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }