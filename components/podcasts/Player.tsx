// components/podcasts/Player.tsx
'use client';
import React, { useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

interface PlayerProps {
  track: {
    id: number;
    title: string;
    artist: string;
    audioUrl: string;
  } | null;
}

const Player: React.FC<PlayerProps> = ({ track }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (track && audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play();
    }
  }, [track]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  if (!track) {
    return (
      <div className="flex items-center justify-center h-16 bg-gray-50 rounded-lg">
        <p className="text-gray-400">Select a podcast to play</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <button onClick={togglePlayPause} className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          <PlayIcon className="h-6 w-6" />
        </button>
        <div>
          <h5 className="font-semibold text-sm truncate">{track.title}</h5>
          <p className="text-xs text-gray-500">{track.artist}</p>
        </div>
      </div>
      <audio ref={audioRef} controls className="w-full ml-4" />
    </div>
  );
};

export default Player;