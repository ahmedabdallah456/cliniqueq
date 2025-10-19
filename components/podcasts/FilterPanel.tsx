// components/podcasts/FilterPanel.tsx
'use client';
import React from 'react';

const FilterPanel = () => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="font-semibold text-lg mb-2">Modules</h3>
        <ul className="space-y-1">
          <li><input type="checkbox" className="mr-2" /> Cardiology</li>
          <li><input type="checkbox" className="mr-2" /> Neurology</li>
          <li><input type="checkbox" className="mr-2" /> Pharmacology</li>
        </ul>
      </div>

      <div className="border-b pb-4">
        <h3 className="font-semibold text-lg mb-2">Subjects</h3>
        <ul className="space-y-1">
          <li><input type="checkbox" className="mr-2" /> Internal Medicine</li>
          <li><input type="checkbox" className="mr-2" /> Neuroscience</li>
          <li><input type="checkbox" className="mr-2" /> Clinical Medicine</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Topics</h3>
        <ul className="space-y-1">
          <li><input type="checkbox" className="mr-2" /> Arrhythmias</li>
          <li><input type="checkbox" className="mr-2" /> Synaptic Transmission</li>
          <li><input type="checkbox" className="mr-2" /> Drug Interactions</li>
        </ul>
      </div>
    </div>
  );
};

export default FilterPanel;