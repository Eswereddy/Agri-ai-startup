import React, { useState } from "react";
import {
  BrainCircuit,
  ClipboardList,
  CheckCircle,
  FileText,
  UserCheck,
  AlertTriangle,
  Award,
  Sparkles,
  BookOpen
} from "lucide-react";
import { CropDiagnostic } from "../../types";

interface ExpertViewProps {
  diagnostics: CropDiagnostic[];
  onUpdateDiagnostic: (id: string, updated: Partial<CropDiagnostic>) => void;
}

export default function ExpertView({ diagnostics, onUpdateDiagnostic }: ExpertViewProps) {
  const [selectedDiag, setSelectedDiag] = useState<CropDiagnostic | null>(null);
  const [expertNotes, setExpertNotes] = useState("");

  const handleVerify = (id: string) => {
    if (!expertNotes.trim()) {
      alert("Please enter pathological verification notes.");
      return;
    }
    onUpdateDiagnostic(id, {
      status: "Expert Verified",
      expertName: "Dr. Rachel Carter (Senior Plant Pathologist)",
      expertNotes
    });
    setSelectedDiag(null);
    setExpertNotes("");
  };

  return (
    <div id="expert-workspace" className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-700/50 rounded-xl">
              <Award className="h-6 w-6 text-emerald-200" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Agricultural Pathology Clinic</h2>
          </div>
          <p className="text-emerald-100/90 text-xs max-w-xl">
            Review Gemini AI crop pathology scans, verify pathogen classifications, and append custom biological treatments for smallholders requiring specialized oversight.
          </p>
        </div>
        <div className="flex gap-4 font-semibold text-center text-sm">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-semibold">Pending Audits</p>
            <p className="text-lg font-bold">{diagnostics.filter((d) => d.status === "AI Diagnosed").length} Scans</p>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-semibold">Total Signed Off</p>
            <p className="text-lg font-bold">{diagnostics.filter((d) => d.status === "Expert Verified").length} Solved</p>
          </div>
        </div>
      </div>

      {/* Grid: Diagnosis Queue & Pathology Work Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Queue (Left) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <ClipboardList className="h-4.5 w-4.5 text-emerald-600" />
              Pathology Audit Queue
            </h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
              AI Hand-off
            </span>
          </div>

          <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
            {diagnostics.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No pathology tickets active.</p>
            ) : (
              diagnostics.map((diag) => (
                <div
                  key={diag.id}
                  onClick={() => {
                    setSelectedDiag(diag);
                    setExpertNotes(diag.expertNotes || "");
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    selectedDiag?.id === diag.id
                      ? "bg-indigo-50/80 border-indigo-200 shadow-xs"
                      : "bg-slate-50 border-slate-150 hover:bg-slate-100/40"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{diag.cropName} pathology</h4>
                    <p className="text-[10px] text-slate-500 mt-1 truncate max-w-[200px]">{diag.symptoms}</p>
                    <p className="text-[10px] font-bold text-indigo-700 mt-1">AI Match: {diag.aiDiagnosis || "Pending"}</p>
                  </div>

                  <div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                      diag.status === "Expert Verified" ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"
                    }`}>
                      {diag.status === "Expert Verified" ? "Signed Off" : "Verify"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pathology Desk Worksite (Right) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm min-h-[340px] flex flex-col justify-between">
          {selectedDiag ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">{selectedDiag.cropName} Pathology Report</h3>
                  <p className="text-[10px] text-slate-400">ID: {selectedDiag.id} • Registered: {selectedDiag.date}</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
                  Match Confidence: {selectedDiag.confidence || 88}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-150">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase">Farmer Symptoms Description</h4>
                  <p className="text-slate-700 font-medium mt-1 leading-normal">{selectedDiag.symptoms}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase">Gemini Pathologist Diagnosis</h4>
                  <p className="text-indigo-800 font-bold mt-1 leading-normal">{selectedDiag.aiDiagnosis}</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Recommended treats: {selectedDiag.treatment}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Scientific Pathological Review & Corrective Notes
                </label>
                <textarea
                  rows={4}
                  value={expertNotes}
                  onChange={(e) => setExpertNotes(e.target.value)}
                  disabled={selectedDiag.status === "Expert Verified"}
                  placeholder="Analyze tissue samples metrics, write bio-pesticide dosage rules, and sign off this ticket..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed font-medium"
                />
              </div>

              {selectedDiag.status !== "Expert Verified" ? (
                <button
                  id="expert-verify-btn"
                  onClick={() => handleVerify(selectedDiag.id)}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="h-4.5 w-4.5 text-emerald-300" />
                  Sign Off Pathology Diagnosis
                </button>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-2.5 text-emerald-800 text-xs">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-bold">Verified & Dispatched to Farmer</p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">Dr Rachel Carter approved this pathology on {selectedDiag.date}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <BrainCircuit className="h-10 w-10 text-slate-300 animate-pulse mb-2.5" />
              <h4 className="text-xs font-bold text-slate-700">Awaiting Pathology Ticket Selection</h4>
              <p className="text-[10px] text-slate-400 mt-1 max-w-sm">
                Select an automated pathology diagnostic ticket from the left audit queue to calibrate treatments, verify agricultural pathogens, and release signed-off advice back to smallholders.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
