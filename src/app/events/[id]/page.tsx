'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Sparkles,
  DollarSign,
  Tag,
  AlertCircle,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { EventPlan } from '@/types/event';
import { getEventById, saveEvent } from '@/lib/storage';
import EventHeader from '@/components/event/EventHeader';
import BudgetTab from '@/components/event/BudgetTab';
import TimelineTab from '@/components/event/TimelineTab';
import VendorsTab from '@/components/event/VendorsTab';
import IdeasTab from '@/components/event/IdeasTab';
import AICopilotDrawer from '@/components/event/AICopilotDrawer';

export default function EventWorkspacePage() {
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<EventPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas'>('overview');
  const [loading, setLoading] = useState(true);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  useEffect(() => {
    if (eventId) {
      const found = getEventById(eventId);
      setEvent(found);
      setLoading(false);
    }
  }, [eventId]);

  const handleUpdate = (updatedEvent: EventPlan) => {
    setEvent(updatedEvent);
    saveEvent(updatedEvent);
    setSavedStatus('Autosaved');
    setTimeout(() => setSavedStatus(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-500 text-sm">
        Loading event workspace...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-neutral-400 mb-3" />
        <h2 className="text-xl font-bold text-neutral-900">Event Blueprint Not Found</h2>
        <p className="text-sm text-neutral-500 mt-1 mb-6">
          The requested event blueprint may have been cleared from local storage.
        </p>
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50 text-neutral-900 print:bg-white">
      {/* 1. Header with Countdown, Readiness Meter, Print & Co-Pilot */}
      <EventHeader event={event} onOpenCopilot={() => setIsCopilotOpen(true)} />

      {/* 2. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 print:py-2 print:px-2">
        {/* Printable Event Title Summary for PDF Export */}
        <div className="hidden print:block border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-neutral-950">{event.eventName}</h1>
          <p className="text-xs text-neutral-600 mt-1">
            {event.eventType.toUpperCase()} · {event.date || 'Date TBD'} · {event.location} · {event.guestCount} Guests · Budget: {event.currency}{Number(event.totalBudget).toLocaleString()}
          </p>
          <p className="text-xs text-neutral-700 italic mt-2">"{event.summary}"</p>
        </div>

        {/* Tab Navigation Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-neutral-200 print:hidden">
          <div className="flex space-x-6 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'budget', label: `Budget Tracker (${event.budgetBreakdown?.length || 0})` },
              { id: 'timeline', label: `Timeline & Milestones (${event.timeline?.length || 0})` },
              { id: 'vendors', label: `Vendor Checklist (${event.vendorChecklist?.length || 0})` },
              { id: 'ideas', label: `Ideas Studio (${event.personalizedIdeas?.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-3 border-b-2 transition capitalize whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-neutral-950 text-neutral-950 font-bold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {savedStatus && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3" />
              {savedStatus}
            </span>
          )}
        </div>

        {/* 3. Tab Panes */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
              <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-medium">
                "{event.summary}"
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-100 text-xs">
                <div>
                  <span className="text-neutral-400 block mb-0.5">Target Date</span>
                  <span className="font-semibold text-neutral-900 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" /> {event.date || 'TBD'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">City / Location</span>
                  <span className="font-semibold text-neutral-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" /> {event.location || 'Anywhere'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">Guest Headcount</span>
                  <span className="font-semibold text-neutral-900 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-neutral-400" /> {event.guestCount} guests
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">Total Budget</span>
                  <span className="font-bold text-neutral-950 flex items-center gap-1 text-sm">
                    <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                    {event.currency}{Number(event.totalBudget).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-neutral-500" /> Top Budget Allocations
                  </h3>
                  <button onClick={() => setActiveTab('budget')} className="text-xs text-neutral-500 hover:text-neutral-900 font-semibold print:hidden">
                    View Tracker →
                  </button>
                </div>
                <div className="space-y-2">
                  {event.budgetBreakdown?.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs py-1.5 border-b border-neutral-50">
                      <span className="font-medium text-neutral-800">{item.category}</span>
                      <span className="font-bold text-neutral-900">
                        {event.currency}{Number(item.estimatedCost).toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-neutral-500" /> Theme & Atmosphere
                  </h3>
                  <button onClick={() => setActiveTab('ideas')} className="text-xs text-neutral-500 hover:text-neutral-900 font-semibold print:hidden">
                    Explore Studio →
                  </button>
                </div>
                <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
                  Atmosphere Vibe: <span className="font-bold text-neutral-900">{event.vibe}</span>
                </p>
                {event.specialRequests && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                    <span className="font-bold block mb-0.5">Special Requests & Constraints:</span>
                    {event.specialRequests}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'budget' && <BudgetTab event={event} onUpdate={handleUpdate} />}
        {activeTab === 'timeline' && <TimelineTab event={event} onUpdate={handleUpdate} />}
        {activeTab === 'vendors' && <VendorsTab event={event} onUpdate={handleUpdate} />}
        {activeTab === 'ideas' && <IdeasTab event={event} onUpdate={handleUpdate} />}
      </main>

      {/* 4. Slide-over AI Event Co-Pilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        event={event}
      />
    </div>
  );
}
