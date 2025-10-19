// components/Profile/ProfileHeader.tsx
export default function ProfileHeader() {
    const funSpecializations = [
      "🫀 Cardiac Ninja",
      "🧠 Neuro Whisperer",
      "🦴 Bone Wizard",
      "💊 Pharma Mage",
      "🩸 Hematology Hero"
    ];
  
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar with Fun Frame */}
          <div className="relative group">
            <img 
              src="/img/OP_1.png"
              alt="Profile"
              className="w-32 h-32 rounded-2xl border-4 border-blue-300 
                       transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 px-3 py-1 
                          rounded-full text-sm font-bold shadow-sm text-black">
              Level 24
            </div>
          </div>
  
          {/* Playful Info Section */}
          <div className="text-center md:text-left space-y-3">
            <h1 className="text-3xl font-bold text-black flex items-center gap-3">
              ahmedabdallah
              <span className="text-2xl">👨⚕️</span>
            </h1>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <div className="bg-pink-100 px-3 py-1 rounded-full text-sm 
                             flex items-center gap-1 text-black">
                🎯 Current Obsession: <span className="font-medium">Pharmacology</span>
              </div>
              <div className="bg-green-100 px-3 py-1 rounded-full text-sm 
                             flex items-center gap-1 text-black">
                🏆 Streak: <span className="font-medium ">7 days</span>
              </div>
            </div>
  
            {/* Fun Specialization Selector */}
            <div className="mt-3">
              <p className="text-sm text-black mb-2">
                When I grow up I want to be a...
              </p>
              <div className="flex flex-wrap gap-2">
                {funSpecializations.map((spec) => (
                  <button
                    key={spec}
                    className="px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200
                 transition-colors text-sm flex items-center gap-2 text-black">
                    {spec}
                    <span className="text-lg">✨</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
  
        {/* Personality Badges */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          <div className="bg-purple-100 px-3 py-1 rounded-full text-sm flex items-center gap-1 text-black">
            🦉 Night Owl
          </div>
          <div className="bg-orange-100 px-3 py-1 rounded-full text-sm flex items-center gap-1 text-black">
            🧪 Lab Rat Extraordinaire
          </div>
          <div className="bg-red-100 px-3 py-1 rounded-full text-sm flex items-center gap-1 text-black">
            ☕ IV Coffee Drip
          </div>
        </div>
      </div>
    );
  }