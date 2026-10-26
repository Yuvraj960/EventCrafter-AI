'use client';

import React from 'react';
import { Heart, PartyPopper, Users, ArrowRight, Check } from 'lucide-react';
import { EventType } from '@/types/event';

interface EventTypeShowcaseProps {
  onSelectType: (type: EventType) => void;
}

export default function EventTypeShowcase({ onSelectType }: EventTypeShowcaseProps) {
  return (
    <section className="py-12 bg-neutral-100/60 border-y border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Tailored for Every Milestone
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            Every celebration has unique vibes, constraints, and priorities. Choose your category to begin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wedding */}
          <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Weddings & Receptions
                </span>
              </div>
              <h3 className="text-xl font-bold text-neutral-950">Romantic & Timeless</h3>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Ceremony schedules, catering per plate calculations, bridal suite logistics, and floral styling hacks.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-neutral-600">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-500" /> Multi-month milestone timeline</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-500" /> Photographer & caterer questionnaires</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-500" /> Romantic DIY decor suggestions</li>
              </ul>
            </div>
            <button
              onClick={() => onSelectType('wedding')}
              className="mt-6 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
            >
              Plan a Wedding <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Birthday */}
          <div className="bg-white rounded-2xl border border-violet-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                <PartyPopper className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  Birthdays & Anniversaries
                </span>
              </div>
              <h3 className="text-xl font-bold text-neutral-950">Vibrant & Unforgettable</h3>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Themed playlists, icebreakers, novelty cocktails, DJ setups, and memorable guest favors.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-neutral-600">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-500" /> Party theme tags (Retro, Disco, Y2K)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-500" /> Interactive drinks & activity planning</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-violet-500" /> Headcount budget scaling</li>
              </ul>
            </div>
            <button
              onClick={() => onSelectType('birthday')}
              className="mt-6 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
            >
              Plan a Birthday <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Community */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Community & Galas
                </span>
              </div>
              <h3 className="text-xl font-bold text-neutral-950">Civic & Collaborative</h3>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Permits, volunteer coordination, civic food trucks, AV stages, and accessibility checklists.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-neutral-600">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Large-scale budget categorization</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Sponsor & volunteer milestones</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Civic and festival ideas</li>
              </ul>
            </div>
            <button
              onClick={() => onSelectType('community')}
              className="mt-6 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
            >
              Plan Community Event <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
