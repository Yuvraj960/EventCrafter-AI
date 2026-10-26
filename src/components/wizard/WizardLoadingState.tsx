'use client';

import React from 'react';
import { Sparkles, Loader2, Calculator, CalendarClock, Lightbulb } from 'lucide-react';
import { EventType } from '@/types/event';

interface WizardLoadingStateProps {
  currentStage: number;
  eventType: EventType;
}

const STAGES = [
  {
    icon: Calculator,
    title: 'Calculating venue & catering allocations...',
    desc: 'Balancing guest capacity with regional pricing nuances.',
  },
  {
    icon: CalendarClock,
    title: 'Building chronological timeline...',
    desc: 'Structuring milestones from months out to the day-of schedule.',
  },
  {
    icon: Lightbulb,
    title: 'Curating vendor checklist & DIY ideas...',
    desc: 'Generating protective interview questions & budget hacks.',
  },
];

export default function WizardLoadingState({ currentStage, eventType }: WizardLoadingStateProps) {
  const activeStage = STAGES[Math.min(currentStage, STAGES.length - 1)];
  const ActiveIcon = activeStage.icon;

  const accentColor =
    eventType === 'wedding'
      ? { text: 'text-rose-600', bg: 'bg-rose-50', ring: 'ring-rose-500/20', bar: 'bg-rose-600' }
      : eventType === 'birthday'
      ? { text: 'text-violet-600', bg: 'bg-violet-50', ring: 'ring-violet-500/20', bar: 'bg-violet-600' }
      : { text: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-500/20', bar: 'bg-emerald-600' };

  return (
    <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in">
      <div className="relative">
        <div className={`w-20 h-20 rounded-2xl ${accentColor.bg} flex items-center justify-center ring-8 ${accentColor.ring} shadow-inner`}>
          <ActiveIcon className={`w-10 h-10 ${accentColor.text} animate-pulse`} />
        </div>
        <div className="absolute -top-1.5 -right-1.5 bg-neutral-900 text-amber-300 rounded-full p-1.5 shadow-md animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-xs font-semibold text-neutral-700">
          <Loader2 className="w-3 h-3 animate-spin text-neutral-500" />
          <span>Stage {currentStage + 1} of {STAGES.length}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 transition-all duration-300">
          {activeStage.title}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500">{activeStage.desc}</p>
      </div>

      {/* Segmented Loading Indicators */}
      <div className="w-full max-w-xs space-y-2">
        <div className="flex gap-2">
          {STAGES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                idx <= currentStage ? accentColor.bar : 'bg-neutral-200'
              }`}
            />
          ))}
        </div>
        <p className="text-[11px] text-neutral-400 font-medium">
          Querying Gemini 2.5 Flash with structured output schema...
        </p>
      </div>
    </div>
  );
}
