import React, { useState } from "react";
import {
  ShieldAlert,
  Sliders,
  CheckCircle,
  Database,
  Activity,
  UserCheck,
  AlertTriangle,
  FileCheck,
  Percent,
  TrendingUp,
  XCircle
} from "lucide-react";

interface AdminViewProps {
  actors: { id: string; name: string; email: string; role: string; status: string }[];
  onVerifyActor: (id: string, status: string) => void;
}

export default function AdminView({ actors, onVerifyActor }: AdminViewProps) {
  return (
    <div id="admin-workspace" className="space-y-6 animate-in fade-in">
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-800/60 rounded-xl">
              <ShieldAlert className="h-6 w-6 text-slate-200" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Platform Governance & Security Suite</h2>
          </div>
          <p className="text-slate-300 text-xs max-w-xl">
            Audit newly registered farmers and agricultural commodity buyers, manage escrow contract overrides, and oversee API health metrics and platform fraud metrics.
          </p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
            <p className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">Verified Actors</p>
            <p className="text-lg font-bold">{actors.filter((a) => a.status === "Approved").length} Active</p>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
            <p className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">Security Level</p>
            <p className="text-lg font-bold text-emerald-400">SOC-2 Active</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Queue */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <UserCheck className="h-4.5 w-4.5 text-slate-600" />
              Identity Verification Queue
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
              SLA: 24h Left
            </span>
          </div>

          <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
            {actors.map((actor) => (
              <div key={actor.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800">{actor.name}</h4>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-700 rounded uppercase">
                      {actor.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">{actor.email} • ID: {actor.id}</p>
                </div>

                <div className="flex items-center gap-2">
                  {actor.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => onVerifyActor(actor.id, "Approved")}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Approve Identity
                      </button>
                      <button
                        onClick={() => onVerifyActor(actor.id, "Rejected")}
                        className="px-2.5 py-1.5 bg-rose-50 text-rose-800 hover:bg-rose-100 rounded text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded ${
                      actor.status === "Approved" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                    }`}>
                      {actor.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Monitoring logs */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Database className="h-4.5 w-4.5 text-slate-600" />
              Ecosystem Gateways & Node Health
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
              Stable
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span> Express Applet Routing
                </span>
                <span className="text-[10px] font-bold text-emerald-600">99.98% uptime</span>
              </div>
              <p className="text-[10px] text-slate-400">Node cluster active. Processing JSON and static payloads seamlessly.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span> Gemini API Core Channel
                </span>
                <span className="text-[10px] font-bold text-emerald-600">Active</span>
              </div>
              <p className="text-[10px] text-slate-400">Connected to gemini-3.5-flash with automated structured extraction schemas.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span> Escrow Ledgers
                </span>
                <span className="text-[10px] font-bold text-emerald-600">Audited OK</span>
              </div>
              <p className="text-[10px] text-slate-400">Smart-contracts tracking crop lots are double-hashed. Zero security alarms.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
