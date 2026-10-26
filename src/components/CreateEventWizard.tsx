'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { EventType, CreateEventInput, EventPlan } from '@/types/event';
import { createInitialEventPlan, saveEvent } from '@/lib/storage';
import StepBasics from './wizard/StepBasics';
import StepBudget from './wizard/StepBudget';
import StepVibe from './wizard/StepVibe';
import WizardLoadingState from './wizard/WizardLoadingState';
import { THEME_TAGS_BY_TYPE } from './wizard/constants';

interface CreateEventWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: EventType;
  onSuccess?: (event: EventPlan) => void;
}

export default function CreateEventWizard({
  isOpen,
  onClose,
  initialType = 'wedding',
  onSuccess,
}: CreateEventWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  const [formData, setFormData] = useState<CreateEventInput>({
    eventType: initialType,
    eventName: '',
    date: '',
    location: '',
    guestCount: 75,
    totalBudget: 5000,
    currency: '$',
    vibe: '',
    specialRequests: '',
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customVibe, setCustomVibe] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev < 2 ? prev + 1 : prev));
      }, 1300);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isOpen) return null;

  const currentTags = THEME_TAGS_BY_TYPE[formData.eventType] || [];

  const handleTypeSelect = (type: EventType) => {
    setFormData((prev) => ({ ...prev, eventType: type }));
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
      if (!formData.date) newErrors.date = 'Please select a date';
      if (!formData.location.trim()) newErrors.location = 'Location or city is required';
    } else if (currentStep === 2) {
      if (formData.guestCount < 1) newErrors.guestCount = 'Guest count must be at least 1';
      if (formData.totalBudget <= 0) newErrors.totalBudget = 'Please enter a valid budget';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setIsLoading(true);
    setLoadingStage(0);

    const fullVibe = [
      ...selectedTags,
      customVibe.trim() ? customVibe.trim() : null,
    ].filter(Boolean).join(', ') || 'Custom Curated Vibe';

    const payload: CreateEventInput = { ...formData, vibe: fullVibe };

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const planToSave: EventPlan = data.plan || createInitialEventPlan(payload);

      saveEvent(planToSave);
      if (onSuccess) onSuccess(planToSave);
      onClose();
      router.push(`/events/${planToSave.id}`);
    } catch (err) {
      console.error('Error generating event plan with Gemini API:', err);
      const fallbackPlan = createInitialEventPlan(payload);
      saveEvent(fallbackPlan);
      if (onSuccess) onSuccess(fallbackPlan);
      onClose();
      router.push(`/events/${fallbackPlan.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  const activeAccent =
    formData.eventType === 'wedding'
      ? { border: 'border-rose-500', bg: 'bg-rose-50', text: 'text-rose-600', button: 'bg-rose-600 hover:bg-rose-700' }
      : formData.eventType === 'birthday'
      ? { border: 'border-violet-500', bg: 'bg-violet-50', text: 'text-violet-600', button: 'bg-violet-600 hover:bg-violet-700' }
      : { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600', button: 'bg-emerald-600 hover:bg-emerald-700' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${activeAccent.bg} ${activeAccent.text}`}>
                <Sparkles className="w-3.5 h-3.5" />
                {isLoading ? 'Generating with Gemini' : `Step ${step} of 3`}
              </span>
              <h2 className="text-lg font-bold text-neutral-900">
                {isLoading ? 'Creating Your AI Blueprint' : 'Create New Event'}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">EventCraft AI Intake</p>
          </div>
          {!isLoading && (
            <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="w-full bg-neutral-100 h-1">
          <div
            className={`h-full transition-all duration-300 ${
              formData.eventType === 'wedding' ? 'bg-rose-500' : formData.eventType === 'birthday' ? 'bg-violet-500' : 'bg-emerald-500'
            }`}
            style={{ width: isLoading ? '100%' : `${(step / 3) * 100}%` }}
          />
        </div>

        {isLoading ? (
          <WizardLoadingState currentStage={loadingStage} eventType={formData.eventType} />
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
            {step === 1 && (
              <StepBasics formData={formData} setFormData={setFormData} onTypeSelect={handleTypeSelect} errors={errors} activeAccent={activeAccent} />
            )}
            {step === 2 && (
              <StepBudget formData={formData} setFormData={setFormData} errors={errors} />
            )}
            {step === 3 && (
              <StepVibe
                formData={formData}
                setFormData={setFormData}
                currentTags={currentTags}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                customVibe={customVibe}
                setCustomVibe={setCustomVibe}
                activeAccent={activeAccent}
              />
            )}

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              {step > 1 ? (
                <button type="button" onClick={() => setStep((p) => (p - 1) as 1 | 2 | 3)} className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1 transition">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-500 hover:bg-neutral-50 transition">
                  Cancel
                </button>
              )}

              {step < 3 ? (
                <button type="button" onClick={() => validateStep(step) && setStep((p) => (p + 1) as 1 | 2 | 3)} className="px-5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1 shadow-xs transition">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" className={`px-5 py-2 rounded-xl text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition ${activeAccent.button}`}>
                  <Sparkles className="w-4 h-4" /> Generate Event Blueprint
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
