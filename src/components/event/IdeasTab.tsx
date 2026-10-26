'use client';

import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Lightbulb, Plus, Trash2, Sparkles, Filter } from 'lucide-react';
import { EventPlan, IdeaItem } from '@/types/event';

interface IdeasTabProps {
  event: EventPlan;
  onUpdate: (updatedEvent: EventPlan) => void;
}

export default function IdeasTab({ event, onUpdate }: IdeasTabProps) {
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Theme' | 'Food & Drink' | 'Icebreaker/Activity' | 'Memorable Touch'>('Theme');
  const [newDescription, setNewDescription] = useState('');
  const [newDiyOption, setNewDiyOption] = useState('');

  const ideas = event.personalizedIdeas || [];
  const bookmarkedCount = ideas.filter((i) => i.bookmarked).length;

  const handleToggleBookmark = (id: string) => {
    const updated = ideas.map((idea) =>
      idea.id === id ? { ...idea, bookmarked: !idea.bookmarked } : idea
    );
    onUpdate({ ...event, personalizedIdeas: updated });
  };

  const handleDeleteIdea = (id: string) => {
    const updated = ideas.filter((i) => i.id !== id);
    onUpdate({ ...event, personalizedIdeas: updated });
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newIdea: IdeaItem = {
      id: 'i_' + Date.now().toString(36),
      category: newCategory,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Custom themed concept',
      diyOption: newDiyOption.trim() || 'Creative homemade alternative',
      bookmarked: true,
    };

    onUpdate({ ...event, personalizedIdeas: [...ideas, newIdea] });
    setNewTitle('');
    setNewDescription('');
    setNewDiyOption('');
    setShowAddForm(false);
  };

  const filteredIdeas = filterBookmarked ? ideas.filter((i) => i.bookmarked) : ideas;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Theme':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Food & Drink':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Icebreaker/Activity':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Memorable Touch':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Studio Header with Filter & Add Button */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Personalized Ideas Studio</h3>
          <p className="text-xs text-neutral-500">
            AI-curated aesthetic concepts and clever DIY hacks tailored to your vibe.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterBookmarked(!filterBookmarked)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              filterBookmarked
                ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarked ({bookmarkedCount})</span>
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Idea
          </button>
        </div>
      </div>

      {/* 2. Add Idea Form */}
      {showAddForm && (
        <form onSubmit={handleAddIdea} className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-neutral-900 uppercase">Create Custom Concept</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Idea title (e.g., Polaroid Audio Wall)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs sm:col-span-2"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as typeof newCategory)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs bg-white"
            >
              <option value="Theme">Theme</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Icebreaker/Activity">Activity</option>
              <option value="Memorable Touch">Memorable Touch</option>
            </select>
          </div>
          <textarea
            rows={2}
            placeholder="Concept description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
          />
          <input
            type="text"
            placeholder="💡 DIY Budget Hack: How to achieve this affordably"
            value={newDiyOption}
            onChange={(e) => setNewDiyOption(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1 text-xs border rounded-lg hover:bg-neutral-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-1 text-xs bg-neutral-900 text-white rounded-lg hover:bg-neutral-800">
              Save Idea
            </button>
          </div>
        </form>
      )}

      {/* 3. Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-400 text-xs">
          No ideas found in this filter view.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredIdeas.map((idea) => {
            const isSaved = Boolean(idea.bookmarked);
            return (
              <div
                key={idea.id}
                className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs flex flex-col justify-between hover:border-neutral-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryColor(idea.category)}`}>
                      {idea.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleBookmark(idea.id)}
                        className={`p-1.5 rounded-lg transition ${
                          isSaved ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50'
                        }`}
                        title={isSaved ? 'Bookmarked' : 'Bookmark this idea'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteIdea(idea.id)}
                        className="text-neutral-300 hover:text-red-500 p-1"
                        title="Delete idea"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-900 mb-1.5">{idea.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-4">{idea.description}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950">
                  <p className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-600" /> DIY Budget Hack:
                  </p>
                  <p className="text-[11px] leading-relaxed text-emerald-900/90">{idea.diyOption}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
