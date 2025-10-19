'use client';
import React, { useEffect, useRef, useState } from 'react';

// --- TYPE DEFINITION ---
type Track = {
  id: string;
  title: string;
  subject?: string;
  src: string;
  module?: string;
};

// --- SAMPLE DATA ---
// Drop your audio files in `public/tracks/`
const sampleTracks: Track[] = [
  { id: '1', title: 'You need to work hard', subject: 'Biochemistry', src: '/tracks/AT.mp3', module: 'IHB' },
  { id: '2', title: 'Anatomy of the spinal cord', subject: 'Anatomy', src: '/tracks/nightfall.mp3', module: 'CNS' },
  { id: '3', title: 'Action Potential', subject: 'Physiology', src: '/tracks/sunrise.mp3', module: 'MSK' },
  // Add more tracks here...
];

// --- SVG ICONS ---
// Using components for reusable, clean icons
const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" viewBox="0 0 10 10" {...props}><path d="M1.5 8.125V1.875a.5.5 0 0 1 .75-.433l5.25 3.125a.5.5 0 0 1 0 .866l-5.25 3.125a.5.5 0 0 1-.75-.433Z" /></svg>
);
const PauseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" viewBox="0 0 10 10" {...props}><path d="M1.5 1.5A.5.5 0 0 1 2 1h2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-7ZM6.5 1.5A.5.5 0 0 1 7 1h2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5v-7Z" /></svg>
);
const NextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" viewBox="0 0 10 10" {...props}><path d="M8.5 1.5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7ZM2.25 1.933a.5.5 0 0 0-.75.434v5.266a.5.5 0 0 0 .75.434l3.75-2.633a.5.5 0 0 0 0-.868l-3.75-2.633Z" /></svg>
);
const PreviousIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" viewBox="0 0 10 10" {...props}><path d="M1.5 1.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7ZM7.75 1.933a.5.5 0 0 1 .75.434v5.266a.5.5 0 0 1-.75.434l-3.75-2.633a.5.5 0 0 1 0-.868l3.75-2.633Z" /></svg>
);
const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
);

// --- MAIN PAGE COMPONENT ---
export default function MusicPlayerPage() {
  // --- STATE MANAGEMENT ---
  const [tracks] = useState<Track[]>(sampleTracks);
  const [query, setQuery] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);

  // --- REFS ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // --- DERIVED STATE ---
  const modules = Array.from(new Set(tracks.map((t) => t.module).filter(Boolean))) as string[];

  const filteredTracks = tracks.filter((track) => {
    const searchLower = query.trim().toLowerCase();
    const matchesQuery = !searchLower ||
      track.title.toLowerCase().includes(searchLower) ||
      (track.subject || '').toLowerCase().includes(searchLower);
    
    // ✅ FIX: Changed `track.Modules` to `track.module`
    const matchesModules = selectedModules.length === 0 || 
      (track.module && selectedModules.includes(track.module));

    return matchesQuery && matchesModules;
  });

  const currentTrack = activeIndex !== null ? filteredTracks[activeIndex] : null;

  // --- EFFECTS ---
  // Audio player event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [activeIndex]); // Re-attach if activeIndex changes

  // Update audio source when active track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
        audioRef.current.src = currentTrack.src;
        if (isPlaying) {
            audioRef.current.play().catch(console.error);
        }
    }
  }, [currentTrack?.src]);


  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Adjust activeIndex if filtering removes the current track
  useEffect(() => {
    if (activeIndex !== null && activeIndex >= filteredTracks.length) {
      setActiveIndex(filteredTracks.length > 0 ? 0 : null);
    }
  }, [filteredTracks.length]);


  // --- PLAYER CONTROLS ---
  const playTrackAtIndex = (index: number) => {
    setActiveIndex(index);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    if (filteredTracks.length === 0) return;
    const nextIndex = (activeIndex ?? -1) + 1;
    setActiveIndex(nextIndex >= filteredTracks.length ? 0 : nextIndex);
    setIsPlaying(true);
  };
  
  const handlePrev = () => {
    if (filteredTracks.length === 0) return;
    const prevIndex = (activeIndex ?? 0) - 1;
    setActiveIndex(prevIndex < 0 ? filteredTracks.length - 1 : prevIndex);
    setIsPlaying(true);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const el = progressRef.current;
    if (!audio || !el || !audio.duration) return;
    
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    audio.currentTime = percentage * audio.duration;
  };
  
  const toggleModuleFilter = (module: string) => {
    setSelectedModules((prev) => 
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans pb-32">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto flex items-center gap-4 p-4">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setShowFilters(true)}
            aria-label="Toggle filters"
          >
            <FilterIcon className="w-6 h-6"/>
          </button>
          <div className="flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tracks or subjects..."
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg border-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT GRID --- */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 p-4 md:p-8">
        
        {/* --- FILTER SIDE PANEL (Desktop) / OVERLAY (Mobile) --- */}
        <aside 
            className={`
                fixed inset-0 z-40 bg-black/20 transition-opacity md:static md:col-span-1 md:bg-transparent md:block
                ${showFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}
            `}
            onClick={() => setShowFilters(false)}
        >
            <div 
                className={`
                    w-4/5 max-w-sm h-full bg-white dark:bg-slate-800 shadow-xl p-6 transition-transform transform md:transform-none md:shadow-none md:bg-transparent md:p-0
                    ${showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 md:hidden">
                    <h3 className="font-bold text-xl">Filters</h3>
                    <button onClick={() => setShowFilters(false)} className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">✕</button>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Modules</h4>
                <div className="flex flex-wrap gap-2">
                    {modules.length === 0 && <p className="text-sm text-slate-500">No modules available.</p>}
                    {modules.map((g) => (
                    <button
                        key={g}
                        onClick={() => toggleModuleFilter(g)}
                        className={`
                        px-4 py-2 rounded-full border text-sm font-medium transition-colors
                        ${selectedModules.includes(g) 
                            ? 'bg-sky-500 text-white border-sky-500' 
                            : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                    >
                        {g}
                    </button>
                    ))}
                </div>
            </div>
        </aside>

        {/* --- TRACKS LIST --- */}
        <section className="md:col-span-3">
          <div className="space-y-3">
            {filteredTracks.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-500">No tracks found.</p>
                <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
              </div>
            )}
            {filteredTracks.map((track, index) => (
              <div
                key={track.id}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${activeIndex === index ? 'bg-sky-100 dark:bg-sky-900/50' : 'hover:bg-white dark:hover:bg-slate-800'}`}
                onDoubleClick={() => playTrackAtIndex(index)}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-md flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {track.title.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{track.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {track.subject} • <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">{track.module}</span>
                  </p>
                </div>
                <button 
                    onClick={() => {
                        if (activeIndex === index) {
                            togglePlayPause();
                        } else {
                            playTrackAtIndex(index);
                        }
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    aria-label={activeIndex === index && isPlaying ? "Pause" : "Play"}
                >
                    {activeIndex === index && isPlaying ? <PauseIcon className="w-3.5 h-3.5 fill-slate-700 dark:fill-slate-200" /> : <PlayIcon className="w-3.5 h-3.5 fill-slate-700 dark:fill-slate-200" />}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* --- BOTTOM PLAYER BAR --- */}
      {currentTrack && (
         <div className="fixed left-0 right-0 bottom-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 items-center gap-4 h-24">
                    {/* Track Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-md flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {currentTrack.title.charAt(0)}
                        </div>
                        <div className="hidden sm:block">
                            <p className="font-bold text-slate-900 dark:text-white truncate">{currentTrack.title}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{currentTrack.subject}</p>
                        </div>
                    </div>
                    
                    {/* Player Controls & Progress */}
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-4">
                            <button onClick={handlePrev} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Previous track"><PreviousIcon className="w-5 h-5 fill-slate-600 dark:fill-slate-300"/></button>
                            <button onClick={togglePlayPause} className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-md" aria-label={isPlaying ? 'Pause' : 'Play'}>
                                {isPlaying ? <PauseIcon className="w-4 h-4 fill-current"/> : <PlayIcon className="w-4 h-4 fill-current"/>}
                            </button>
                            <button onClick={handleNext} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Next track"><NextIcon className="w-5 h-5 fill-slate-600 dark:fill-slate-300"/></button>
                        </div>
                        <div className="w-full max-w-xs">
                            <div onClick={seek} ref={progressRef} className="h-1.5 w-full bg-slate-200 dark:bg-slate-600 rounded-full cursor-pointer group">
                                <div style={{ width: `${progress}%` }} className="h-1.5 rounded-full bg-sky-500 group-hover:bg-sky-400" />
                            </div>
                        </div>
                    </div>

                    {/* Volume Control (Desktop) */}
                    <div className="hidden md:flex items-center justify-end gap-2">
                        <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>
                        <input
                            type="range" min={0} max={1} step={0.01} value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                        />
                    </div>
                </div>
            </div>
         </div>
      )}
    </div>
  );
}