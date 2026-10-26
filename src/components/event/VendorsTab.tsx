'use client';

import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle, ChevronDown, ChevronUp, DollarSign, Store, CheckCircle2 } from 'lucide-react';
import { EventPlan, VendorItem, VendorStatus } from '@/types/event';

interface VendorsTabProps {
  event: EventPlan;
  onUpdate: (updatedEvent: EventPlan) => void;
}

export default function VendorsTab({ event, onUpdate }: VendorsTabProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVendorType, setNewVendorType] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  const vendors = event.vendorChecklist || [];
  const currency = event.currency || '$';

  const toggleAccordion = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStatusChange = (id: string, newStatus: VendorStatus) => {
    const updated = vendors.map((v) => (v.id === id ? { ...v, status: newStatus } : v));
    onUpdate({ ...event, vendorChecklist: updated });
  };

  const handleDeleteVendor = (id: string) => {
    const updated = vendors.filter((v) => v.id !== id);
    onUpdate({ ...event, vendorChecklist: updated });
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorType.trim()) return;

    const newVendor: VendorItem = {
      id: 'v_' + Date.now().toString(36),
      vendorType: newVendorType.trim(),
      status: 'Researching',
      estimatedBudget: Number(newBudget) || 0,
      questionsToAsk: newQuestion.trim()
        ? [newQuestion.trim()]
        : ['What is your cancellation and deposit refund policy?', 'Can you provide references from recent clients?'],
    };

    onUpdate({ ...event, vendorChecklist: [...vendors, newVendor] });
    setNewVendorType('');
    setNewBudget('');
    setNewQuestion('');
    setShowAddForm(false);
  };

  const getStatusColor = (status: VendorStatus) => {
    switch (status) {
      case 'Booked':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'Quoted':
        return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'Researching':
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Vendor Checklist & Sourcing</h3>
          <p className="text-xs text-neutral-500">
            Track inquiries, compare quotes, and book key event partners.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1 transition self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Add Vendor
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddVendor} className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-neutral-900 uppercase">Add Partner / Vendor</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Vendor type (e.g., Floral Designer, Photo Booth)"
              value={newVendorType}
              onChange={(e) => setNewVendorType(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
            />
            <input
              type="number"
              placeholder={`Allocated budget (${currency})`}
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
            />
          </div>
          <input
            type="text"
            placeholder="Initial interview question to ask"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1 text-xs border rounded-lg hover:bg-neutral-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-1 text-xs bg-neutral-900 text-white rounded-lg hover:bg-neutral-800">
              Save Vendor
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((vendor) => {
          const isExpanded = expandedIds.includes(vendor.id);
          return (
            <div key={vendor.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs flex flex-col justify-between hover:border-neutral-300 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-neutral-500" />
                    <h4 className="text-sm font-bold text-neutral-900">{vendor.vendorType}</h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={vendor.status}
                      onChange={(e) => handleStatusChange(vendor.id, e.target.value as VendorStatus)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold focus:outline-none transition ${getStatusColor(vendor.status)}`}
                    >
                      <option value="Researching">Researching</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Booked">Booked</option>
                    </select>
                    <button onClick={() => handleDeleteVendor(vendor.id)} className="text-neutral-300 hover:text-red-500 p-1" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-neutral-600 mb-3">
                  <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Budget: {currency}{Number(vendor.estimatedBudget).toLocaleString()}</span>
                </div>

                <div className="border border-neutral-200/80 rounded-xl overflow-hidden bg-neutral-50/50">
                  <button
                    onClick={() => toggleAccordion(vendor.id)}
                    className="w-full px-3 py-2 text-xs font-semibold text-neutral-700 flex items-center justify-between hover:bg-neutral-100/50 transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
                      Questions to Ask Before Booking ({vendor.questionsToAsk?.length || 0})
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-3 pt-1 border-t border-neutral-200/50 bg-white text-xs space-y-1.5">
                      {vendor.questionsToAsk?.map((q, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-neutral-600 leading-relaxed">
                          <span className="text-neutral-400 font-bold">•</span>
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
