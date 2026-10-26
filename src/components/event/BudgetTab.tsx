'use client';

import React, { useState } from 'react';
import { Plus, Trash2, DollarSign, AlertTriangle, CheckCircle2, TrendingUp, PieChart } from 'lucide-react';
import { EventPlan, BudgetItem } from '@/types/event';

interface BudgetTabProps {
  event: EventPlan;
  onUpdate: (updatedEvent: EventPlan) => void;
}

const BAR_COLORS = ['bg-indigo-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-sky-500', 'bg-teal-500'];

export default function BudgetTab({ event, onUpdate }: BudgetTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newEstimatedCost, setNewEstimatedCost] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const items = event.budgetBreakdown || [];
  const currency = event.currency || '$';

  const totalEstimated = items.reduce((sum, i) => sum + Number(i.estimatedCost || 0), 0);
  const totalActual = items.reduce((sum, i) => sum + Number(i.actualCost || 0), 0);
  const remaining = Number(event.totalBudget) - (totalActual > 0 ? totalActual : totalEstimated);
  const isOverBudget = remaining < 0;

  const recalculatePercentages = (newItems: BudgetItem[]): BudgetItem[] => {
    const totalEst = newItems.reduce((sum, i) => sum + Number(i.estimatedCost || 0), 0);
    return newItems.map((item) => ({
      ...item,
      percentage: totalEst > 0 ? Math.round((Number(item.estimatedCost || 0) / totalEst) * 100) : 0,
    }));
  };

  const handleCostChange = (id: string, field: 'estimatedCost' | 'actualCost', value: number) => {
    const updated = items.map((item) => (item.id === id ? { ...item, [field]: Math.max(0, value) } : item));
    onUpdate({ ...event, budgetBreakdown: field === 'estimatedCost' ? recalculatePercentages(updated) : updated });
  };

  const handleDeleteItem = (id: string) => {
    onUpdate({ ...event, budgetBreakdown: recalculatePercentages(items.filter((i) => i.id !== id)) });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const newItem: BudgetItem = {
      id: 'b_' + Date.now().toString(36),
      category: newCategory.trim(),
      estimatedCost: Number(newEstimatedCost) || 0,
      actualCost: 0,
      percentage: 0,
      notes: newNotes.trim() || 'Custom budget item',
    };
    onUpdate({ ...event, budgetBreakdown: recalculatePercentages([...items, newItem]) });
    setNewCategory('');
    setNewEstimatedCost('');
    setNewNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase">Total Budget</span>
          <p className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">{currency}{Number(event.totalBudget).toLocaleString()}</p>
          <span className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1"><DollarSign className="w-3 h-3 text-neutral-400" /> Target ceiling</span>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase">Estimated Spend</span>
          <p className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">{currency}{totalEstimated.toLocaleString()}</p>
          <span className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-blue-500" /> Across {items.length} items</span>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase">Actual Spent</span>
          <p className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">{currency}{totalActual.toLocaleString()}</p>
          <span className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Incurred costs</span>
        </div>
        <div className={`rounded-2xl border p-4 shadow-2xs ${isOverBudget ? 'bg-red-50/70 border-red-200 text-red-900' : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'}`}>
          <span className="text-[11px] font-semibold uppercase opacity-80">{isOverBudget ? 'Over Budget By' : 'Remaining'}</span>
          <p className={`text-xl sm:text-2xl font-bold mt-1 ${isOverBudget ? 'text-red-700' : 'text-emerald-700'}`}>{currency}{Math.abs(remaining).toLocaleString()}</p>
          <span className="text-[11px] mt-1 flex items-center gap-1 opacity-90">
            {isOverBudget ? <AlertTriangle className="w-3 h-3 text-red-600" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            {isOverBudget ? 'Exceeds budget' : 'Available reserves'}
          </span>
        </div>
      </div>

      {/* 2. Visual Stacked Category Distribution Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-neutral-800 uppercase flex items-center gap-1.5"><PieChart className="w-3.5 h-3.5" /> Category Spend Distribution</h3>
          <span className="text-xs text-neutral-500">{items.length} Categories</span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-neutral-100">
          {items.map((item, idx) => (
            <div key={item.id} className={`${BAR_COLORS[idx % BAR_COLORS.length]} transition-all duration-300`} style={{ width: `${Math.max(2, item.percentage)}%` }} title={`${item.category}: ${item.percentage}%`} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[11px] text-neutral-600">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${BAR_COLORS[idx % BAR_COLORS.length]}`} />
              <span className="font-medium">{item.category}</span>
              <span className="text-neutral-400">({item.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Interactive Budget Items Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900">Line Item Expenses</h3>
          <button onClick={() => setShowAddForm(!showAddForm)} className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1 transition">
            <Plus className="w-3.5 h-3.5" /> Add Category
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddItem} className="p-4 bg-neutral-50/80 border-b border-neutral-200 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Category</label>
              <input type="text" placeholder="e.g., Live Band" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs bg-white" />
            </div>
            <div className="w-28">
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Cost ({currency})</label>
              <input type="number" min="0" placeholder="0" value={newEstimatedCost} onChange={(e) => setNewEstimatedCost(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs bg-white" />
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Notes / Tip</label>
              <input type="text" placeholder="Cost-saving tip" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs bg-white" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800">Save</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1.5 border text-neutral-600 text-xs rounded-lg hover:bg-white">Cancel</button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/60 border-b border-neutral-200 text-neutral-500 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 w-36">Estimated ({currency})</th>
                <th className="py-3 px-4 w-36">Actual ({currency})</th>
                <th className="py-3 px-4 w-20">Share</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/50 transition">
                  <td className="py-3 px-4 font-semibold text-neutral-900">{item.category}</td>
                  <td className="py-3 px-4">
                    <input type="number" min="0" value={item.estimatedCost} onChange={(e) => handleCostChange(item.id, 'estimatedCost', Number(e.target.value))} className="w-24 px-2 py-1 rounded-md border border-neutral-200 text-xs font-semibold bg-white" />
                  </td>
                  <td className="py-3 px-4">
                    <input type="number" min="0" value={item.actualCost} onChange={(e) => handleCostChange(item.id, 'actualCost', Number(e.target.value))} className="w-24 px-2 py-1 rounded-md border border-neutral-200 text-xs font-semibold bg-white" />
                  </td>
                  <td className="py-3 px-4 font-semibold text-neutral-500">{item.percentage}%</td>
                  <td className="py-3 px-4 text-neutral-600 max-w-xs">{item.notes}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleDeleteItem(item.id)} className="text-neutral-300 hover:text-red-500 p-1 rounded-md transition" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
