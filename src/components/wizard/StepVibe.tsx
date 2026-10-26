'use client';

import React from 'react';
import { Tag } from 'lucide-react';
import { CreateEventInput } from '@/types/event';

interface StepVibeProps {
  formData: CreateEventInput;
  setFormData: React.Dispatch<React.SetStateAction<CreateEventInput>>;
  currentTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  customVibe: string;
  setCustomVibe: (vibe: string) => void;
  activeAccent: { text: string; bg: string; border: string };
}

export default function StepVibe({
  formData,
  setFormData,
  currentTags,
  selectedTags,
  toggleTag,
  customVibe,
  setCustomVibe,
  activeAccent,
}: StepVibeProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" />
          Select Vibe & Theme Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {currentTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                  isSelected
                    ? `${activeAccent.bg} ${activeAccent.text} ${activeAccent.border} shadow-xs font-semibold`
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
          Custom Vibe / Style Nuance
        </label>
        <input
          type="text"
          placeholder="e.g., Fairytale enchanted forest with gold fairy lights & indie folk music"
          value={customVibe}
          onChange={(e) => setCustomVibe(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
          Special Requests or Constraints
        </label>
        <textarea
          rows={2}
          placeholder="e.g., Strictly vegan catering, outdoor venue with rain backup, wheelchair accessible, acoustic music only."
          value={formData.specialRequests}
          onChange={(e) => setFormData((prev) => ({ ...prev, specialRequests: e.target.value }))}
          className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>
    </div>
  );
}
