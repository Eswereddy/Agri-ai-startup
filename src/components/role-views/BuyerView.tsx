import React, { useState } from "react";
import {
  ShoppingBag,
  TrendingUp,
  Tag,
  DollarSign,
  Plus,
  Scale,
  Calendar,
  Check,
  Percent,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { MarketBid } from "../../types";
import { CropSellingMarketplace } from "../marketplace/CropSellingMarketplace";

interface BuyerViewProps {
  bids: MarketBid[];
  onAddBid: (newBid: MarketBid) => void;
  onUpdateBid: (id: string, updated: Partial<MarketBid>) => void;
}

export default function BuyerView({ bids, onAddBid, onUpdateBid }: BuyerViewProps) {
  const [buyerTab, setBuyerTab] = useState<"exchange" | "procurement">("exchange");
  const [cropType, setCropType] = useState("Premium Basmati Rice");
  const [quantity, setQuantity] = useState(15);
  const [quality, setQuality] = useState<"Grade A" | "Grade B" | "Grade C">("Grade A");
  const [pricePerTon, setPricePerTon] = useState(650);

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    const newBid: MarketBid = {
      id: `bid-${Date.now()}`,
      cropType,
      quantity,
      quality,
      pricePerTon,
      buyerName: "Global Agrifood Corp (Procurement)",
      status: "Active",
      date: new Date().toLocaleDateString()
    };
    onAddBid(newBid);
  };

  return (
    <div id="buyer-workspace" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-cyan-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-700/50 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-teal-200" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Commodity Procurement Board</h2>
          </div>
          <p className="text-teal-100/90 text-xs max-w-xl">
            Acquire premium harvests directly from verified smallholder farms and agricultural cooperatives. Secure smart contracts, audit quality compliance, and review automated pricing algorithms.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <p className="text-[10px] text-teal-200 uppercase tracking-widest font-semibold">Active Purchases</p>
            <p className="text-lg font-bold">{bids.filter((b) => b.status === "Accepted").length} Lots</p>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <p className="text-[10px] text-teal-200 uppercase tracking-widest font-semibold">Total Escrow</p>
            <p className="text-lg font-bold">$124,500</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigator */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setBuyerTab("exchange")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "exchange"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🌾 Crop Selling Exchange
        </button>
        <button
          type="button"
          onClick={() => setBuyerTab("procurement")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
            buyerTab === "procurement"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🛒 Procurement Intent Board
        </button>
      </div>

      {buyerTab === "exchange" ? (
        <CropSellingMarketplace currentRole="Buyer" />
      ) : (
        <>
          {/* Main Grid: Bid Submission & Active Contracts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Bid Form */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Plus className="h-4.5 w-4.5 text-teal-600" />
            Create Procurement Intent
          </h3>

          <form onSubmit={handlePlaceBid} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Crop Variety</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 focus:bg-white transition-colors font-medium text-slate-800"
              >
                <option value="Premium Basmati Rice">Premium Basmati Rice</option>
                <option value="Non-GMO Corn / Maize">Non-GMO Corn / Maize</option>
                <option value="Soft Red Winter Wheat">Soft Red Winter Wheat</option>
                <option value="Organic Soybean Seed">Organic Soybean Seed</option>
                <option value="Arabica Coffee Bean">Arabica Coffee Bean</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Quantity</label>
                <div className="relative">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">TONS</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Quality Grade</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="Grade A">Grade A (Premium)</option>
                  <option value="Grade B">Grade B (Standard)</option>
                  <option value="Grade C">Grade C (Industrial)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Offered Price</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  value={pricePerTon}
                  onChange={(e) => setPricePerTon(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-12 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                />
                <span className="absolute right-3.5 top-2.5 text-[10px] text-slate-400 font-bold">/ TON</span>
              </div>
            </div>

            <button
              id="buyer-submit-bid-btn"
              type="submit"
              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <DollarSign className="h-4 w-4" />
              Publish Escrow Contract
            </button>
          </form>
        </div>

        {/* Active Market Contracts List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Scale className="h-4.5 w-4.5 text-teal-600" />
              Active Procurement Lots & Escrow Bids
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
              SLA Compliant
            </span>
          </div>

          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {bids.map((bid) => (
              <div key={bid.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-teal-200 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800">{bid.cropType}</h4>
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                      bid.quality === "Grade A" ? "bg-emerald-50 text-emerald-700" : bid.quality === "Grade B" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {bid.quality}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                    <span>Buyer: {bid.buyerName}</span>
                    <span className="text-slate-300">•</span>
                    <span>Quantity: {bid.quantity} Tons</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Offered Rate</p>
                    <p className="text-sm font-extrabold text-slate-800">${bid.pricePerTon} <span className="text-[10px] text-slate-400 font-normal">/ton</span></p>
                  </div>

                  <div className="flex items-center gap-2">
                    {bid.status === "Active" ? (
                      <>
                        <button
                          onClick={() => onUpdateBid(bid.id, { status: "Accepted" })}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Check className="h-3 w-3" />
                          Accept Contract
                        </button>
                        <button
                          onClick={() => onUpdateBid(bid.id, { status: "Countered", pricePerTon: Math.round(bid.pricePerTon * 1.05) })}
                          className="px-2.5 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded text-[10px] font-bold cursor-pointer transition-all"
                        >
                          Counter Offer
                        </button>
                      </>
                    ) : (
                      <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                        bid.status === "Accepted" ? "bg-emerald-50 text-emerald-800" : bid.status === "Countered" ? "bg-amber-50 text-amber-800" : "bg-slate-200 text-slate-500"
                      }`}>
                        {bid.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demand & Pricing Forecast Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <TrendingUp className="h-4.5 w-4.5 text-teal-600" />
          AI Agricultural Demand and Price Prognosis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase">Basmati Rice Index</h4>
            <div className="flex items-baseline gap-1.5 mt-2">
              <p className="text-xl font-extrabold text-slate-800">$640</p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                <TrendingUp className="h-3 w-3" /> +4.2%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Strong regional monsoon disruptions limiting short-term stocks.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase">Non-GMO Maize Index</h4>
            <div className="flex items-baseline gap-1.5 mt-2">
              <p className="text-xl font-extrabold text-slate-800">$310</p>
              <span className="text-[10px] text-rose-500 font-bold flex items-center">
                <TrendingDown className="h-3 w-3" /> -1.8%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Harvest yields stabilizing after bumper crop supplies in Brazil.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase">Arabica Coffee Index</h4>
            <div className="flex items-baseline gap-1.5 mt-2">
              <p className="text-xl font-extrabold text-slate-800">$1,850</p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                <TrendingUp className="h-3 w-3" /> +12.5%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Severe frost outbreaks restricting export yields in major highlands.</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-100 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-bold text-teal-800 uppercase tracking-wide flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Market Health Protocol
              </h4>
              <p className="text-[10px] text-teal-900 mt-1.5 leading-relaxed">
                Escrow system locks funds, releasing automatically upon drone quality scan confirmation at delivery port.
              </p>
            </div>
            <div className="text-[9px] text-teal-700/80 font-bold uppercase mt-2">Verified SLA Standards Active</div>
          </div>
        </div>
      </div>
    </>
  )}
</div>
  );
}
