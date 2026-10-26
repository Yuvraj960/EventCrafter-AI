'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { EventType, EventPlan } from '@/types/event';
import { getEvents, deleteEvent, seedDemoEventsIfEmpty, syncFromSupabase } from '@/lib/storage';
import CreateEventWizard from '@/components/CreateEventWizard';
import SavedEventsList from '@/components/SavedEventsList';
import EventTypeShowcase from '@/components/landing/EventTypeShowcase';
import FeatureGrid from '@/components/landing/FeatureGrid';

export default function LandingPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardType, setWizardType] = useState<EventType>('wedding');
  const [savedEvents, setSavedEvents] = useState<EventPlan[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setSavedEvents(getEvents());
    syncFromSupabase().then((synced) => {
      if (synced && synced.length > 0) {
        setSavedEvents(synced);
      }
    });
  }, []);

  const openWizard = (type: EventType = 'wedding') => {
    setWizardType(type);
    setIsWizardOpen(true);
  };

  const handleEventCreated = (newEvent: EventPlan) => {
    setSavedEvents(getEvents());
    setNotification(`🎉 Blueprint created for "${newEvent.eventName}"!`);
    setTimeout(() => setNotification(null), 5000);
    document.getElementById('saved-events')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    setSavedEvents(getEvents());
  };

  const handleLoadDemos = () => {
    const demos = seedDemoEventsIfEmpty();
    setSavedEvents(demos);
    setNotification('✨ Sample Wedding and Birthday blueprints loaded!');
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/40 text-neutral-900">
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black text-sm shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-neutral-900">EventCraft</span>
              <span className="ml-1 text-xs px-1.5 py-0.5 rounded-md font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                AI 2.5
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#saved-events"
              className="hidden sm:inline-flex text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition"
            >
              Saved Blueprints ({savedEvents.length})
            </a>
            <button
              onClick={() => openWizard('wedding')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition flex items-center gap-1.5 shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Create Event</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700 mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Autonomous Event Blueprints with Gemini 2.5 Flash</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-950 leading-[1.1]">
            Turn Dream Celebrations into{' '}
            <span className="bg-gradient-to-r from-rose-600 via-violet-600 to-emerald-600 bg-clip-text text-transparent">
              Actionable Blueprints
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Stop juggling spreadsheets. EventCraft AI generates custom budgets, chronological checklists, vendor questions, and theme hacks in under 5 seconds.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openWizard('wedding')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-950 text-white font-semibold text-sm hover:bg-neutral-800 transition shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Start Planning Your Event</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#saved-events"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white border border-neutral-300 font-semibold text-sm text-neutral-700 hover:bg-neutral-50 transition"
            >
              Explore Saved Events ({savedEvents.length})
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-neutral-200/60">
            <div>
              <p className="text-2xl font-black text-neutral-900">100%</p>
              <p className="text-xs text-neutral-500">Structured JSON Output</p>
            </div>
            <div>
              <p className="text-2xl font-black text-neutral-900">4 Currencies</p>
              <p className="text-xs text-neutral-500">₹ INR · $ USD · € EUR · £ GBP</p>
            </div>
            <div>
              <p className="text-2xl font-black text-neutral-900">5-Second</p>
              <p className="text-xs text-neutral-500">Gemini 2.5 Generation</p>
            </div>
            <div>
              <p className="text-2xl font-black text-neutral-900">Offline Ready</p>
              <p className="text-xs text-neutral-500">Local-First Storage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Type Showcases */}
      <EventTypeShowcase onSelectType={openWizard} />

      {/* Feature Grid */}
      <FeatureGrid />

      {/* Saved Events Section */}
      <SavedEventsList
        events={savedEvents}
        onDelete={handleDeleteEvent}
        onOpenCreateModal={() => openWizard('wedding')}
        onLoadDemos={handleLoadDemos}
      />

      {/* Footer */}
      <footer className="w-full py-8 bg-neutral-900 text-neutral-400 text-xs border-t border-neutral-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>EventCraft AI</span>
            <span className="text-neutral-500 font-normal">· Autonomous Event Intelligence</span>
          </div>
          <div className="flex gap-4 text-neutral-400">
            <span>Next.js 16</span>
            <span>·</span>
            <span>Gemini 2.5 Flash</span>
            <span>·</span>
            <span>Tailwind CSS</span>
            <span>·</span>
            <span>Supabase Ready</span>
          </div>
        </div>
      </footer>

      {/* Interactive Wizard Modal */}
      <CreateEventWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        initialType={wizardType}
        onSuccess={handleEventCreated}
      />
    </div>
  );
}
