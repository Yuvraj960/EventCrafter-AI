'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Copy, Check, Bot, User, ArrowRight, CornerDownLeft } from 'lucide-react';
import { EventPlan } from '@/types/event';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventPlan;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AICopilotDrawer({ isOpen, onClose, event }: AICopilotDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your **EventCraft AI Co-Pilot**. I have full context on **"${event.eventName}"** (${event.guestCount} guests, budget of ${event.currency}${event.totalBudget}). How can I assist with your planning today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const firstVendor = event.vendorChecklist?.[0]?.vendorType || 'Photographer';

  const quickPrompts = [
    `Optimize my budget to save 15%`,
    `Draft an inquiry email to a ${firstVendor} for my event`,
    `Generate a Day-Of hour-by-hour run sheet`,
  ];

  const handleSend = async (textToSend: string) => {
    const prompt = textToSend.trim();
    if (!prompt || isLoading) return;

    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, event }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply || 'No response generated.' }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Connection issue. Please check your connection and try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-amber-300 flex items-center justify-center shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-neutral-900">AI Event Co-Pilot</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Gemini 2.5
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 truncate max-w-xs">Context: {event.eventName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-neutral-50/50 border-b border-neutral-100 flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition flex items-center gap-1"
            >
              <span>{prompt}</span>
              <ArrowRight className="w-3 h-3 text-neutral-400" />
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-neutral-900 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`relative max-w-[85%] rounded-2xl p-3.5 ${
                msg.role === 'user' ? 'bg-neutral-900 text-white rounded-tr-xs' : 'bg-neutral-100/80 text-neutral-800 rounded-tl-xs border border-neutral-200/60'
              }`}>
                <div className="prose prose-xs max-w-none whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.content, i)}
                    className="mt-2 text-[10px] text-neutral-400 hover:text-neutral-700 flex items-center gap-1 transition"
                  >
                    {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === i ? 'Copied to clipboard' : 'Copy'}</span>
                  </button>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-neutral-400 text-xs italic pl-9">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>Co-Pilot is analyzing event parameters...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 border-t border-neutral-100 flex gap-2 items-center bg-white"
        >
          <input
            type="text"
            placeholder="Ask AI Co-Pilot anything about this event..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 transition shadow-2xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
