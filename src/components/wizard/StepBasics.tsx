'use client';

import React from 'react';
import { Heart, PartyPopper, Users, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { EventType, CreateEventInput } from '@/types/event';

interface StepBasicsProps {
  formData: CreateEventInput;
  setFormData: React.Dispatch<React.SetStateAction<CreateEventInput>>;
  onTypeSelect: (type: EventType) => void;
  errors: Record<string, string>;
  activeAccent: { text: string; bg: string };
}

export default function StepBasics({
  formData,
  setFormData,
  onTypeSelect,
  errors,
  activeAccent,
}: StepBasicsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2">
          1. Choose Event Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { type: 'wedding' as const, label: 'Wedding', icon: Heart, desc: 'Timeless & elegant' },
            { type: 'birthday' as const, label: 'Birthday', icon: PartyPopper, desc: 'Joyful & vibrant' },
            { type: 'community' as const, label: 'Community', icon: Users, desc: 'Civic & collaborative' },
          ].map((item) => {
            const isSelected = formData.eventType === item.type;
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => onTypeSelect(item.type)}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col gap-2 ${
                  isSelected
                    ? `border-neutral-900 ring-2 ring-neutral-900/10 ${
                        item.type === 'wedding'
                          ? 'bg-rose-50/70 border-rose-400'
                          : item.type === 'birthday'
                          ? 'bg-violet-50/70 border-violet-400'
                          : 'bg-emerald-50/70 border-emerald-400'
                      }`
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${isSelected ? activeAccent.text : 'text-neutral-500'}`} />
                  {isSelected && <CheckCircle2 className={`w-4 h-4 ${activeAccent.text}`} />}
                </div>
                <div>
                  <p className="font-semibold text-sm text-neutral-900">{item.label}</p>
                  <p className="text-xs text-neutral-500">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
          Event Title / Name
        </label>
        <input
          type="text"
          placeholder={
            formData.eventType === 'wedding'
              ? 'e.g., Liam & Seraphina’s Wedding'
              : formData.eventType === 'birthday'
              ? 'e.g., Chloe’s 30th Neon Disco'
              : 'e.g., Downtown Harvest Community Fest'
          }
          value={formData.eventName}
          onChange={(e) => setFormData((prev) => ({ ...prev, eventName: e.target.value }))}
          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
        />
        {errors.eventName && <p className="text-xs text-red-500 mt-1">{errors.eventName}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
            Target Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            />
          </div>
          {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
            City / Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="e.g., Austin, TX or Mumbai"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            />
          </div>
          {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
        </div>
      </div>
    </div>
  );
}
