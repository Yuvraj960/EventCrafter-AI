'use client';

import React from 'react';
import { PieChart, CalendarDays, ShieldCheck, Lightbulb } from 'lucide-react';

export default function FeatureGrid() {
  const features = [
    {
      icon: PieChart,
      title: 'Dynamic Budgeting',
      desc: 'Real-time category percentages and tracking with over-budget alerts.',
    },
    {
      icon: CalendarDays,
      title: 'Chronological Milestones',
      desc: 'From 3 months out to the final hour on event day with interactive task completion.',
    },
    {
      icon: ShieldCheck,
      title: 'Vendor Interview Guides',
      desc: 'AI curates the 3 crucial questions to ask before signing contracts.',
    },
    {
      icon: Lightbulb,
      title: 'DIY Budget Hacks',
      desc: 'Clever high-impact aesthetic tricks that save thousands on decor and food.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50">
                <Icon className="w-6 h-6 text-neutral-800 mb-3" />
                <h4 className="font-bold text-sm text-neutral-900">{item.title}</h4>
                <p className="text-xs text-neutral-500 mt-1">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
