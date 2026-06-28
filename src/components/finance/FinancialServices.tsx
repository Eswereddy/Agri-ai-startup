import React, { useState, useMemo } from "react";
import {
  Coins,
  Shield,
  Calculator,
  Compass,
  FileCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Upload,
  Layers,
  HelpCircle,
  Building2,
  DollarSign,
  Briefcase,
  Sliders,
  ChevronRight,
  Sparkles,
  Info,
  UserCheck,
  FileText,
  BadgeAlert,
  Download,
  Percent
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Interfaces
interface LoanProduct {
  id: string;
  name: string;
  type: "KCC (Kisan Credit Card)" | "Agricultural Term Loan" | "Farm Machinery Loan";
  interestRate: number; // %
  maxTenureMonths: number;
  minAmount: number;
  maxAmount: number;
  prepaymentPenaltyRate: number; // %
  description: string;
}

interface InsuranceProduct {
  id: string;
  name: string;
  category: "Crop (Weather-based)" | "Crop (Yield-based)" | "Equipment" | "Livestock" | "Farmer Life";
  basePremiumRate: number; // % of sum insured
  sumInsured: number; // ₹
  description: string;
}

interface ActiveClaim {
  id: string;
  policyId: string;
  category: string;
  sumInsured: number;
  estimatedSettlement: number;
  status: "Reviewing Documents" | "Field Inspection Scheduled" | "Settlement Approved" | "Disbursed";
  filedDate: string;
}

export const FinancialServices: React.FC = () => {
  // Global View Mode
  const [activeTab, setActiveTab] = useState<"loans" | "insurance">("loans");

  // Pre-seeded Loan Products
  const loanProducts: LoanProduct[] = [
    {
      id: "KCC-01",
      name: "Sovereign Kisan Credit Card (KCC)",
      type: "KCC (Kisan Credit Card)",
      interestRate: 7.0, // Base interest rate
      maxTenureMonths: 12,
      minAmount: 10000,
      maxAmount: 300000,
      prepaymentPenaltyRate: 0.0, // 0 penalty under government subsidy
      description: "Highly subsidized short-term crop loans with interest subvention schemes. Best for seasonal cultivation costs."
    },
    {
      id: "TERM-02",
      name: "Agronomic High-Yield Term Loan",
      type: "Agricultural Term Loan",
      interestRate: 9.5,
      maxTenureMonths: 60,
      minAmount: 100000,
      maxAmount: 1500000,
      prepaymentPenaltyRate: 1.5,
      description: "Medium to long-term funding for minor irrigation, land development, solar pumps, and orchard setup."
    },
    {
      id: "EQUIP-03",
      name: "Harvester & Tractor Equipment Loan",
      type: "Farm Machinery Loan",
      interestRate: 8.8,
      maxTenureMonths: 48,
      minAmount: 50000,
      maxAmount: 1000000,
      prepaymentPenaltyRate: 2.0,
      description: "Asset-backed machinery financing with flexible hypothecation terms. Low processing overheads."
    }
  ];

  // Pre-seeded Insurance Products
  const insuranceProducts: InsuranceProduct[] = [
    {
      id: "INS-CROP-01",
      name: "Sovereign PMFBY Weather-Index Crop Cover",
      category: "Crop (Weather-based)",
      basePremiumRate: 2.0, // Government subsidized
      sumInsured: 150000,
      description: "Subsidized yield protection against dry spell deficits, unseasonal rainfall, and high temperature index spikes."
    },
    {
      id: "INS-LIVE-02",
      name: "Livestock Bovine & Poultry Protection",
      category: "Livestock",
      basePremiumRate: 3.5,
      sumInsured: 80000,
      description: "Covers cattle mortality due to Foot and Mouth disease, lightning strikes, or regional water contamination."
    },
    {
      id: "INS-EQUIP-03",
      name: "Tractor & Multi-Crop Thresher Insurance",
      category: "Equipment",
      basePremiumRate: 1.8,
      sumInsured: 650000,
      description: "Direct asset insurance cover protecting against fire, mechanical theft, road transit accidents, and flooding."
    },
    {
      id: "INS-LIFE-04",
      name: "Farmer Jeevan Suraksha Term Life Policy",
      category: "Farmer Life",
      basePremiumRate: 0.9,
      sumInsured: 500000,
      description: "Direct term life insurance providing direct support and collateral relief to farming households."
    }
  ];

  // State values for Loan Eligibility & Valuation Checker
  const [landAreaAcres, setLandAreaAcres] = useState<number>(4.5);
  const [irrigationSource, setIrrigationSource] = useState<"Tubewell" | "Canal Feed" | "Rainfed">("Tubewell");
  const [existingDebt, setExistingDebt] = useState<number>(30000);
  const [selectedCollateralType, setSelectedCollateralType] = useState<"Land Title" | "Harvester Machinery">("Land Title");

  // AI scoring model evaluation
  const aiEligibilityScore = useMemo(() => {
    let baseScore = 65;

    // Land multiplier
    baseScore += Math.min(25, landAreaAcres * 5.5);

    // Irrigation source
    if (irrigationSource === "Tubewell") baseScore += 10;
    if (irrigationSource === "Canal Feed") baseScore += 5;

    // Debt reduction
    if (existingDebt > 100000) baseScore -= 20;
    else if (existingDebt > 30000) baseScore -= 8;
    else baseScore += 5;

    const finalScore = Math.min(100, Math.max(10, Math.round(baseScore)));

    let status: "Excellent" | "Good" | "Marginal" | "High Risk" = "Excellent";
    let loanApprovalProbability = "98%";
    if (finalScore >= 85) { status = "Excellent"; loanApprovalProbability = "98%"; }
    else if (finalScore >= 70) { status = "Good"; loanApprovalProbability = "85%"; }
    else if (finalScore >= 50) { status = "Marginal"; loanApprovalProbability = "50%"; }
    else { status = "High Risk"; loanApprovalProbability = "12%"; }

    // Collateral Valuation calculation (Land value ₹2,50,000 per acre, Harvester base ₹6,00,000)
    let collateralValuationValue = 0;
    if (selectedCollateralType === "Land Title") {
      collateralValuationValue = landAreaAcres * 250000;
    } else {
      collateralValuationValue = 600000;
    }

    return {
      score: finalScore,
      status,
      loanApprovalProbability,
      collateralValuationValue: Math.round(collateralValuationValue),
      maxEligibleLimit: Math.round(collateralValuationValue * 0.7) // 70% LTV ratio
    };
  }, [landAreaAcres, irrigationSource, existingDebt, selectedCollateralType]);

  // --- LOAN EMI CALCULATOR ---
  const [selectedLoanId, setSelectedLoanId] = useState<string>("KCC-01");
  const selectedLoanProduct = useMemo(() => {
    return loanProducts.find((p) => p.id === selectedLoanId) || loanProducts[0];
  }, [selectedLoanId]);

  const [requestedLoanAmount, setRequestedLoanAmount] = useState<number>(150000);
  const [requestedTenureMonths, setRequestedTenureMonths] = useState<number>(12);

  // Prepayment Calculator states
  const [prepayAmount, setPrepayAmount] = useState<number>(30000);

  const emiCalculations = useMemo(() => {
    // Interest is calculated as monthly
    const r = (selectedLoanProduct.interestRate / 12) / 100;
    const n = requestedTenureMonths;
    const P = requestedLoanAmount;

    // EMI standard mathematical formula
    let emi = 0;
    if (r > 0) {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      emi = P / n;
    }

    const totalRepayment = emi * n;
    const totalInterestPayable = totalRepayment - P;

    // Calculate prepayment penalty
    const penaltyAmount = prepayAmount * (selectedLoanProduct.prepaymentPenaltyRate / 100);

    // Repayment schedule data for charting
    const scheduleData = [];
    let remainingPrincipal = P;
    const monthlyRate = (selectedLoanProduct.interestRate / 12) / 100;

    for (let month = 1; month <= n; month++) {
      const interestComponent = remainingPrincipal * monthlyRate;
      const principalComponent = emi - interestComponent;
      remainingPrincipal = Math.max(0, remainingPrincipal - principalComponent);

      scheduleData.push({
        name: `M${month}`,
        Principal: Math.round(principalComponent),
        Interest: Math.round(interestComponent),
        Outstanding: Math.round(remainingPrincipal)
      });
    }

    return {
      monthlyEmi: Math.round(emi),
      totalRepayment: Math.round(totalRepayment),
      totalInterestPayable: Math.round(totalInterestPayable),
      penaltyAmount: Math.round(penaltyAmount),
      scheduleData
    };
  }, [selectedLoanProduct, requestedLoanAmount, requestedTenureMonths, prepayAmount]);

  // --- DOCUMENT UPLOAD SIMULATION ---
  const [uploadedDocuments, setUploadedDocuments] = useState<{ name: string; size: string; status: "Verified" | "Uploading" }[]>([
    { name: "Land-Title-Records-Gurdaspur.pdf", size: "2.4 MB", status: "Verified" },
    { name: "Aadhaar-KYC-Identity.pdf", size: "1.2 MB", status: "Verified" }
  ]);
  const [documentMessage, setDocumentMessage] = useState<string | null>(null);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: "Uploading" as const
      };
      setUploadedDocuments((prev) => [...prev, newDoc]);
      setDocumentMessage("📄 Document uploaded. Scanning using sovereign verification OCR algorithms...");

      setTimeout(() => {
        setUploadedDocuments((prev) =>
          prev.map((doc) => (doc.name === file.name ? { ...doc, status: "Verified" } : doc))
        );
        setDocumentMessage("✅ Verification Completed! Land registry validation complete.");
      }, 3000);
    }
  };

  // --- INSURANCE CALCULATORS & BUNDLE OPTIONS ---
  const [selectedInsurances, setSelectedInsurances] = useState<string[]>(["INS-CROP-01"]);
  const [claimPolicyId, setClaimPolicyId] = useState<string>("INS-CROP-01");
  const [claimLossDescription, setClaimLossDescription] = useState<string>("Excess monsoonal washouts destroyed early-stage paddy seeds.");
  const [activeClaims, setActiveClaims] = useState<ActiveClaim[]>([
    {
      id: "CLM-9201",
      policyId: "INS-CROP-01",
      category: "PMFBY Crop Protection",
      sumInsured: 150000,
      estimatedSettlement: 112000,
      status: "Field Inspection Scheduled",
      filedDate: "2026-06-20"
    }
  ]);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState<string | null>(null);

  // Insurance bundle calculations
  const insurancePremiumSummary = useMemo(() => {
    let grossPremium = 0;
    let totalSumInsured = 0;

    selectedInsurances.forEach((id) => {
      const prod = insuranceProducts.find((p) => p.id === id);
      if (prod) {
        // PMFBY Crop has flat subsidized premium rate
        grossPremium += prod.sumInsured * (prod.basePremiumRate / 100);
        totalSumInsured += prod.sumInsured;
      }
    });

    // Bundle Discount calculation (More than 1 policy selected yields 10% premium waiver discount)
    const discountRate = selectedInsurances.length > 1 ? 10 : 0;
    const discountAmount = grossPremium * (discountRate / 100);
    const finalPremium = grossPremium - discountAmount;

    return {
      grossPremium: Math.round(grossPremium),
      discountAmount: Math.round(discountAmount),
      finalPremium: Math.round(finalPremium),
      totalSumInsured: Math.round(totalSumInsured),
      discountRate
    };
  }, [selectedInsurances, insuranceProducts]);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProd = insuranceProducts.find((p) => p.id === claimPolicyId) || insuranceProducts[0];
    
    // Estimate settlement amount (Subsidized models cover ~75% to 90% of sum insured based on damage criteria)
    const settlementEstimate = Math.round(targetProd.sumInsured * 0.82);

    const newClaim: ActiveClaim = {
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      policyId: targetProd.id,
      category: targetProd.name,
      sumInsured: targetProd.sumInsured,
      estimatedSettlement: settlementEstimate,
      status: "Reviewing Documents",
      filedDate: new Date().toISOString().split("T")[0]
    };

    setActiveClaims((prev) => [newClaim, ...prev]);
    setClaimSuccessMsg(`🎉 Claim successfully filed. Reference: ${newClaim.id}. A local agricultural investigator will visit your fields within 48 hours.`);

    setTimeout(() => {
      setClaimSuccessMsg(null);
    }, 6000);
  };

  const toggleInsuranceSelection = (id: string) => {
    setSelectedInsurances((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div id="financial-services-dashboard" className="space-y-6">

      {/* Main Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-900 flex items-center gap-1.5 w-fit">
            <Coins className="h-4 w-4 animate-pulse" /> Unified Sovereign Agricultural Finance
          </span>
          <h2 className="text-white text-base font-black uppercase tracking-tight mt-2">Farmers Financial Command Center</h2>
          <p className="text-slate-400 text-[10px] font-medium">Bilateral Kisan Credit Card limits, AI credit scoring metrics, automated premium discount bundlers, and direct claims filing networks.</p>
        </div>

        {/* Global Tab Switcher */}
        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("loans")}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "loans"
                ? "bg-emerald-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🌾 Subsidized Loans
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("insurance")}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "insurance"
                ? "bg-emerald-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🛡 Crop Insurance & Claims
          </button>
        </div>
      </div>

      {/* VIEW SECTION 1: SUBSIDIZED LOANS & CALCULATORS */}
      {activeTab === "loans" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: LOAN CALCULATORS, EMI SCHEDULE & PREPAYMENT PENALTY (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. Agricultural Loan Product Comparison */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Subsidized Agricultural Loan Products</h3>
                <p className="text-[10px] text-slate-400">Government backed schemes with pre-subvented interest multipliers for local farmers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loanProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedLoanId(p.id);
                      setRequestedLoanAmount(p.minAmount);
                    }}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedLoanId === p.id
                        ? "bg-emerald-50/70 border-emerald-600"
                        : "bg-white border-slate-200 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <span className="text-[8.5px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {p.type.split(" ")[0]}
                      </span>
                      <h4 className="text-xs font-black text-slate-800 leading-snug">{p.name}</h4>
                      <p className="text-[9.5px] text-slate-500 leading-relaxed font-semibold">{p.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono">
                      <div>
                        <span className="text-slate-400 text-[8px] font-bold block uppercase leading-none">Interest Rate</span>
                        <span className="text-emerald-700 font-black">{p.interestRate.toFixed(1)}% p.a.</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[8px] font-bold block uppercase leading-none">Prepayment Fee</span>
                        <span className="text-slate-700 font-extrabold">{p.prepaymentPenaltyRate}%</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. EMI CALCULATOR WITH VISUAL GRAPH REPRESENTATION */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Dynamic Repayment Schedule & EMI Planner</h3>
                <p className="text-[10px] text-slate-400">Forecast cumulative interest outlays over the amortized cycle of the loan.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Inputs and Stats */}
                <div className="md:col-span-4 space-y-4 text-xs font-semibold">
                  <div>
                    <div className="flex justify-between items-center text-[10.5px] font-black text-slate-500 uppercase mb-1">
                      <span>Principal Amount</span>
                      <span className="text-emerald-700 font-extrabold">₹{requestedLoanAmount.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={selectedLoanProduct.minAmount}
                      max={selectedLoanProduct.maxAmount}
                      step={10000}
                      value={requestedLoanAmount}
                      onChange={(e) => setRequestedLoanAmount(parseInt(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[10.5px] font-black text-slate-500 uppercase mb-1">
                      <span>Tenure Duration</span>
                      <span className="text-emerald-700 font-extrabold">{requestedTenureMonths} Months</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={selectedLoanProduct.maxTenureMonths}
                      step={3}
                      value={requestedTenureMonths}
                      onChange={(e) => setRequestedTenureMonths(parseInt(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                  </div>

                  {/* Calculations breakdown list */}
                  <div className="bg-slate-900 text-slate-300 rounded-xl p-4 space-y-2 text-[9.5px] font-mono">
                    <div className="flex justify-between">
                      <span>Monthly EMI:</span>
                      <span className="text-white">₹{emiCalculations.monthlyEmi.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Outlay:</span>
                      <span className="text-white">₹{emiCalculations.totalInterestPayable.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2 text-xs font-bold font-sans text-white">
                      <span>Total Repayment:</span>
                      <span className="text-emerald-400">₹{emiCalculations.totalRepayment.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Graph Visualization (recharts AreaChart) */}
                <div className="md:col-span-8 h-48 bg-slate-50 border border-slate-150 p-2 rounded-xl">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={emiCalculations.scheduleData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip contentStyle={{ fontSize: "10px" }} />
                      <Legend wrapperStyle={{ fontSize: "9px" }} />
                      <Area name="Principal Portion" type="monotone" dataKey="Principal" stroke="#059669" fillOpacity={1} fill="url(#colorPrincipal)" strokeWidth={1.5} />
                      <Area name="Interest Portion" type="monotone" dataKey="Interest" stroke="#dc2626" fillOpacity={1} fill="url(#colorInterest)" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

              </div>
            </div>

            {/* 3. PREPAYMENT PENALTY CALCULATOR */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="h-4.5 w-4.5 text-emerald-600" /> Prepayment Penalty & Subsidy Calculator
                </h3>
                <p className="text-[10px] text-slate-400">Estimate closing costs or interest subvention benefits for clearing debt early.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">
                    Simulate Prepayment Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={prepayAmount}
                    onChange={(e) => setPrepayAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                  />
                  <span className="text-[9px] text-slate-400 mt-1 block">
                    Product rate applied: {selectedLoanProduct.prepaymentPenaltyRate}% of prepayment principal.
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 text-[8.5px] uppercase font-black block">Prepayment Penalty Levy</span>
                    <span className={`text-base font-black ${emiCalculations.penaltyAmount > 0 ? "text-red-600" : "text-emerald-700"}`}>
                      {emiCalculations.penaltyAmount > 0 ? `₹${emiCalculations.penaltyAmount.toLocaleString()}` : "Zero Penalty (KCC Waived)"}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-400 text-right space-y-0.5">
                    <p>• Government subventions cover KCC prepayment.</p>
                    <p>• Non-KCC terms apply small penalty charges.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: AI ELIGIBILITY & DOCUMENT UPLOAD (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">

            {/* 1. AI CREDIT SCORING & ELIGIBILITY CHECKER */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="h-4.5 w-4.5 text-emerald-600" /> AI Credit Scorer & Collateral Valuation
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Automated land title evaluation and immediate eligibility scoring.</p>
                </div>
                <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
              </div>

              {/* Dynamic land size and irrigation inputs */}
              <div className="space-y-3.5 text-xs font-semibold">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Land Holding Area (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={landAreaAcres}
                    onChange={(e) => setLandAreaAcres(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Irrigation Source</label>
                    <select
                      value={irrigationSource}
                      onChange={(e) => setIrrigationSource(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                    >
                      <option value="Tubewell">Tubewell (Stable)</option>
                      <option value="Canal Feed">Canal Feed</option>
                      <option value="Rainfed">Rainfed (Unstable)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Other Debt Outstandings</label>
                    <input
                      type="number"
                      step="5000"
                      value={existingDebt}
                      onChange={(e) => setExistingDebt(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Collateral valuation type selector */}
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Collateral Pledge Option</label>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {(["Land Title", "Harvester Machinery"] as const).map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedCollateralType(col)}
                        className={`py-1.5 rounded-lg text-[9.5px] font-black border uppercase text-center transition-all cursor-pointer ${
                          selectedCollateralType === col
                            ? "bg-emerald-700 border-emerald-700 text-white"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Screen */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                    <div>
                      <span className="text-[8.5px] font-black text-emerald-800 uppercase block">AI Rating Index</span>
                      <span className="text-xl font-black text-emerald-950 leading-none">{aiEligibilityScore.score} / 100</span>
                    </div>
                    <span className="text-[9px] font-black uppercase text-emerald-700">
                      Approval Status: <strong className="underline">{aiEligibilityScore.status}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[9.5px] font-semibold text-emerald-900 leading-normal">
                    <div>
                      <span className="text-[8px] text-emerald-700 uppercase block font-bold">Collateral Value</span>
                      <span className="font-extrabold text-emerald-950">₹{aiEligibilityScore.collateralValuationValue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-emerald-700 uppercase block font-bold">Max Limit Approved</span>
                      <span className="font-extrabold text-emerald-950">₹{aiEligibilityScore.maxEligibleLimit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. DOCUMENT UPLOAD & REGISTRY VERIFICATION SUITE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" /> Land Registry Documents Verification
                </h3>
                <p className="text-[10px] text-slate-400">Bilateral document verification scanned with immediate OCR land records indexing.</p>
              </div>

              <div className="space-y-3">
                {uploadedDocuments.map((doc, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg flex justify-between items-center text-xs font-semibold">
                    <div>
                      <span className="text-slate-800 block text-[10.5px] font-extrabold">{doc.name}</span>
                      <span className="text-[9px] text-slate-400 font-mono">Size: {doc.size}</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> verified
                    </span>
                  </div>
                ))}

                {/* Upload Action */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50/50 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg"
                    onChange={handleDocumentUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                  <span className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wide">Upload Land Registry Document</span>
                  <span className="text-[8.5px] text-slate-400 mt-1 block">Supports PDF, PNG, JPG files up to 10MB</span>
                </div>

                {documentMessage && (
                  <div className="text-[9.5px] font-bold p-2 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded">
                    {documentMessage}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW SECTION 2: INSURANCE PRODUCTS, CLAIM FILING & BUNDLE DISCOUNTS */}
      {activeTab === "insurance" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: INSURANCE SELECTOR, BUNDLE ENGINE & COMPARISON (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. Insurance Comparison & Selectors */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="h-4.5 w-4.5 text-emerald-600" /> Farmers Sovereign Insurance Suite
                </h3>
                <p className="text-[10px] text-slate-400">Select multiple policy covers to automatically qualify for structural bundle discount premiums.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insuranceProducts.map((p) => {
                  const isSelected = selectedInsurances.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleInsuranceSelection(p.id)}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-50/70 border-emerald-600 shadow-xs"
                          : "bg-white border-slate-200 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[8.5px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {p.category}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-slate-400">Sum: ₹{p.sumInsured.toLocaleString()}</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 leading-snug">{p.name}</h4>
                        <p className="text-[9.5px] text-slate-500 leading-relaxed font-semibold">{p.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono font-black">
                        <div>
                          <span className="text-slate-400 text-[8px] font-bold block uppercase leading-none">Annual Premium Rate</span>
                          <span className="text-emerald-700">{p.basePremiumRate.toFixed(1)}% p.a.</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 text-[8px] font-bold block uppercase leading-none">Sum Insured</span>
                          <span className="text-slate-800">₹{p.sumInsured.toLocaleString()}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. CLAIM TRACKING TIMELINE / LEDGER */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-4.5 w-4.5 text-emerald-600" /> Active Settlement Claims Tracker
                </h3>
                <p className="text-[10px] text-slate-400">Real-time settlement workflows backed by public PMFBY field inspectors.</p>
              </div>

              <div className="space-y-3 font-semibold text-xs text-slate-600">
                {activeClaims.map((claim) => (
                  <div key={claim.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-black uppercase text-slate-400 font-mono">Claim ID: {claim.id}</span>
                        <span className="text-[8.5px] font-black uppercase text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                          Sum Insured: ₹{claim.sumInsured.toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-slate-800 font-extrabold text-[12.5px] leading-tight">{claim.category}</h4>
                      <p className="text-[9.5px] text-slate-400">Filed Date: {claim.filedDate}</p>
                    </div>

                    <div className="text-right font-mono text-[10px]">
                      <span className="text-slate-400 text-[8px] font-bold block uppercase leading-none">Estimated Payout</span>
                      <span className="text-emerald-700 font-black text-xs">₹{claim.estimatedSettlement.toLocaleString()}</span>
                      <span className={`text-[8.5px] font-sans font-black uppercase block mt-1.5 px-2 py-0.5 rounded ${
                        claim.status === "Settlement Approved"
                          ? "bg-emerald-50 text-emerald-700 animate-pulse"
                          : "bg-indigo-50 text-indigo-700"
                      }`}>
                        {claim.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: PREMIUM CALCULATOR, BUNDLE DISCOUNTS & CLAIMS FORM (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">

            {/* 1. DYNAMIC PREMIUM BUNDLE CALCULATOR */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator className="h-4.5 w-4.5 text-emerald-600" /> Insurance Premium Bundle Engine
                </h3>
                <p className="text-[10px] text-slate-400">Automated multi-cover bundle discounts applied in real-time.</p>
              </div>

              <div className="bg-slate-900 text-slate-300 rounded-xl p-4 space-y-2.5 font-mono text-[9.5px] leading-relaxed">
                <div className="flex justify-between">
                  <span>Selected Policies:</span>
                  <span className="text-white">{selectedInsurances.length} Covers</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross Premium Sum:</span>
                  <span className="text-white">₹{insurancePremiumSummary.grossPremium.toLocaleString()}</span>
                </div>
                {insurancePremiumSummary.discountRate > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Bundle Discount ({insurancePremiumSummary.discountRate}%):</span>
                    <span>- ₹{insurancePremiumSummary.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-800 pt-2 text-xs font-bold font-sans text-white">
                  <span>Net Annual Premium:</span>
                  <span className="text-emerald-400">₹{insurancePremiumSummary.finalPremium.toLocaleString()} / year</span>
                </div>
              </div>

              {insurancePremiumSummary.discountRate > 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2.5 text-[9.5px] font-semibold text-emerald-900 leading-snug">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span>Congrats! Bundle discount of <strong>10% applied</strong> for selecting multiple agricultural coverages.</span>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-[9.5px] font-semibold text-slate-500 leading-snug">
                  💡 Tip: Select 2 or more policy covers above to activate a <strong>10% premium waiver discount</strong>.
                </div>
              )}
            </div>

            {/* 2. INSURANCE CLAIMS FILING FORM */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4.5 w-4.5 text-red-600" /> File Insurance Claim Cover
                </h3>
                <p className="text-[10px] text-slate-400">Initiate emergency claim processing following field incidents.</p>
              </div>

              <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Target Policy Cover</label>
                  <select
                    value={claimPolicyId}
                    onChange={(e) => setClaimPolicyId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                  >
                    {insuranceProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Sum: ₹{p.sumInsured.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Loss Incident Description</label>
                  <textarea
                    rows={3}
                    value={claimLossDescription}
                    onChange={(e) => setClaimLossDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    placeholder="Provide granular weather indicators or mechanical failures during the time of loss..."
                  />
                </div>

                {claimSuccessMsg && (
                  <div className="text-[9.5px] font-bold p-2.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-150 leading-relaxed">
                    {claimSuccessMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-black py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="h-4 w-4" /> File Emergency Claim
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
