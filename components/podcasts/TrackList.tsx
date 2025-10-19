// components/podcasts/TrackList.tsx
import React from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';

interface Track {
  id: number;
  title: string;
  artist: string;
  module: string;
  subject: string;
  topic: string;
  audioUrl: string;
}

interface TrackListProps {
  tracks: Track[];
  onPlay: (track: Track) => void;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, onPlay }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tracks.map(track => (
        <div key={track.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onPlay(track)}>
          <h4 className="text-xl font-bold text-blue-600 truncate">{track.title}</h4>
          <p className="text-gray-500 text-sm">{track.artist}</p>
          <div className="mt-2 text-xs text-gray-400">
            <span>{track.module}</span> • <span>{track.subject}</span> • <span>{track.topic}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;