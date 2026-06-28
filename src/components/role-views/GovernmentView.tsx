import React, { useState } from "react";
import {
  Building,
  DollarSign,
  Users,
  Compass,
  FileCheck,
  Plus,
  ShieldAlert,
  Leaf,
  Globe,
  Sparkles,
  ClipboardCheck
} from "lucide-react";
import { SubsidyScheme } from "../../types";

interface GovernmentViewProps {
  schemes: SubsidyScheme[];
  onAddScheme: (newScheme: SubsidyScheme) => void;
  onUpdateScheme: (id: string, updated: Partial<SubsidyScheme>) => void;
}

export default function GovernmentView({
  schemes,
  onAddScheme,
  onUpdateScheme
}: GovernmentViewProps) {
  const [title, setTitle] = useState("Smallholder Solar Drip Irrigation Subsidy");
  const [category, setCategory] = useState<"Climate Resilience" | "Equipment" | "Organic Transition" | "Financial Relief">("Climate Resilience");
  const [fundingAmount, setFundingAmount] = useState(250000);
  const [description, setDescription] = useState("Funding to provide 80% subsidy for solar-powered micro-irrigation pump kits for rural smallholders.");

  const handleAddScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newScheme: SubsidyScheme = {
      id: `scheme-${Date.now()}`,
      title,
      category,
      fundingAmount,
      approvedCount: 0,
      status: "Active",
      description
    };
    onAddScheme(newScheme);
    setTitle("");
    setDescription("");
  };

  return (
    <div id="government-workspace" className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-750 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-800/60 rounded-xl">
              <Building className="h-6 w-6 text-emerald-200" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Agricultural Policy & Subsidy Board</h2>
          </div>
          <p className="text-emerald-100/95 text-xs max-w-xl">
            Authorize state subsidies, approve carbon credits, and implement disaster relief funds. Monitor soil health statistics and green energy transition metrics nationwide.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-semibold">Total Funds Sown</p>
            <p className="text-lg font-bold">$4.2M</p>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-semibold">Beneficiaries</p>
            <p className="text-lg font-bold">14.8K Farms</p>
          </div>
        </div>
      </div>

      {/* Grid: Create Scheme & List Schemes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Scheme */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Plus className="h-4.5 w-4.5 text-emerald-600" />
            Deploy Welfare / Subsidy Scheme
          </h3>

          <form onSubmit={handleAddScheme} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Scheme Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bio-fertilizer Transition Grant"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500 text-slate-800 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Policy Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Climate Resilience">Climate Resilience</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Organic Transition">Organic Transition</option>
                  <option value="Financial Relief">Financial Relief</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fund Allocation</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">$</span>
                  <input
                    type="number"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Strategic Goals</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe scope, eligibility parameters..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 leading-relaxed font-medium"
              />
            </div>

            <button
              id="gov-deploy-scheme-btn"
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Building className="h-4 w-4" />
              Publish Approved Policy
            </button>
          </form>
        </div>

        {/* List of Schemes */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <ClipboardCheck className="h-4.5 w-4.5 text-emerald-600" />
              Active Subsidies & Grants Programs
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
              Sovereign Audited
            </span>
          </div>

          <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
            {schemes.map((scheme) => (
              <div key={scheme.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-emerald-200 transition-colors">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800">{scheme.title}</h4>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 rounded uppercase">
                      {scheme.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{scheme.description}</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Total Budget</p>
                    <p className="text-sm font-extrabold text-slate-800">${scheme.fundingAmount.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateScheme(scheme.id, { approvedCount: scheme.approvedCount + 1 })}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
                    >
                      Approve Farmer Claim ({scheme.approvedCount})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sovereign Sustainability Indexes */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Globe className="h-4.5 w-4.5 text-emerald-600" />
          Sovereign Soil Carbon and Ecosystem Logs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase">National Carbon Offsetting Index</h4>
            <p className="text-lg font-extrabold text-emerald-700 mt-2">1,420 CO₂e Tons Saved</p>
            <p className="text-[10px] text-slate-500 mt-2">Aggregated offsets tracked via precision farm mulching records.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase">National Biodiversity Score</h4>
            <p className="text-lg font-extrabold text-teal-700 mt-2">78.4 / 100 Index</p>
            <p className="text-[10px] text-slate-500 mt-2">Acreage transitions away from intensive mono-cropping systems.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase">Water Table Preservation Average</h4>
            <p className="text-lg font-extrabold text-sky-700 mt-2">+1.8m Recharge</p>
            <p className="text-[10px] text-slate-500 mt-2">Verified recharges in areas employing solar sub-surface drip pumps.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
