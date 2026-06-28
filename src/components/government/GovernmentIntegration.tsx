import React, { useState, useMemo } from "react";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Upload,
  Info,
  Sliders,
  DollarSign,
  TrendingUp,
  MapPin,
  ChevronRight,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
  Award,
  Bell,
  Search,
  Scale,
  ShieldCheck,
  Send,
  MessageSquare,
  Globe,
  RefreshCw,
  UserCheck
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

// Interfaces
interface Scheme {
  id: string;
  name: string;
  type: "Direct Income Support" | "Crop Insurance" | "Credit Support" | "Subsidy" | "Digital Trade";
  description: string;
  eligibilityCriteria: {
    maxLandSizeHectares: number;
    requiredDocuments: string[];
    otherConditions: string;
  };
  financialBenefit: string;
  deadline: string;
  status: "Open" | "Closing Soon" | "Suspended";
  penetrationPercentage: number; // For map / analytics
}

interface Application {
  id: string;
  schemeName: string;
  submittedDate: string;
  status: "Under Review" | "Verified" | "Approved" | "Disbursed" | "Action Required";
  progressPercent: number;
  comments: string;
  verifiedDocuments: { name: string; status: "Verified" | "Rejected" | "Pending" }[];
}

interface Complaint {
  id: string;
  subject: string;
  category: string;
  status: "Pending Investigation" | "In Progress" | "Resolved";
  filedDate: string;
  lastUpdated: string;
  replies: { author: string; message: string; timestamp: string }[];
}

export const GovernmentIntegration: React.FC = () => {
  // 1. Core State databases
  const [schemes] = useState<Scheme[]>([
    {
      id: "PM-KISAN",
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      type: "Direct Income Support",
      description: "Direct sovereign cash transfers to support marginal landholder families, disbursed in equal quad-monthly installments directly to bank accounts.",
      eligibilityCriteria: {
        maxLandSizeHectares: 2.0,
        requiredDocuments: ["Aadhaar Card", "Land Registration Records (Jamabandi)", "Bank Account Passbook"],
        otherConditions: "Must not hold constitutional posts or pay professional income taxes."
      },
      financialBenefit: "$120 / Year (₹6,000 paid in 3 equal installments)",
      deadline: "2026-08-31",
      status: "Open",
      penetrationPercentage: 94
    },
    {
      id: "PMFBY",
      name: "Pradhan Mantri Fasal Bima Yojana (PMFBY Crop Insurance)",
      type: "Crop Insurance",
      description: "Comprehensive multi-risk yield insurance protection shielding against natural calamities, pests, droughts, storms, and localized water inundation.",
      eligibilityCriteria: {
        maxLandSizeHectares: 10.0,
        requiredDocuments: ["Sowing Certificate", "Land Tenancy Agreement", "ID Proof", "Bank details"],
        otherConditions: "Must be sown within official seasonal limits for specified kharif/rabi crops."
      },
      financialBenefit: "Covers up to 100% of loss-adjusted sum assured; premium capped at 1.5% to 2%.",
      deadline: "2026-07-15",
      status: "Closing Soon",
      penetrationPercentage: 78
    },
    {
      id: "KCC",
      name: "Kisan Credit Card (KCC) Institutional Loan Scheme",
      type: "Credit Support",
      description: "Low-interest institutional credit lines to secure timely purchase of agricultural inputs, tractor services, post-harvest costs, and household items.",
      eligibilityCriteria: {
        maxLandSizeHectares: 15.0,
        requiredDocuments: ["Revenue Land Map", "No-Dues Certificate from Coop", "Aadhaar Card"],
        otherConditions: "Requires active cultivation and clean historical credit logs."
      },
      financialBenefit: "Credit up to $4,500 at deeply subsidized 4% net interest rate with prompt repayments.",
      deadline: "2026-09-30",
      status: "Open",
      penetrationPercentage: 83
    },
    {
      id: "SUBSIDY-SOLAR",
      name: "PM-KUSUM Off-Grid Solar Water Pump Subsidy",
      type: "Subsidy",
      description: "Massive bilateral subsidy to replace high-emission diesel engines with heavy-duty photovoltaic submersible water pumping units.",
      eligibilityCriteria: {
        maxLandSizeHectares: 5.0,
        requiredDocuments: ["Soil Water Availability Report", "Land Ownership Deed", "Bank IFSC details"],
        otherConditions: "Must have micro-irrigation system installed or planned."
      },
      financialBenefit: "Provides 60% direct state capital subsidy, with 30% bank credit support.",
      deadline: "2026-07-20",
      status: "Closing Soon",
      penetrationPercentage: 55
    },
    {
      id: "SHC",
      name: "Soil Health Card National Nutritional Scheme",
      type: "Subsidy",
      description: "Provides customized micro-nutrient advice and tailored fertilizer recommendation vouchers to correct macronutrient soil depletion.",
      eligibilityCriteria: {
        maxLandSizeHectares: 10.0,
        requiredDocuments: ["Soil Sample GPS coordinates", "Aadhaar Card"],
        otherConditions: "Valid only for regional block authorized lab samples."
      },
      financialBenefit: "Free soil nutritional profile testing & customized fertilizer discount vouchers up to $75.",
      deadline: "2026-11-15",
      status: "Open",
      penetrationPercentage: 91
    }
  ]);

  const [applications, setApplications] = useState<Application[]>([
    {
      id: "APP-509182",
      schemeName: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      submittedDate: "2026-06-10",
      status: "Approved",
      progressPercent: 100,
      comments: "Direct transfer payout verified. Aadhaar biometric matching successful.",
      verifiedDocuments: [
        { name: "Aadhaar Card", status: "Verified" },
        { name: "Jamabandi Land Deed", status: "Verified" }
      ]
    },
    {
      id: "APP-402910",
      schemeName: "PM-KUSUM Off-Grid Solar Water Pump Subsidy",
      submittedDate: "2026-06-25",
      status: "Action Required",
      progressPercent: 65,
      comments: "Uploaded Land Registration Deed is blurry. Please upload high-resolution scan to proceed.",
      verifiedDocuments: [
        { name: "Soil Water Availability Report", status: "Verified" },
        { name: "Land Ownership Deed", status: "Rejected" }
      ]
    }
  ]);

  // Active view tabs
  const [activeSubTab, setActiveSubTab] = useState<"eligibility" | "compare" | "documents" | "tracking" | "complaints" | "itr">("eligibility");

  // --- AUTO ELIGIBILITY SCORE CALCULATOR STATES ---
  const [calcLandSize, setCalcLandSize] = useState<number>(1.8);
  const [calcAnnualIncome, setCalcAnnualIncome] = useState<number>(3200);
  const [calcIrrigationType, setCalcIrrigationType] = useState<"Rainfed" | "Canal/Borewell" | "Micro-Drip Solar">("Canal/Borewell");
  const [calcTaxPayer, setCalcTaxPayer] = useState<boolean>(false);
  const [calcCropCategory, setCalcCropCategory] = useState<"Cereals" | "Horticulture" | "Fibre Crops">("Cereals");

  // Score Calculator logic
  const calculatedEligibility = useMemo(() => {
    return schemes.map((sch) => {
      let score = 95;
      const reasons: string[] = [];

      // Land size check
      if (calcLandSize > sch.eligibilityCriteria.maxLandSizeHectares) {
        const excess = (calcLandSize - sch.eligibilityCriteria.maxLandSizeHectares).toFixed(1);
        score -= 40;
        reasons.push(`Land size exceeds maximum limit by ${excess} hectares.`);
      } else {
        reasons.push("✓ Landholding size compliant with target guidelines.");
      }

      // Tax payer check
      if (calcTaxPayer) {
        score -= 50;
        reasons.push("Exclusion Criteria triggered: Professional Income Tax payers are excluded from PM-KISAN & direct subsidies.");
      }

      // Specific subsidy checks
      if (sch.id === "SUBSIDY-SOLAR") {
        if (calcIrrigationType === "Micro-Drip Solar") {
          score = 100;
          reasons.push("Priority status: Existing micro-irrigation systems receive 15% bonus scoring for solar energy conversion.");
        } else if (calcIrrigationType === "Rainfed") {
          score -= 20;
          reasons.push("Priority lowered: Rainfed soils must specify storage ponds to sustain solar pump flow rates.");
        }
      }

      if (sch.id === "PMFBY") {
        if (calcCropCategory === "Horticulture") {
          score = 98;
          reasons.push("Highly recommended: horticulture crops receive weather index safeguard options under commercial rules.");
        }
      }

      const finalScore = Math.max(0, score);
      return {
        id: sch.id,
        name: sch.name,
        score: finalScore,
        reasons,
        status: finalScore >= 70 ? "High Match" : finalScore >= 40 ? "Moderate Match" : "Ineligible"
      };
    });
  }, [calcLandSize, calcAnnualIncome, calcIrrigationType, calcTaxPayer, calcCropCategory, schemes]);

  // Selected scheme for Step-by-Step interactive assistance
  const [assistanceSchemeId, setAssistanceSchemeId] = useState<string>("PM-KISAN");
  const activeAssistanceScheme = useMemo(() => {
    return schemes.find((s) => s.id === assistanceSchemeId) || schemes[0];
  }, [assistanceSchemeId]);

  // --- DOCUMENT VERIFICATION SIMULATOR STATES ---
  const [selectedDocType, setSelectedDocType] = useState<string>("Aadhaar Card");
  const [verificationFile, setVerificationFile] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: "Verified" | "Rejected";
    confidence: number;
    extractedData: Record<string, string>;
    warnings: string[];
  } | null>(null);

  const handleDocumentScan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationFile(`${selectedDocType.toLowerCase().replace(/ /g, "_")}_scan_ocr.pdf`);

    setTimeout(() => {
      setIsVerifying(false);
      if (selectedDocType === "Aadhaar Card") {
        setVerificationResult({
          status: "Verified",
          confidence: 98.4,
          extractedData: {
            "Sovereign UID": "xxxx-xxxx-8012",
            "Name Matches Registration": "Amir Patel (100% string distance match)",
            "Biometric Status": "Linked & Active"
          },
          warnings: ["Ensure OTP fallback matches active mobile registration."]
        });
      } else if (selectedDocType === "Land Registration Records (Jamabandi)") {
        setVerificationResult({
          status: "Verified",
          confidence: 94.1,
          extractedData: {
            "Survey Block Number": "Amritsar Zone 4-B",
            "Allocated Hectares": "1.82 Hectares",
            "Sovereign Registry Hash": "JAM-2025-0019283"
          },
          warnings: ["Requires physical boundary audit confirmation prior to subsidy release."]
        });
      } else {
        setVerificationResult({
          status: "Rejected",
          confidence: 42.0,
          extractedData: {},
          warnings: ["Document blurry or scan resolution too low.", "Lacks official digital signature stamp."]
        });
      }
    }, 1500);
  };

  // Submit new application to list
  const handleApplyNow = (schemeId: string) => {
    const sch = schemes.find((s) => s.id === schemeId);
    if (!sch) return;

    const newApp: Application = {
      id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
      schemeName: sch.name,
      submittedDate: new Date().toISOString().split("T")[0],
      status: "Under Review",
      progressPercent: 25,
      comments: "Application registered successfully. Queue position: #12 Regional Block review office.",
      verifiedDocuments: sch.eligibilityCriteria.requiredDocuments.map((doc) => ({
        name: doc,
        status: "Pending"
      }))
    };

    setApplications((prev) => [newApp, ...prev]);
    setActiveSubTab("tracking");
    alert(`✓ Application submitted! Your tracking reference: ${newApp.id} has been added to the regional registry pipeline.`);
  };

  // --- TAX FILING ASSISTANCE (ITR) STATES & MATH ---
  const [taxAgriculturalRevenue, setTaxAgriculturalRevenue] = useState<number>(4800);
  const [taxNonAgriculturalRevenue, setTaxNonAgriculturalRevenue] = useState<number>(1200);
  const [taxInputDeductions, setTaxInputDeductions] = useState<number>(1850);

  const taxCalculations = useMemo(() => {
    // Under Section 10(1) of Indian Income Tax Act, purely agricultural income is fully exempt
    const netAgriculturalIncome = Math.max(0, taxAgriculturalRevenue - taxInputDeductions);
    const taxableIncome = taxNonAgriculturalRevenue; // Only non-agricultural income is taxed directly
    
    // Simple mock slab tax calculation
    let estimatedTax = 0;
    if (taxableIncome > 5000) {
      estimatedTax = (taxableIncome - 5000) * 0.1;
    }

    return {
      netAgriculturalIncome,
      taxableIncome,
      exemptionClaimed: netAgriculturalIncome,
      estimatedTax
    };
  }, [taxAgriculturalRevenue, taxNonAgriculturalRevenue, taxInputDeductions]);

  // --- COMPLAINTS AND GRIEVANCE PORTAL STATES ---
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "GRI-2041",
      subject: "Delayed PM-KISAN 12th Installment Release",
      category: "Direct Income Support Delay",
      status: "In Progress",
      filedDate: "2026-06-15",
      lastUpdated: "2026-06-25",
      replies: [
        { author: "Amir Patel", message: "Disbursement status shows complete but funds have not cleared my Bank of Punjab ledger.", timestamp: "2026-06-15 09:30" },
        { author: "Nodal Officer (Amritsar Hub)", message: "Aadhaar verification was pending. We have updated your biometric credentials. Please expect the credit clearance within 3 bank working days.", timestamp: "2026-06-25 14:20" }
      ]
    }
  ]);
  const [newGrievanceSubject, setNewGrievanceSubject] = useState("");
  const [newGrievanceCategory, setNewGrievanceCategory] = useState("Direct Income Support Delay");
  const [newGrievanceMsg, setNewGrievanceMsg] = useState("");

  const handleFileComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrievanceSubject.trim() || !newGrievanceMsg.trim()) return;

    const newGri: Complaint = {
      id: `GRI-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newGrievanceSubject,
      category: newGrievanceCategory,
      status: "Pending Investigation",
      filedDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      replies: [
        { author: "Amir Patel", message: newGrievanceMsg, timestamp: new Date().toLocaleTimeString() }
      ]
    };

    setComplaints((prev) => [newGri, ...prev]);
    setNewGrievanceSubject("");
    setNewGrievanceMsg("");
    alert(`✓ Grievance registered! Ticket number: ${newGri.id} dispatched to the District Block Commissioner office.`);
  };

  // --- SCHEME COMPARISON MATRIX GRAPHIC CHART DATA ---
  const schemeComparisonChartData = [
    { name: "Direct cash", "PM-KISAN": 100, "PMFBY Insurance": 15, "KCC Credit": 20, "Solar Pump": 10 },
    { name: "Input Coverage", "PM-KISAN": 20, "PMFBY Insurance": 90, "KCC Credit": 80, "Solar Pump": 100 },
    { name: "Risk Mitigation", "PM-KISAN": 10, "PMFBY Insurance": 100, "KCC Credit": 50, "Solar Pump": 40 },
    { name: "Debt Avoidance", "PM-KISAN": 100, "PMFBY Insurance": 70, "KCC Credit": 30, "Solar Pump": 80 }
  ];

  // Map representation data for Scheme Penetration (District Blocks)
  const blockPenetrationMap = [
    { name: "Amritsar Block A", penetration: 92, status: "Optimal" },
    { name: "Amritsar Block B", penetration: 84, status: "Optimal" },
    { name: "Gurdaspur Central", penetration: 72, status: "Under-served" },
    { name: "Ludhiana West", penetration: 95, status: "Optimal" },
    { name: "Batala Sector 2", penetration: 61, status: "Critical Support" }
  ];

  return (
    <div id="government-integration-hub" className="space-y-6">

      {/* Sovereign Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-900 flex items-center gap-1.5 w-fit">
            <Globe className="h-3.5 w-3.5" /> State Agri-Sovereign Integration Desk
          </span>
          <h2 className="text-white text-base font-black uppercase tracking-tight mt-2">Bilateral State Schemes & Compliance Portal</h2>
          <p className="text-slate-400 text-[10px] font-medium">Verify direct PM-KISAN landholder transfers, model agricultural exemptions, audit credentials, and file verified grievance briefs.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
            <span className="text-slate-500 text-[8px] uppercase font-bold block">My Applied Schemes</span>
            <span className="text-emerald-400 text-xs font-black">{applications.length} Submissions</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
            <span className="text-slate-500 text-[8px] uppercase font-bold block">Grievance Tickets</span>
            <span className="text-amber-400 text-xs font-black">{complaints.length} Filed</span>
          </div>
        </div>
      </div>

      {/* Main Sub-Navigation Grid */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1">
        {[
          { id: "eligibility", label: "AI Eligibility Match", icon: Sparkles },
          { id: "compare", label: "Scheme Comparison Matrix", icon: Scale },
          { id: "documents", label: "Document Verifier", icon: Upload },
          { id: "tracking", label: "Application Tracker", icon: FileText },
          { id: "itr", label: "ITR & Tax Assistance", icon: DollarSign },
          { id: "complaints", label: "District Grievance Desk", icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-5 cursor-pointer transition-all flex items-center gap-1.5 ${
                isSelected
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: STATIC SCHEME LIST (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Active Sovereign Portfolios</h3>
              <p className="text-[10px] text-slate-500">Official ministries, deadlines, and verified landholder program structures.</p>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {schemes.map((sch) => {
                const isAssisted = sch.id === assistanceSchemeId;
                return (
                  <div
                    key={sch.id}
                    onClick={() => setAssistanceSchemeId(sch.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative space-y-2.5 hover:shadow-md ${
                      isAssisted
                        ? "border-emerald-600 bg-emerald-50/15 ring-2 ring-emerald-600/15"
                        : "border-slate-150 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">{sch.type}</span>
                        <h4 className="text-xs font-bold text-slate-900 pr-12 leading-snug">{sch.name}</h4>
                      </div>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                        sch.status === "Open"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : sch.status === "Closing Soon"
                          ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {sch.status}
                      </span>
                    </div>

                    <p className="text-[9.5px] text-slate-600 line-clamp-2 leading-relaxed">{sch.description}</p>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[9px] font-semibold text-slate-500">
                      <span>Deadline: {sch.deadline}</span>
                      <span className="text-slate-900 font-extrabold">{sch.penetrationPercentage}% Area Penetration</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE NOTIFICATIONS & DEADLINES BOX */}
          <div className="bg-emerald-950 text-emerald-200 rounded-2xl p-5 border border-emerald-900 space-y-3">
            <div className="flex items-center gap-1.5 border-b border-emerald-800/80 pb-2">
              <Bell className="h-4.5 w-4.5 text-emerald-400 animate-bounce" />
              <span className="text-[9px] font-black uppercase tracking-wider">Urgent Scheme Deadlines</span>
            </div>
            <div className="space-y-2 text-[10px] leading-relaxed">
              <p>
                🚨 <strong className="text-white">PMFBY Insurance Deadline:</strong> 15 July 2026. Submit Sowing Certificate to ensure Kharif protection.
              </p>
              <p>
                💧 <strong className="text-white">PM-KUSUM Subsidy:</strong> 20 July 2026. 60% solar water pump reimbursement portal closing.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL WORKSPACE ACCORDING TO TABS (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">

          {/* TAB 1: AI ELIGIBILITY CALCULATOR */}
          {activeSubTab === "eligibility" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Parameter form (col 5) */}
              <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <Sliders className="h-4 w-4 text-emerald-600" /> Landholding Profile
                  </h3>
                  <p className="text-[10px] text-slate-400">Specify your agronomic stats to compute localized state eligibility matching scores.</p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Land Size (Hectares)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calcLandSize}
                      onChange={(e) => setCalcLandSize(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Annual Revenue ($)</label>
                    <input
                      type="number"
                      value={calcAnnualIncome}
                      onChange={(e) => setCalcAnnualIncome(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Irrigation Setup</label>
                    <select
                      value={calcIrrigationType}
                      onChange={(e) => setCalcIrrigationType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
                    >
                      <option value="Rainfed">Rainfed (Dry Soil)</option>
                      <option value="Canal/Borewell">Canal or Borewell (Tubes)</option>
                      <option value="Micro-Drip Solar">Micro-Drip Sprinklers (Solar power)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Main Crop Category</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["Cereals", "Horticulture", "Fibre Crops"] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCalcCropCategory(cat)}
                          className={`py-1.5 rounded-lg text-[9px] font-bold border text-center transition-all cursor-pointer ${
                            calcCropCategory === cat
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 cursor-pointer text-[10px] font-bold text-slate-600">
                      <input
                        type="checkbox"
                        checked={calcTaxPayer}
                        onChange={(e) => setCalcTaxPayer(e.target.checked)}
                        className="accent-emerald-600 h-4 w-4 cursor-pointer"
                      />
                      Professional Income Tax Payer
                    </label>
                  </div>
                </div>
              </div>

              {/* Match outputs (col 7) */}
              <div className="md:col-span-7 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
                      AI eligibility Score Engine
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {calculatedEligibility.map((match) => (
                      <div key={match.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-slate-800">{match.name.split(" (")[0]}</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                            match.status === "High Match"
                              ? "bg-emerald-50 text-emerald-700"
                              : match.status === "Moderate Match"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}>
                            {match.status} ({match.score}%)
                          </span>
                        </div>

                        {/* Visual progress bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              match.status === "High Match" ? "bg-emerald-600" : match.status === "Moderate Match" ? "bg-amber-500" : "bg-red-600"
                            }`}
                            style={{ width: `${match.score}%` }}
                          />
                        </div>

                        {/* Audit Reasons */}
                        <ul className="text-[8.5px] space-y-1 font-medium text-slate-500">
                          {match.reasons.map((r, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="shrink-0">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Step-by-Step action assist CTA */}
                        {match.score >= 50 && (
                          <div className="pt-1 flex justify-between items-center text-[9px]">
                            <span className="text-slate-400">Step-by-step assistance available</span>
                            <button
                              type="button"
                              onClick={() => handleApplyNow(match.id)}
                              className="text-emerald-700 font-extrabold hover:text-emerald-900 flex items-center gap-0.5 cursor-pointer"
                            >
                              File Application <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SCHEME COMPARISON MATRIX */}
          {activeSubTab === "compare" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Comparative Scheme Utility Matrix</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Understand where direct cash transfers exceed credit, and inspect target regional scheme block-penetration density.</p>
              </div>

              {/* Chart of scheme benefits */}
              <div className="h-56 bg-slate-50 border border-slate-150 p-3 rounded-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={schemeComparisonChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                    <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                    <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                    <Legend wrapperStyle={{ fontSize: "9px", fontWeight: "bold" }} />
                    <Bar name="PM-KISAN Cash" dataKey="PM-KISAN" fill="#059669" radius={[4, 4, 0, 0]} />
                    <Bar name="PMFBY Insurance" dataKey="PMFBY Insurance" fill="#eab308" radius={[4, 4, 0, 0]} />
                    <Bar name="KCC Institutional" dataKey="KCC Credit" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar name="Solar Pump Subsidy" dataKey="Solar Pump" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed specs table & Block Penetration Map (SVG grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Comparison Table specs */}
                <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="text-[10px] uppercase font-black text-slate-700 tracking-wider">Comparison Metrics Summary</h4>
                  <div className="space-y-2.5 text-[9.5px] text-slate-600 font-semibold leading-relaxed">
                    <p>
                      💵 <strong className="text-slate-900">Direct Income Transfers (PM-KISAN)</strong> provide immediate, unconditional liquidity buffers without imposing collateral burdens or long repayment cycles.
                    </p>
                    <p>
                      🌾 <strong className="text-slate-900">Multi-Risk Crop Insurance (PMFBY)</strong> provides necessary downside risk control against climate calamities, though claims require localized crop-cutting checks.
                    </p>
                    <p>
                      🚜 <strong className="text-slate-900">Capital Pump Subsidies (PM-KUSUM)</strong> yield the highest long-term operational cost-savings but demand larger upfront matching capital.
                    </p>
                  </div>
                </div>

                {/* Block-Level Penetration map */}
                <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] uppercase font-black text-slate-700 tracking-wider">Regional Scheme Density Map</h4>
                    <span className="text-[8px] font-mono text-slate-400">AMRITSAR BLOCK GRID</span>
                  </div>

                  {/* Micro list mapping penetration metrics */}
                  <div className="space-y-2">
                    {blockPenetrationMap.map((b, idx) => (
                      <div key={idx} className="bg-white border border-slate-150 p-2 rounded flex justify-between items-center text-[9px] font-semibold">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-slate-800">{b.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600">{b.penetration}% density</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.2 rounded uppercase ${
                            b.status === "Optimal" ? "bg-emerald-50 text-emerald-700" : b.status === "Under-served" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                          }`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENT UPLOAD & AI OCR VERIFIER */}
          {activeSubTab === "documents" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* OCR File submit form (col 5) */}
              <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <Upload className="h-4.5 w-4.5 text-emerald-600" /> State Document Portal
                  </h3>
                  <p className="text-[10px] text-slate-400">Pre-verify your agricultural land records & biometric proofs using AI OCR tools.</p>
                </div>

                <form onSubmit={handleDocumentScan} className="space-y-4">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Target Document Type</label>
                    <select
                      value={selectedDocType}
                      onChange={(e) => setSelectedDocType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Aadhaar Card">Aadhaar Card (Biometric ID)</option>
                      <option value="Land Registration Records (Jamabandi)">Land Registration Records (Jamabandi)</option>
                      <option value="Agricultural Income Declaration">Agricultural Income Declaration</option>
                    </select>
                  </div>

                  {/* Mock file uploader drop zone */}
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                    <Upload className="h-6 w-6 text-slate-400 mx-auto mb-1.5" />
                    <span className="block text-[10px] text-slate-600 font-extrabold">Simulate File Selection</span>
                    <span className="block text-[8px] text-slate-400 mt-0.5">Drag & Drop or Tap to attach PDF (Max 8MB)</span>
                  </div>

                  {isVerifying && (
                    <div className="flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-[9px] font-bold">
                      <div className="h-3.5 w-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      Parsing Sovereign Registry OCR Seals...
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-[10px] uppercase rounded-lg cursor-pointer"
                  >
                    Run Automated Verification Scan
                  </button>
                </form>
              </div>

              {/* OCR Scan Results display (col 7) */}
              <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">AI OCR Verification Verdict</h3>
                
                {verificationResult ? (
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 text-[10px] font-semibold">
                      <div className="flex justify-between items-center border-b border-slate-200/50 pb-2 mb-1.5">
                        <span className="text-slate-500">Document Type:</span>
                        <span className="text-slate-900 font-bold">{selectedDocType}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">Verification Result:</span>
                        <span className={`font-black ${verificationResult.status === "Verified" ? "text-emerald-700" : "text-red-600"}`}>
                          {verificationResult.status} ({verificationResult.confidence}% confidence)
                        </span>
                      </div>

                      {/* Extracted fields */}
                      {Object.keys(verificationResult.extractedData).length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
                          <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">Extracted Registry Fields</span>
                          {Object.entries(verificationResult.extractedData).map(([key, val]) => (
                            <div key={key} className="flex justify-between text-[9px]">
                              <span className="text-slate-500">{key}:</span>
                              <span className="text-slate-800 font-extrabold">{val}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Warnings readout */}
                    <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3.5 space-y-1.5 text-[9px] text-amber-800 font-bold leading-relaxed">
                      <span className="uppercase text-[8px] font-black text-amber-900 flex items-center gap-1">
                        <Info className="h-3.5 w-3.5" />
                        Awaiting Landholder Advisory Note
                      </span>
                      {verificationResult.warnings.map((w, i) => (
                        <p key={i}>• {w}</p>
                      ))}
                    </div>

                    {verificationResult.status === "Verified" && (
                      <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-[9px] text-emerald-800 flex items-center gap-2 font-bold">
                        <Award className="h-4 w-4 text-emerald-600" />
                        Digital Verification certificate generated. Ready for immediate program linkage.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-[10px] font-medium italic space-y-1.5">
                    <FileSpreadsheet className="h-8 w-8 mx-auto text-slate-300" />
                    <p>No document scan active. Trigger verification scan on the left.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: APPLICATION TRACKING & ACTIONS */}
          {activeSubTab === "tracking" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">State Application Pipeline</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Real-time status tracking, document clearances, and state grievance escalations.</p>
              </div>

              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-mono text-slate-400 block">ID: {app.id} • Submitted: {app.submittedDate}</span>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{app.schemeName}</h4>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                        app.status === "Approved" || app.status === "Disbursed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : app.status === "Action Required"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-blue-50 text-blue-700 border border-blue-100"
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    {/* Progress slider bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] text-slate-500 font-bold">
                        <span>Registration</span>
                        <span>Verification</span>
                        <span>Approval</span>
                        <span>Disbursement</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${app.status === "Action Required" ? "bg-red-500" : "bg-emerald-600"}`}
                          style={{ width: `${app.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-[10px] font-semibold text-slate-700 leading-relaxed bg-white border border-slate-150 p-2 rounded-lg italic">
                      "Status update: {app.comments}"
                    </p>

                    {/* Attached docs check */}
                    <div className="flex flex-wrap gap-2 text-[9px]">
                      {app.verifiedDocuments.map((doc, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded-md font-bold border ${
                            doc.status === "Verified"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : doc.status === "Rejected"
                              ? "bg-red-50 text-red-700 border-red-150"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {doc.name}: {doc.status}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TAX FILING ASSISTANCE (ITR) */}
          {activeSubTab === "itr" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Form Input parameters */}
              <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="h-4.5 w-4.5 text-emerald-600" />
                    ITR Exemption Profiler
                  </h3>
                  <p className="text-[10px] text-slate-400">Log agricultural crop sales to claim proper tax exemptions under regional farming credit rules.</p>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Agricultural Gross Revenue ($)</label>
                    <input
                      type="number"
                      value={taxAgriculturalRevenue}
                      onChange={(e) => setTaxAgriculturalRevenue(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-extrabold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Non-Agri Business Revenue ($)</label>
                    <input
                      type="number"
                      value={taxNonAgriculturalRevenue}
                      onChange={(e) => setTaxNonAgriculturalRevenue(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-extrabold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Certified Crop Input Deductions ($)</label>
                    <input
                      type="number"
                      value={taxInputDeductions}
                      onChange={(e) => setTaxInputDeductions(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-extrabold"
                    />
                    <span className="text-[8px] text-slate-400 mt-1 block">Includes seed receipts, fertilizer vouchers, tractor rental cost.</span>
                  </div>
                </div>
              </div>

              {/* Tax estimation summary */}
              <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" /> State Tax Advisory Verdict
                </h3>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-[10px] font-semibold">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Net Agricultural Profit:</span>
                    <span className="text-slate-800 font-extrabold">${taxCalculations.netAgriculturalIncome}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-slate-500">Exemption Claimable (Sect 10/1):</span>
                    <span className="text-emerald-700 font-black">-${taxCalculations.exemptionClaimed} Exempted</span>
                  </div>

                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Net Taxable Revenue:</span>
                    <span className="text-slate-800 font-extrabold">${taxCalculations.taxableIncome}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/50 pt-2 text-xs font-extrabold text-slate-900">
                    <span>Estimated Compliance Tax:</span>
                    <span className="text-emerald-600">${taxCalculations.estimatedTax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-[9px] text-emerald-800 font-bold leading-relaxed space-y-1">
                  <p>✓ Pure agricultural revenues remain fully tax-exempt.</p>
                  <p>✓ Integrated ledger automatically generates structured PDF logs ready to dispatch to tax auditors.</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: COMPLAINTS & GRIEVANCE REGISTRY */}
          {activeSubTab === "complaints" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* File Complaint Form (col 5) */}
              <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">File State Grievance</h3>
                  <p className="text-[10px] text-slate-400">Directly dispatch a grievance docket regarding delayed subsidy payouts or land deed disputes.</p>
                </div>

                <form onSubmit={handleFileComplaint} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Grievance Category</label>
                    <select
                      value={newGrievanceCategory}
                      onChange={(e) => setNewGrievanceCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                    >
                      <option value="Direct Income Support Delay">Direct Income Support Delay</option>
                      <option value="Crop Insurance Claim Dispute">Crop Insurance Claim Dispute</option>
                      <option value="Solar Subsidy Delayed Audit">Solar Subsidy Delayed Audit</option>
                      <option value="Soil Health Certificate Misprint">Soil Health Certificate Misprint</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Subject Brief</label>
                    <input
                      type="text"
                      value={newGrievanceSubject}
                      onChange={(e) => setNewGrievanceSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none font-bold"
                      placeholder="e.g. Missing bank clearance for installment"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Grievance Detailed Statement</label>
                    <textarea
                      value={newGrievanceMsg}
                      onChange={(e) => setNewGrievanceMsg(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none text-[10px]"
                      rows={3}
                      placeholder="Explain physical steps taken, dates, and bank branch names..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-[10px] uppercase rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Dispatch Grievance Ticket
                  </button>
                </form>
              </div>

              {/* Log/Grievance list (col 7) */}
              <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">District Nodal Officer Communications</h3>
                
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {complaints.map((c) => (
                    <div key={c.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-[10px] font-semibold">
                      <div className="flex justify-between items-start border-b border-slate-200/50 pb-2">
                        <div>
                          <span className="text-[8px] font-mono text-slate-400 block">{c.id} • Category: {c.category}</span>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug mt-0.5">{c.subject}</h4>
                        </div>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                          c.status === "Resolved"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700 animate-pulse"
                        }`}>
                          {c.status}
                        </span>
                      </div>

                      {/* Chat Thread history */}
                      <div className="space-y-2.5">
                        {c.replies.map((r, i) => (
                          <div key={i} className="space-y-1 bg-white border border-slate-150 p-2.5 rounded-lg">
                            <div className="flex justify-between items-center text-[8.5px]">
                              <span className="font-black text-slate-700">{r.author}</span>
                              <span className="text-slate-400">{r.timestamp}</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed italic">"{r.message}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
