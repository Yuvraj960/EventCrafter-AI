'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Heart,
  PartyPopper,
  Users,
  Gauge,
  Sparkles,
  Printer,
} from 'lucide-react';
import { EventPlan } from '@/types/event';

interface EventHeaderProps {
  event: EventPlan;
  onOpenCopilot?: () => void;
}

export default function EventHeader({ event, onOpenCopilot }: EventHeaderProps) {
  const calculateCountdown = () => {
    if (!event.date) return 'Date TBD';
    const target = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return `${diffDays} days to go`;
    if (diffDays === 1) return 'Tomorrow!';
    if (diffDays === 0) return 'Today is the day! 🎉';
    return `Celebrated ${Math.abs(diffDays)}d ago`;
  };

  const calculateReadiness = () => {
    const totalTasks = event.timeline?.length || 0;
    const completedTasks = event.timeline?.filter((t) => t.completed).length || 0;
    const taskScore = totalTasks > 0 ? (completedTasks / totalTasks) * 45 : 0;

    const totalVendors = event.vendorChecklist?.length || 0;
    const bookedVendors = event.vendorChecklist?.filter((v) => v.status === 'Booked' || v.status === 'Quoted').length || 0;
    const vendorScore = totalVendors > 0 ? (bookedVendors / totalVendors) * 35 : 0;

    const budgetAllocated = event.budgetBreakdown?.reduce((acc, i) => acc + Number(i.estimatedCost || 0), 0) || 0;
    const budgetScore = event.totalBudget > 0 && budgetAllocated > 0 ? 20 : 0;

    return Math.min(100, Math.round(taskScore + vendorScore + budgetScore));
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const readiness = calculateReadiness();
  const countdownText = calculateCountdown();

  const themeConfig =
    event.eventType === 'wedding'
      ? { badge: 'bg-rose-50 text-rose-700 border-rose-200', icon: Heart }
      : event.eventType === 'birthday'
      ? { badge: 'bg-violet-50 text-violet-700 border-violet-200', icon: PartyPopper }
      : { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Users };

  const BadgeIcon = themeConfig.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-2xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition shrink-0"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950 truncate max-w-xs sm:max-w-md">
                {event.eventName}
              </h1>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${themeConfig.badge}`}>
                <BadgeIcon className="w-3 h-3" />
                {event.eventType}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5 truncate max-w-sm sm:max-w-md">
              {event.location ? `${event.location} · ` : ''}Vibe: <span className="font-medium text-neutral-700">{event.vibe}</span>
            </p>
          </div>
        </div>

        {/* Right: Actions, Countdown & Readiness */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap text-xs">
          {/* Print/Export Button */}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-semibold flex items-center gap-1.5 transition shadow-2xs"
            title="Export / Print Event Blueprint"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">Export / Print</span>
          </button>

          {/* AI Co-Pilot Toggle Button */}
          {onOpenCopilot && (
            <button
              onClick={onOpenCopilot}
              className="px-3 py-1.5 rounded-xl bg-neutral-950 text-white font-semibold flex items-center gap-1.5 hover:bg-neutral-800 transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Co-Pilot</span>
            </button>
          )}

          {/* Countdown Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 font-semibold">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>{countdownText}</span>
          </div>

          {/* Readiness Score Meter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 text-white shadow-2xs">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-400 font-medium">Readiness:</span>
              <span className="font-bold text-amber-300">{readiness}%</span>
            </div>
            <div className="w-10 bg-neutral-700 h-1.5 rounded-full overflow-hidden ml-0.5">
              <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${readiness}%` }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
