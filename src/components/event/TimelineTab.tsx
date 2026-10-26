'use client';

import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Clock, Filter, Sparkles } from 'lucide-react';
import { EventPlan, TimelineItem } from '@/types/event';

interface TimelineTabProps {
  event: EventPlan;
  onUpdate: (updatedEvent: EventPlan) => void;
}

export default function TimelineTab({ event, onUpdate }: TimelineTabProps) {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed' | 'High Priority'>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('1 Month Before');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newDescription, setNewDescription] = useState('');

  const timeline = event.timeline || [];
  const completedCount = timeline.filter((t) => t.completed).length;
  const totalCount = timeline.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggleTask = (id: string) => {
    const updated = timeline.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    onUpdate({ ...event, timeline: updated });
  };

  const handleDeleteTask = (id: string) => {
    const updated = timeline.filter((t) => t.id !== id);
    onUpdate({ ...event, timeline: updated });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TimelineItem = {
      id: 't_' + Date.now().toString(36),
      timeframe: newTimeframe,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Custom planning milestone',
      priority: newPriority,
      completed: false,
    };

    onUpdate({ ...event, timeline: [...timeline, newTask] });
    setNewTitle('');
    setNewDescription('');
    setShowAddForm(false);
  };

  const filteredTasks = timeline.filter((task) => {
    if (filter === 'Pending') return !task.completed;
    if (filter === 'Completed') return task.completed;
    if (filter === 'High Priority') return task.priority === 'High';
    return true;
  });

  // Group filtered tasks by timeframe preserving natural order
  const groupedTasks: Record<string, TimelineItem[]> = {};
  filteredTasks.forEach((task) => {
    const key = task.timeframe || 'General Milestones';
    if (!groupedTasks[key]) groupedTasks[key] = [];
    groupedTasks[key].push(task);
  });

  const getPriorityBadge = (p: 'High' | 'Medium' | 'Low') => {
    switch (p) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Progress Bar & Filter Pills */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Milestone Completion</h3>
            <p className="text-xs text-neutral-500">
              {completedCount} of {totalCount} tasks completed ({progressPercent}%)
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1 self-start sm:self-auto transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Milestone
          </button>
        </div>

        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
          {(['All', 'Pending', 'Completed', 'High Priority'] as const).map((pill) => (
            <button
              key={pill}
              onClick={() => setFilter(pill)}
              className={`text-xs px-3 py-1 rounded-lg border font-medium transition ${
                filter === pill
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Add Milestone Form */}
      {showAddForm && (
        <form onSubmit={handleAddTask} className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-neutral-900 uppercase">Create New Milestone</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Milestone title (e.g., Book DJ & Sound system)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs sm:col-span-2 focus:ring-2 focus:ring-neutral-900"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as 'High' | 'Medium' | 'Low')}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs bg-white"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={newTimeframe}
              onChange={(e) => setNewTimeframe(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs bg-white"
            >
              <option value="3 Months Before">3 Months Before</option>
              <option value="1 Month Before">1 Month Before</option>
              <option value="2 Weeks Before">2 Weeks Before</option>
              <option value="Week Of">Week Of</option>
              <option value="Event Day">Event Day</option>
              <option value="Post-Event">Post-Event</option>
            </select>
            <input
              type="text"
              placeholder="Description or notes"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs sm:col-span-2"
            />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1 text-xs border rounded-lg hover:bg-neutral-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-1 text-xs bg-neutral-900 text-white rounded-lg hover:bg-neutral-800">
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* 3. Grouped Milestones List */}
      {Object.keys(groupedTasks).length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-400 text-xs">
          No milestones match the current filter.
        </div>
      ) : (
        Object.entries(groupedTasks).map(([timeframe, tasks]) => (
          <div key={timeframe} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">{timeframe}</h4>
              <span className="text-[11px] text-neutral-400">({tasks.length})</span>
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl border p-4 shadow-2xs flex items-start justify-between gap-3 transition-all ${
                    task.completed ? 'border-neutral-200/60 bg-neutral-50/40 opacity-75' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 text-neutral-400 hover:text-emerald-600 transition shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-300 hover:text-neutral-500" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold ${task.completed ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>
                          {task.title}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{task.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-neutral-300 hover:text-red-500 p-1 transition shrink-0"
                    title="Delete milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
