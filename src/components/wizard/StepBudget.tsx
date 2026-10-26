'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { CreateEventInput, CURRENCY_OPTIONS, CurrencySymbol } from '@/types/event';

interface StepBudgetProps {
  formData: CreateEventInput;
  setFormData: React.Dispatch<React.SetStateAction<CreateEventInput>>;
  errors: Record<string, string>;
}

export default function StepBudget({ formData, setFormData, errors }: StepBudgetProps) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
            Expected Guest Count
          </label>
          <span className="text-sm font-bold text-neutral-900">{formData.guestCount} guests</span>
        </div>
        <input
          type="range"
          min="5"
          max="500"
          step="5"
          value={formData.guestCount}
          onChange={(e) => setFormData((prev) => ({ ...prev, guestCount: Number(e.target.value) }))}
          className="w-full accent-neutral-900 cursor-pointer h-2 bg-neutral-200 rounded-lg"
        />
        <div className="flex gap-2 mt-2">
          {[25, 50, 100, 150, 250, 400].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, guestCount: count }))}
              className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                formData.guestCount === count
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
        {errors.guestCount && <p className="text-xs text-red-500 mt-1">{errors.guestCount}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
          Total Budget & Currency
        </label>
        <div className="flex gap-2">
          <select
            value={formData.currency}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, currency: e.target.value as CurrencySymbol }))
            }
            className="w-28 px-3 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            {CURRENCY_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.symbol}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-2.5 text-neutral-400 font-bold text-sm">
              {formData.currency}
            </span>
            <input
              type="number"
              min="100"
              step="100"
              placeholder="e.g., 5000"
              value={formData.totalBudget}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, totalBudget: Number(e.target.value) }))
              }
              className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>
        {errors.totalBudget && <p className="text-xs text-red-500 mt-1">{errors.totalBudget}</p>}
        <p className="text-xs text-neutral-400 mt-1.5 flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          Gemini AI will automatically distribute this budget across venue, catering, decor & photography.
        </p>
      </div>
    </div>
  );
}
