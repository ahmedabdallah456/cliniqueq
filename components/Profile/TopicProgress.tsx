// components/Profile/TopicProgress.tsx

export default function TopicProgress() {
    const topics = [
      { name: 'Pathology', progress: 80 },
      { name: 'Anatomy', progress: 65 },
      { name: 'Physiology', progress: 60 },
      { name: 'Parasitology', progress: 21 },
      { name: 'Microbiology', progress: 43 },
    ];
  
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-black">Topic Progress</h2>
        <div className="space-y-4">
          {topics.map((topic) => (
            <div key={topic.name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-black">{topic.name}</span>
                <span className="text-sm text-blue-600">{topic.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                  style={{ width: `${topic.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }