import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  Save,
  Compass,
  RefreshCw,
  Lightbulb,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { TripPlan, PersonaType } from '../../types/travel';
import { useI18n } from '../../i18n';
import { API_URL } from '../../config';

interface AITripPlannerViewProps {
  onSaveTrip: (trip: TripPlan) => Promise<boolean>;
  currency: 'BDT' | 'USD';
  selectedPersona: PersonaType;
  initialDestination?: string;
  isAuthenticated: boolean;
  openAuthModal: () => void;
}

export const AITripPlannerView: React.FC<AITripPlannerViewProps> = ({
  onSaveTrip,
  currency,
  selectedPersona,
  initialDestination = 'Sajek Valley',
  isAuthenticated,
  openAuthModal,
}) => {
  const { t } = useI18n();
  const [destination, setDestination] = useState(initialDestination);
  const [budgetBDT, setBudgetBDT] = useState<number>(12000);
  const [days, setDays] = useState<number>(3);
  const [persona, setPersona] = useState<PersonaType>(selectedPersona);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<TripPlan | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const destinationsList = [
    'Sajek Valley',
    'Cox\'s Bazar & Marine Drive',
    'Bandarban & Nilgiri',
    'Kaptai Lake & Rangamati',
    'Chandranath Hill Sitakunda',
    'Khoiyachora Waterfall Mirsarai',
    'Patenga Beach Chattogram',
    'Saint Martin\'s Island',
    'Boga Lake & Keokradong',
  ];

  const personasList: PersonaType[] = [
    'Solo Travelers',
    'Couples',
    'Families',
    'Foreign Tourists',
    'Female Travelers',
    'Backpackers',
  ];

  const formatCost = (bdt: number) => {
    if (currency === 'USD') {
      return `$${Math.round(bdt / 115)}`;
    }
    return `৳${bdt.toLocaleString()} BDT`;
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setSavedSuccess(false);

    try {
      const response = await fetch(`${API_URL}/api/plan-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days,
          budgetBDT,
          persona,
        }),
      });

      const data = await response.json();
      if (data.success && data.plan) {
        const planWithId: TripPlan = {
          ...data.plan,
          id: '',
          status: 'Upcoming',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + Number(days) * 86400000).toISOString().split('T')[0],
          createdDate: new Date().toISOString().split('T')[0],
        };
        setGeneratedPlan(planWithId);
      }
    } catch (err) {
      console.error('Error generating AI plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToMyTrips = async () => {
    if (!generatedPlan) return;
    // Guests are asked to log in first; the trip is stored against their account
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setIsSaving(true);
    const ok = await onSaveTrip(generatedPlan);
    setIsSaving(false);
    if (ok) setSavedSuccess(true);
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      
      {/* 1. Header matching Wireframe Page 12 ("AI Travel Assistance") */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>AI TRAVEL ASSISTANT</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Smart Chattogram Itinerary Generator</h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Tailor-made itineraries for Chattogram Division powered by server-side Gemini 3.6 AI.
        </p>
      </div>

      {/* 2. Main Wireframe Layout matching Page 12 (Input Box + Travel Recommendations sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Form Box matching Page 12 Wireframe */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Trip Parameters</span>
          </h2>

          <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs">
            
            {/* Destination Input */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Destination (Chattogram Division)</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500/30 outline-none"
                >
                  {destinationsList.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget Dropdown / Range */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Estimated Total Budget: <span className="text-emerald-700 font-extrabold">{formatCost(budgetBDT)}</span>
              </label>
              <input
                type="range"
                min="3000"
                max="30000"
                step="1000"
                value={budgetBDT}
                onChange={(e) => setBudgetBDT(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Days Dropdown */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Duration (Days)</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500/30 outline-none"
                >
                  <option value={1}>1 Day Short Trip</option>
                  <option value={2}>2 Days Weekend Escape</option>
                  <option value={3}>3 Days Complete Tour</option>
                  <option value={4}>4 Days Extended Trek</option>
                  <option value={5}>5 Days Full Expedition</option>
                  <option value={7}>7 Days Comprehensive Tour</option>
                </select>
              </div>
            </div>

            {/* Persona Dropdown */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Traveler Persona</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value as PersonaType)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500/30 outline-none"
                >
                  {personasList.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Plan Button matching Page 12 wireframe ("Generate Plan") */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                  <span>Consulting Gemini AI Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Generate Plan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Travel Recommendation Sidebar matching Page 12 Wireframe */}
        <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Travel Recommendations</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
              <span className="font-bold text-emerald-400 block text-[11px]">Recommended Local Food:</span>
              <p className="text-slate-300 text-[11px]">
                Bamboo Roasted Chicken in Sajek/Bandarban, Mezbani Beef in Chattogram City, Fresh Crab Grill in Patenga/Cox's Bazar.
              </p>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
              <span className="font-bold text-teal-400 block text-[11px]">Transport Advice:</span>
              <p className="text-slate-300 text-[11px]">
                Hire registered Chander Gari jeeps for hill districts. Reach Dighinala Army Camp checkpost before 10 AM or 3 PM convoy.
              </p>
            </div>

            <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/80 space-y-1">
              <span className="font-bold text-emerald-300 flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Security Checklist:</span>
              </span>
              <p className="text-emerald-100 text-[11px]">
                Keep 4-5 photocopies of NID/Passport for military checkpoints in hill tract regions.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 3. OUTPUT OF GIVEN INFORMATION Box matching Page 12 Wireframe */}
      {generatedPlan && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded-full mb-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>AI Plan Output</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">{generatedPlan.title}</h2>
              <p className="text-xs text-slate-500">
                Destination: {generatedPlan.destination} • {generatedPlan.days} Days • Persona: {generatedPlan.persona}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block">TOTAL ESTIMATED EXPENSE</span>
                <span className="text-lg font-black text-emerald-800">{formatCost(generatedPlan.budgetBDT)}</span>
              </div>

              {!savedSuccess ? (
                <button
                  onClick={handleSaveToMyTrips}
                  disabled={isSaving}
                  className="btn-brand px-4 py-2 text-white font-bold text-xs rounded-xl flex items-center gap-2 disabled:opacity-60"
                  title={!isAuthenticated ? t('planner.loginToSave') : undefined}
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isSaving ? t('planner.saving') : isAuthenticated ? t('planner.save') : t('planner.loginToSave')}</span>
                </button>
              ) : (
                <span className="px-4 py-2 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-emerald-300">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{t('planner.saved')}</span>
                </span>
              )}
            </div>
          </div>

          {/* Day-by-day Itinerary Schedule */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Day-by-Day Customized Schedule</h3>
            
            <div className="space-y-4">
              {generatedPlan.itinerary.map((day) => (
                <div key={day.day} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="font-extrabold text-emerald-800 text-xs px-2.5 py-1 bg-emerald-100 rounded-lg">
                      DAY {day.day}: {day.title}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      Daily Expense: ~{formatCost(day.estExpenseBDT)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-100 space-y-1">
                      <span className="font-bold text-amber-600 block text-[10px] uppercase">Morning</span>
                      <p className="text-slate-700">{day.morning}</p>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-100 space-y-1">
                      <span className="font-bold text-emerald-600 block text-[10px] uppercase">Afternoon</span>
                      <p className="text-slate-700">{day.afternoon}</p>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-100 space-y-1">
                      <span className="font-bold text-teal-600 block text-[10px] uppercase">Evening</span>
                      <p className="text-slate-700">{day.evening}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          {generatedPlan.notes && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span><strong>Travel Advisory:</strong> {generatedPlan.notes}</span>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
