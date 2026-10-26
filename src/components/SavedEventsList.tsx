'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Trash2,
  ExternalLink,
  Sparkles,
  Heart,
  PartyPopper,
  BookmarkCheck,
} from 'lucide-react';
import { EventPlan } from '@/types/event';

interface SavedEventsListProps {
  events: EventPlan[];
  onDelete: (id: string) => void;
  onOpenCreateModal: () => void;
  onLoadDemos?: () => void;
}

export default function SavedEventsList({
  events,
  onDelete,
  onOpenCreateModal,
  onLoadDemos,
}: SavedEventsListProps) {
  const getBadgeStyle = (type: EventPlan['eventType']) => {
    switch (type) {
      case 'wedding':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: Heart,
          borderAccent: 'hover:border-rose-300',
        };
      case 'birthday':
        return {
          bg: 'bg-violet-50 text-violet-700 border-violet-200',
          icon: PartyPopper,
          borderAccent: 'hover:border-violet-300',
        };
      case 'community':
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: Users,
          borderAccent: 'hover:border-emerald-300',
        };
    }
  };

  return (
    <section id="saved-events" className="w-full py-16 bg-white border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              <BookmarkCheck className="w-4 h-4 text-neutral-700" />
              <span>Local Storage Vault</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Your Saved Event Blueprints
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Persisted in browser storage — accessible immediately without login.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {events.length === 0 && onLoadDemos && (
              <button
                onClick={onLoadDemos}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-neutral-300 hover:bg-neutral-50 transition text-neutral-700"
              >
                Load Sample Plans
              </button>
            )}
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              New Event
            </button>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center bg-neutral-50/50">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-neutral-800">No saved events yet</h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto mt-1 mb-5">
              Launch the 3-step AI intake wizard above or click below to load pre-crafted sample wedding and birthday blueprints.
            </p>
            <div className="flex justify-center gap-3">
              {onLoadDemos && (
                <button
                  onClick={onLoadDemos}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700"
                >
                  Load Sample Plans
                </button>
              )}
              <button
                onClick={onOpenCreateModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800"
              >
                Create Event
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const badge = getBadgeStyle(event.eventType);
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={event.id}
                  className={`group bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${badge.borderAccent}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${badge.bg}`}
                      >
                        <BadgeIcon className="w-3.5 h-3.5" />
                        {event.eventType}
                      </span>
                      <button
                        onClick={() => onDelete(event.id)}
                        title="Delete event"
                        className="text-neutral-300 hover:text-red-500 p-1 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-neutral-900 text-base line-clamp-1 group-hover:text-neutral-700">
                      {event.eventName}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                      {event.summary || event.vibe}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="truncate">{event.date || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="truncate">{event.location || 'Anywhere'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{event.guestCount} guests</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                        <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                        <span>
                          {event.currency}
                          {Number(event.totalBudget).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400">
                      {event.budgetBreakdown?.length || 0} categories · {event.timeline?.length || 0} tasks
                    </span>
                    <Link
                      href={`/events/${event.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-neutral-600 group-hover:underline"
                    >
                      Open Workspace
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
