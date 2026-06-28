import React, { useState, useEffect, useMemo } from "react";
import {
  Wrench,
  Gauge,
  Map,
  Compass,
  Calendar,
  Clock,
  ShieldCheck,
  User,
  Fuel,
  Coins,
  Star,
  CheckCircle,
  AlertTriangle,
  Play,
  Square,
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
  MapPin,
  MessageSquare,
  ShieldAlert,
  ThumbsUp,
  Sliders,
  DollarSign,
  Locate
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";

// Interfaces
export interface Equipment {
  id: string;
  name: string;
  type: "Tractor" | "Harvester" | "Rotavator" | "Seed Drill" | "Sprayer" | "Tiller" | "Thresher";
  model: string;
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  fuelBurnRate: number; // Liters per hour
  gpsLocation: {
    lat: number;
    lng: number;
    label: string;
  };
  aiMaintenanceStatus: {
    healthScore: number;
    nextServiceHours: number;
    predictedFailures: string[];
    sensorReadouts: {
      engineTemp: number; // °C
      oilPressure: number; // PSI
      beltTension: string;
      hydraulicFluid: number; // %
    };
  };
  operators: {
    name: string;
    avatar: string;
    rating: number;
    experienceYears: number;
    hourlyRate: number;
    isAvailable: boolean;
  }[];
  damageDeposit: number;
  reviews: {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  alreadyBookedIntervals: {
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
  }[];
  iotState: {
    engineRunning: boolean;
    fuelLevel: number;
    rpm: number;
    temperature: number;
    speedGps: number;
  };
}

export const EquipmentRentalSystem: React.FC = () => {
  // Pre-seeded equipment models with high detail
  const [equipments, setEquipments] = useState<Equipment[]>([
    {
      id: "equip-1",
      name: "John Deere 5050D Utility Tractor",
      type: "Tractor",
      model: "2025 Multi-Terrain Turbo-Charged",
      hourlyRate: 15,
      dailyRate: 110,
      weeklyRate: 650,
      fuelBurnRate: 6.2,
      gpsLocation: { lat: 31.621, lng: 74.873, label: "Amritsar Hub Sector 2" },
      aiMaintenanceStatus: {
        healthScore: 92,
        nextServiceHours: 42,
        predictedFailures: [
          "Belt slipping risk: 14% wear index observed",
          "Hydraulic valve micro-friction warning: service advised in 40 hours"
        ],
        sensorReadouts: { engineTemp: 82, oilPressure: 45, beltTension: "Optimal", hydraulicFluid: 88 }
      },
      operators: [
        { name: "Jagjeet Singh", avatar: "👨‍🌾", rating: 4.9, experienceYears: 12, hourlyRate: 12, isAvailable: true },
        { name: "Sukhwinder P.", avatar: "🚜", rating: 4.7, experienceYears: 8, hourlyRate: 10, isAvailable: true }
      ],
      damageDeposit: 250,
      reviews: [
        { id: "rev-1", user: "Harpreet Brar", rating: 5, comment: "Excellent power output. Delivered immaculate tilling across 20 acres.", date: "2026-06-20" },
        { id: "rev-2", user: "Gaurav Sharma", rating: 4, comment: "Extremely reliable engine. Clean torque, fuel consumption was exactly as estimated.", date: "2026-06-18" }
      ],
      alreadyBookedIntervals: [
        { start: "2026-06-29", end: "2026-06-30" },
        { start: "2026-07-04", end: "2026-07-06" }
      ],
      iotState: {
        engineRunning: false,
        fuelLevel: 85,
        rpm: 0,
        temperature: 28,
        speedGps: 0
      }
    },
    {
      id: "equip-2",
      name: "Claast Tiger Multi-Crop Combine Harvester",
      type: "Harvester",
      model: "Sovereign Series 8",
      hourlyRate: 45,
      dailyRate: 320,
      weeklyRate: 1850,
      fuelBurnRate: 12.5,
      gpsLocation: { lat: 31.515, lng: 74.982, label: "Ludhiana Regional Depot" },
      aiMaintenanceStatus: {
        healthScore: 78,
        nextServiceHours: 12,
        predictedFailures: [
          "Urgent: Drum cutter misalignment (3.2mm deviation detected)",
          "Predicted header motor jam: 78% belt-wear index (Critical limit soon)"
        ],
        sensorReadouts: { engineTemp: 94, oilPressure: 38, beltTension: "Warning (Low)", hydraulicFluid: 64 }
      },
      operators: [
        { name: "Amrik Singh", avatar: "🤠", rating: 5.0, experienceYears: 15, hourlyRate: 18, isAvailable: true },
        { name: "Jaspal Dhillon", avatar: "👨‍🔧", rating: 4.6, experienceYears: 6, hourlyRate: 15, isAvailable: false }
      ],
      damageDeposit: 500,
      reviews: [
        { id: "rev-3", user: "Baldev Singh", rating: 5, comment: "High throughput! Saved me 3 full days of manual harvesting labor.", date: "2026-06-24" }
      ],
      alreadyBookedIntervals: [
        { start: "2026-06-28", end: "2026-06-28" }
      ],
      iotState: {
        engineRunning: true,
        fuelLevel: 54,
        rpm: 1850,
        temperature: 92,
        speedGps: 8.5
      }
    },
    {
      id: "equip-3",
      name: "Maschio Gaspardo Heavy Duty Rotavator",
      type: "Rotavator",
      model: "Virat 205 High Intensity",
      hourlyRate: 10,
      dailyRate: 75,
      weeklyRate: 420,
      fuelBurnRate: 3.5,
      gpsLocation: { lat: 31.688, lng: 74.821, label: "Gurdaspur Cooperative Storage" },
      aiMaintenanceStatus: {
        healthScore: 95,
        nextServiceHours: 110,
        predictedFailures: [],
        sensorReadouts: { engineTemp: 45, oilPressure: 50, beltTension: "Excellent", hydraulicFluid: 95 }
      },
      operators: [
        { name: "Ranjit Roy", avatar: "👨‍🌾", rating: 4.8, experienceYears: 7, hourlyRate: 9, isAvailable: true }
      ],
      damageDeposit: 150,
      reviews: [
        { id: "rev-4", user: "Rajesh Patil", rating: 5, comment: "Tilled my fields to perfection. Blade sharpness was highly satisfactory.", date: "2026-06-15" }
      ],
      alreadyBookedIntervals: [],
      iotState: {
        engineRunning: false,
        fuelLevel: 100,
        rpm: 0,
        temperature: 24,
        speedGps: 0
      }
    },
    {
      id: "equip-4",
      name: "Fieldking Multi-Row Disc Seed Drill",
      type: "Seed Drill",
      model: "SowMaster Pro 6",
      hourlyRate: 12,
      dailyRate: 85,
      weeklyRate: 480,
      fuelBurnRate: 4.0,
      gpsLocation: { lat: 31.421, lng: 74.654, label: "Batala Equipment Yards" },
      aiMaintenanceStatus: {
        healthScore: 88,
        nextServiceHours: 28,
        predictedFailures: [
          "Seed tube block indicator in Row 4 (minor debris detected)"
        ],
        sensorReadouts: { engineTemp: 35, oilPressure: 42, beltTension: "Optimal", hydraulicFluid: 82 }
      },
      operators: [
        { name: "Sukhwinder P.", avatar: "🚜", rating: 4.7, experienceYears: 8, hourlyRate: 10, isAvailable: true }
      ],
      damageDeposit: 180,
      reviews: [],
      alreadyBookedIntervals: [
        { start: "2026-06-30", end: "2026-07-02" }
      ],
      iotState: {
        engineRunning: false,
        fuelLevel: 92,
        rpm: 0,
        temperature: 25,
        speedGps: 0
      }
    },
    {
      id: "equip-5",
      name: "Aspee Premium Heavy Boom Sprayer",
      type: "Sprayer",
      model: "AeroJet 600 Liters",
      hourlyRate: 14,
      dailyRate: 95,
      weeklyRate: 550,
      fuelBurnRate: 5.0,
      gpsLocation: { lat: 31.599, lng: 74.912, label: "Amritsar Sector 3 Depot" },
      aiMaintenanceStatus: {
        healthScore: 91,
        nextServiceHours: 55,
        predictedFailures: [],
        sensorReadouts: { engineTemp: 52, oilPressure: 44, beltTension: "Optimal", hydraulicFluid: 90 }
      },
      operators: [
        { name: "Jagjeet Singh", avatar: "👨‍🌾", rating: 4.9, experienceYears: 12, hourlyRate: 12, isAvailable: true }
      ],
      damageDeposit: 200,
      reviews: [
        { id: "rev-5", user: "Eswar Reddy", rating: 5, comment: "Uniform mist distribution. Excellent flow pressure tracking controller.", date: "2026-06-25" }
      ],
      alreadyBookedIntervals: [],
      iotState: {
        engineRunning: false,
        fuelLevel: 75,
        rpm: 0,
        temperature: 26,
        speedGps: 0
      }
    },
    {
      id: "equip-6",
      name: "Honda Power FJ500 Rotary Tiller",
      type: "Tiller",
      model: "AgroForce Compact",
      hourlyRate: 8,
      dailyRate: 60,
      weeklyRate: 350,
      fuelBurnRate: 2.8,
      gpsLocation: { lat: 31.642, lng: 74.891, label: "Amritsar Hub Sector 2" },
      aiMaintenanceStatus: {
        healthScore: 84,
        nextServiceHours: 18,
        predictedFailures: [
          "Air filter high dust impedance: replacement advised in 15 operating hours"
        ],
        sensorReadouts: { engineTemp: 78, oilPressure: 32, beltTension: "Optimal", hydraulicFluid: 70 }
      },
      operators: [
        { name: "Gurpreet Brar", avatar: "👨‍🌾", rating: 4.5, experienceYears: 4, hourlyRate: 8, isAvailable: true }
      ],
      damageDeposit: 100,
      reviews: [],
      alreadyBookedIntervals: [],
      iotState: {
        engineRunning: false,
        fuelLevel: 68,
        rpm: 0,
        temperature: 22,
        speedGps: 0
      }
    },
    {
      id: "equip-7",
      name: "Landforce Multi-Crop High Speed Thresher",
      type: "Thresher",
      model: "ThreshMax 3000 Grain Master",
      hourlyRate: 18,
      dailyRate: 130,
      weeklyRate: 750,
      fuelBurnRate: 7.5,
      gpsLocation: { lat: 31.528, lng: 74.799, label: "Ludhiana Regional Depot" },
      aiMaintenanceStatus: {
        healthScore: 96,
        nextServiceHours: 120,
        predictedFailures: [],
        sensorReadouts: { engineTemp: 68, oilPressure: 48, beltTension: "Excellent", hydraulicFluid: 96 }
      },
      operators: [
        { name: "Amrik Singh", avatar: "🤠", rating: 5.0, experienceYears: 15, hourlyRate: 18, isAvailable: true }
      ],
      damageDeposit: 300,
      reviews: [
        { id: "rev-6", user: "Satnam Singh", rating: 5, comment: "High speed threshing with almost zero seed breakage. Superb piece of engineering.", date: "2026-06-11" }
      ],
      alreadyBookedIntervals: [
        { start: "2026-07-10", end: "2026-07-12" }
      ],
      iotState: {
        engineRunning: false,
        fuelLevel: 90,
        rpm: 0,
        temperature: 26,
        speedGps: 0
      }
    }
  ]);

  // Selected Equipment ID
  const [selectedEquipId, setSelectedEquipId] = useState<string>("equip-1");

  const selectedEquip = useMemo(() => {
    return equipments.find((e) => e.id === selectedEquipId) || equipments[0];
  }, [equipments, selectedEquipId]);

  // --- BOOKING STATES & CALCULATION CONTROLLERS ---
  const [rentalTier, setRentalTier] = useState<"Hourly" | "Daily" | "Weekly">("Daily");
  const [durationUnits, setDurationUnits] = useState<number>(3); // e.g. 3 hours, 3 days, or 3 weeks
  const [startDateStr, setStartDateStr] = useState<string>("2026-07-01");
  const [endDateStr, setEndDateStr] = useState<string>("2026-07-03");

  const [includeOperator, setIncludeOperator] = useState<boolean>(false);
  const [selectedOperatorIndex, setSelectedOperatorIndex] = useState<number>(0);
  const [addInsurance, setAddInsurance] = useState<boolean>(true);

  // Auto-set duration units based on date change in Daily mode
  useEffect(() => {
    if (rentalTier === "Daily" && startDateStr && endDateStr) {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (!isNaN(diffDays) && diffDays > 0) {
        setDurationUnits(diffDays);
      }
    }
  }, [startDateStr, endDateStr, rentalTier]);

  // Check Schedule Conflict
  const hasConflict = useMemo(() => {
    if (rentalTier !== "Daily") return false; // simple check for demonstration
    const reqStart = new Date(startDateStr);
    const reqEnd = new Date(endDateStr);

    return selectedEquip.alreadyBookedIntervals.some((interval) => {
      const bookedStart = new Date(interval.start);
      const bookedEnd = new Date(interval.end);
      return reqStart <= bookedEnd && reqEnd >= bookedStart;
    });
  }, [startDateStr, endDateStr, selectedEquip, rentalTier]);

  // Cost calculations
  const priceEstimates = useMemo(() => {
    let baseRate = selectedEquip.dailyRate;
    if (rentalTier === "Hourly") baseRate = selectedEquip.hourlyRate;
    if (rentalTier === "Weekly") baseRate = selectedEquip.weeklyRate;

    const baseCost = baseRate * durationUnits;

    // Fuel Estimation
    // For Hourly: rate * units. For Daily: rate * 6 operating hours/day. For Weekly: rate * 35 operating hours/week.
    let estimatedOperatingHours = durationUnits;
    if (rentalTier === "Daily") estimatedOperatingHours = durationUnits * 6;
    if (rentalTier === "Weekly") estimatedOperatingHours = durationUnits * 35;

    const estimatedFuelLitres = estimatedOperatingHours * selectedEquip.fuelBurnRate;
    const fuelPricePerLitre = 1.12; // regional average
    const fuelCost = estimatedFuelLitres * fuelPricePerLitre;

    // Operator Cost
    const activeOperator = selectedEquip.operators[selectedOperatorIndex];
    let operatorCost = 0;
    if (includeOperator && activeOperator) {
      const opRate = activeOperator.hourlyRate;
      operatorCost = opRate * estimatedOperatingHours;
    }

    // Insurance
    const insurancePremiumPerDay = 15;
    const insuranceCost = addInsurance ? (rentalTier === "Weekly" ? durationUnits * 7 : rentalTier === "Daily" ? durationUnits : 1) * insurancePremiumPerDay : 0;

    // Grand Total
    const total = baseCost + fuelCost + operatorCost + insuranceCost + selectedEquip.damageDeposit;

    return {
      baseCost,
      estimatedFuelLitres,
      fuelCost,
      operatorCost,
      insuranceCost,
      damageDeposit: selectedEquip.damageDeposit,
      total
    };
  }, [selectedEquip, rentalTier, durationUnits, includeOperator, selectedOperatorIndex, addInsurance]);

  // --- REVIEWS & FEEDBACK STATE ---
  const [newReviewerName, setNewReviewerName] = useState<string>("");
  const [newReviewComment, setNewReviewComment] = useState<string>("");
  const [newReviewRating, setNewReviewRating] = useState<number>(5);

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      user: newReviewerName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString().split("T")[0]
    };

    setEquipments((prev) =>
      prev.map((eq) => {
        if (eq.id === selectedEquip.id) {
          return {
            ...eq,
            reviews: [newRev, ...eq.reviews]
          };
        }
        return eq;
      })
    );

    setNewReviewerName("");
    setNewReviewComment("");
    alert("✓ Thank you! Your verified equipment review and efficiency rating has been added to the system logs.");
  };

  // --- IOT CONTROLLERS ENGINE STATE SIMULATOR ---
  const [engineState, setEngineState] = useState({
    rpm: selectedEquip.iotState.rpm,
    temp: selectedEquip.iotState.temperature,
    speed: selectedEquip.iotState.speedGps,
    running: selectedEquip.iotState.engineRunning
  });

  // Sync virtual engine state when switching equipment
  useEffect(() => {
    setEngineState({
      rpm: selectedEquip.iotState.rpm,
      temp: selectedEquip.iotState.temperature,
      speed: selectedEquip.iotState.speedGps,
      running: selectedEquip.iotState.engineRunning
    });
  }, [selectedEquipId]);

  // Virtual Live Telemetry fluctuations when engine is running
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (engineState.running) {
      interval = setInterval(() => {
        setEngineState((prev) => {
          const targetRpm = 1700 + Math.floor(Math.random() * 150);
          const targetTemp = 88 + Math.floor(Math.random() * 6);
          const targetSpeed = selectedEquip.type === "Harvester" ? 6 + Math.random() * 3 : 15 + Math.random() * 5;

          return {
            rpm: targetRpm,
            temp: Math.min(105, prev.temp + (targetTemp - prev.temp) * 0.15 + (Math.random() - 0.5)),
            speed: parseFloat(targetSpeed.toFixed(1)),
            running: true
          };
        });
      }, 1000);
    } else {
      setEngineState((prev) => ({
        rpm: 0,
        temp: Math.max(28, prev.temp - 2.5),
        speed: 0,
        running: false
      }));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [engineState.running, selectedEquipId]);

  const toggleRemoteIgnition = () => {
    const nextRunning = !engineState.running;
    setEngineState((prev) => ({
      ...prev,
      running: nextRunning,
      rpm: nextRunning ? 1600 : 0
    }));

    setEquipments((prev) =>
      prev.map((eq) => {
        if (eq.id === selectedEquip.id) {
          return {
            ...eq,
            iotState: {
              ...eq.iotState,
              engineRunning: nextRunning,
              rpm: nextRunning ? 1600 : 0
            }
          };
        }
        return eq;
      })
    );

    alert(`[IoT Telemetry] Remote signal dispatched. Engine ${nextRunning ? "IGNITED & LIVE" : "POWERED OFF"} via cloud controller gateway.`);
  };

  // Run AI Diagnostic Scan trigger
  const [isDiagnosticScanning, setIsDiagnosticScanning] = useState<boolean>(false);
  const [scannedHealth, setScannedHealth] = useState<number | null>(null);

  const handleRunAiDiagnostic = () => {
    setIsDiagnosticScanning(true);
    setTimeout(() => {
      setIsDiagnosticScanning(false);
      setScannedHealth(selectedEquip.aiMaintenanceStatus.healthScore);
      alert(`✓ AI Predictive Maintenance Report Compiled. Machine structural health stands at ${selectedEquip.aiMaintenanceStatus.healthScore}%. Sensor logs verified clean.`);
    }, 1500);
  };

  // --- BOOKING FORM SUBMISSION ---
  const [userBookings, setUserBookings] = useState<{
    id: string;
    equipName: string;
    startDate: string;
    endDate: string;
    totalPaid: number;
    withOperator: boolean;
    insurance: boolean;
  }[]>([]);

  const handleConfirmBooking = () => {
    if (hasConflict) {
      alert("❌ Critical Scheduling Conflict: The selected dates overlap with an existing block. Please select alternative dates.");
      return;
    }

    const newBooking = {
      id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      equipName: selectedEquip.name,
      startDate: startDateStr,
      endDate: endDateStr,
      totalPaid: priceEstimates.total,
      withOperator: includeOperator,
      insurance: addInsurance
    };

    // Add booked interval to localized state
    setEquipments((prev) =>
      prev.map((eq) => {
        if (eq.id === selectedEquip.id) {
          return {
            ...eq,
            alreadyBookedIntervals: [
              ...eq.alreadyBookedIntervals,
              { start: startDateStr, end: endDateStr }
            ]
          };
        }
        return eq;
      })
    );

    setUserBookings((prev) => [newBooking, ...prev]);
    alert(`✓ SUCCESS! Booking confirmed. Booking reference: ${newBooking.id}. Refundable Damage Deposit of $${selectedEquip.damageDeposit} is held in secure agricultural smart escrow.`);
  };

  // --- ANALYTICS DEMO CHARTS DATA ---
  const usageAnalyticsData = [
    { hour: "08:00", dieselBurn: 5.4, engineRpm: 1650, throttleEfficiency: 92 },
    { hour: "10:00", dieselBurn: 6.8, engineRpm: 1820, throttleEfficiency: 88 },
    { hour: "12:00", dieselBurn: 7.2, engineRpm: 1900, throttleEfficiency: 95 },
    { hour: "14:00", dieselBurn: 6.0, engineRpm: 1750, throttleEfficiency: 91 },
    { hour: "16:00", dieselBurn: 5.8, engineRpm: 1680, throttleEfficiency: 94 },
    { hour: "18:00", dieselBurn: 4.5, engineRpm: 1500, throttleEfficiency: 96 }
  ];

  return (
    <div id="equipment-rental-dashboard" className="space-y-6">

      {/* Main Header Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-900 flex items-center gap-1.5 w-fit">
            <Wrench className="h-3 w-3" /> Live IoT Rental Registry
          </span>
          <h2 className="text-white text-base font-black uppercase tracking-tight mt-2">Shared Farm Machinery Command Center</h2>
          <p className="text-slate-400 text-[10px] font-medium">Bilateral tractor leaseholds, machine-learning failure telemetry, operator pooling, and remote ignition triggers.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
            <span className="text-slate-500 text-[8px] uppercase font-bold block">Active Fleet Size</span>
            <span className="text-emerald-400 text-xs font-black">{equipments.length} Heavy Units</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
            <span className="text-slate-500 text-[8px] uppercase font-bold block">Operators On-Call</span>
            <span className="text-teal-400 text-xs font-black">5 Certified Drivers</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: REGISTRY INDEX (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Heavy Machinery Fleet</h3>
              <p className="text-[10px] text-slate-500">Select standard, high-clearance, or high-throughput mechanical units near Amritsar.</p>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {equipments.map((eq) => {
                const isSelected = eq.id === selectedEquipId;
                const activeReviewCount = eq.reviews.length;
                const averageStars = activeReviewCount
                  ? (eq.reviews.reduce((acc, r) => acc + r.rating, 0) / activeReviewCount).toFixed(1)
                  : "5.0";

                return (
                  <div
                    key={eq.id}
                    onClick={() => setSelectedEquipId(eq.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative space-y-2 hover:shadow-md ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/10 ring-2 ring-emerald-600/15"
                        : "border-slate-150 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">{eq.type}</span>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{eq.name}</h4>
                        <p className="text-[9px] text-slate-500">{eq.model}</p>
                      </div>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                        eq.aiMaintenanceStatus.healthScore >= 90
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : eq.aiMaintenanceStatus.healthScore >= 80
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-700 border border-red-200 animate-pulse"
                      }`}>
                        {eq.aiMaintenanceStatus.healthScore}% Health
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px]">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-extrabold text-slate-700">{averageStars}</span>
                        <span className="text-slate-400 text-[8px]">({activeReviewCount})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[8px] uppercase font-bold block">Base Daily Rate</span>
                        <span className="text-emerald-700 font-black">${eq.dailyRate}/Day</span>
                      </div>
                    </div>

                    {eq.iotState.engineRunning && (
                      <div className="bg-amber-50 border border-amber-200/50 rounded p-1.5 text-[8px] text-amber-800 font-extrabold flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Play className="h-2 w-2 text-amber-600 fill-amber-600 animate-ping" />
                          ENGINE ACTIVE ON FIELD
                        </span>
                        <span>{eq.iotState.speedGps} km/h • GPS tracked</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* MY ACTIVE BOOKINGS SUMMARY */}
          {userBookings.length > 0 && (
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3.5">
              <span className="text-[9px] font-black uppercase text-teal-400 tracking-wider block">My Leasehold Contracts</span>
              <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                {userBookings.map((b) => (
                  <div key={b.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-[10px]">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-white">{b.equipName}</span>
                      <span className="text-teal-400 text-[8px] uppercase">{b.id}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[9px]">
                      <span>{b.startDate} to {b.endDate}</span>
                      <span className="text-emerald-400 font-extrabold">${b.totalPaid.toFixed(2)} total</span>
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-500 pt-1 border-t border-slate-900">
                      <span>{b.withOperator ? "✓ Driver Added" : "Self-Operated"}</span>
                      <span>{b.insurance ? "✓ Insured" : "No Premium"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* MIDDLE COLUMN: LEASE DESK & GPS TRACKER (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">

          {/* DYNAMIC LEASE BOOKING TERMINAL */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[9px] uppercase font-black text-emerald-700 tracking-wider">Leasing Workspace</span>
              <h3 className="text-xs font-black text-slate-900 mt-0.5">Rent: {selectedEquip.name}</h3>
              <p className="text-[10px] text-slate-400">Configure lease periods, hire operators, and review dynamic cost projections.</p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Hourly, Daily, Weekly selector */}
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1.5">Booking Sched Tier</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Hourly", "Daily", "Weekly"] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => {
                        setRentalTier(tier);
                        setDurationUnits(tier === "Hourly" ? 4 : tier === "Weekly" ? 1 : 3);
                      }}
                      className={`py-2 rounded-lg text-[10px] font-black border transition-all cursor-pointer text-center ${
                        rentalTier === tier
                          ? "bg-emerald-700 border-emerald-700 text-white shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {tier} Booking
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Units / Dates configuration */}
              {rentalTier === "Hourly" ? (
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Target Hours</label>
                  <input
                    type="number"
                    value={durationUnits}
                    onChange={(e) => setDurationUnits(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDateStr}
                      onChange={(e) => setStartDateStr(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDateStr}
                      onChange={(e) => setEndDateStr(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold"
                    />
                  </div>
                </div>
              )}

              {/* Conflict Indicator */}
              {rentalTier === "Daily" && (
                <div className={`p-2.5 rounded-xl border text-[10px] font-bold flex items-center justify-between ${
                  hasConflict
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                }`}>
                  <span className="flex items-center gap-1.5">
                    {hasConflict ? <ShieldAlert className="h-4 w-4 text-red-600" /> : <ShieldCheck className="h-4 w-4 text-emerald-600" />}
                    {hasConflict ? "Conflict Warning: Dates Booked Already" : "Smart Scheduling: Dates Clear of Conflict"}
                  </span>
                  <span>{hasConflict ? "Unfit" : "Ready"}</span>
                </div>
              )}

              {/* Professional Operator add-on selection */}
              <div className="bg-slate-50/50 border border-slate-200 p-3.5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-500" /> Operator Staff Allocation
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeOperator}
                      onChange={(e) => setIncludeOperator(e.target.checked)}
                      className="accent-emerald-700 h-4.5 w-4.5 cursor-pointer"
                    />
                    <span className="ml-1.5 text-[9px] font-extrabold text-slate-600">Assign Driver</span>
                  </label>
                </div>

                {includeOperator && (
                  <div className="space-y-2">
                    <label className="block text-[8px] font-bold text-slate-400 uppercase">Select Available Operator</label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedEquip.operators.map((op, idx) => (
                        <div
                          key={idx}
                          onClick={() => op.isAvailable && setSelectedOperatorIndex(idx)}
                          className={`p-2 rounded-lg border text-[10px] font-semibold cursor-pointer transition-all ${
                            !op.isAvailable
                              ? "bg-slate-100 border-slate-150 text-slate-400 cursor-not-allowed"
                              : selectedOperatorIndex === idx
                              ? "bg-emerald-50 border-emerald-600 text-emerald-800"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">{op.avatar}</span>
                            <div>
                              <p className="font-bold leading-none">{op.name}</p>
                              <p className="text-[8px] text-slate-400 mt-0.5">{op.experienceYears}yr exp • ${op.hourlyRate}/hr</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fuel and Insurance protection check */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="text-[10px]">
                    <span className="text-slate-500 font-bold block uppercase text-[8px]">Fuel Burn Estimator</span>
                    <span className="text-slate-800 font-extrabold">{priceEstimates.estimatedFuelLitres.toFixed(1)} Litres</span>
                  </div>
                  <Fuel className="h-5 w-5 text-slate-400" />
                </div>

                <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="text-[10px]">
                    <span className="text-slate-500 font-bold block uppercase text-[8px]">Damage Insurance</span>
                    <span className="text-slate-800 font-extrabold">${priceEstimates.insuranceCost} Prem</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addInsurance}
                      onChange={(e) => setAddInsurance(e.target.checked)}
                      className="accent-emerald-700 h-4.5 w-4.5 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Bill breakdown sheets */}
              <div className="bg-slate-900 text-slate-300 rounded-xl p-4 space-y-2 text-[10px] font-medium font-mono">
                <div className="flex justify-between text-[8px] uppercase tracking-wider text-slate-500 pb-1.5 border-b border-slate-800">
                  <span>Leasehold Itemized Invoice</span>
                  <span>Amount ($)</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Lease Rate ({rentalTier} x {durationUnits}):</span>
                  <span className="text-white">${priceEstimates.baseCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel Consumption Reserve ($1.12/L):</span>
                  <span className="text-white">${priceEstimates.fuelCost.toFixed(2)}</span>
                </div>
                {includeOperator && (
                  <div className="flex justify-between">
                    <span>Operator Labor allocation:</span>
                    <span className="text-white">${priceEstimates.operatorCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Damage Liability Premium:</span>
                  <span className="text-white">${priceEstimates.insuranceCost}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-1.5">
                  <span>Escrow Refundable Damage Deposit:</span>
                  <span className="text-emerald-400">${priceEstimates.damageDeposit}</span>
                </div>
                <div className="flex justify-between border-t border-emerald-500 pt-2 text-xs font-extrabold font-sans text-white">
                  <span>GRAND TOTAL LEASE SECURE:</span>
                  <span className="text-emerald-400">${priceEstimates.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={hasConflict}
                className={`w-full py-2.5 font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  hasConflict
                    ? "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed"
                    : "bg-emerald-700 hover:bg-emerald-800 text-white"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                Establish Secured Machinery Leasehold
              </button>
            </div>
          </div>

          {/* SIMULATOR: LIVE GPS RADAR MAP */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Map className="h-4 w-4 text-emerald-600" />
                  Live GPS Availability Radar
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Live relative GPS coordinates and telemetry links of active leases.</p>
              </div>
              <span className="text-[8px] font-black uppercase text-slate-400">Sector Grid v4</span>
            </div>

            {/* Virtual SVG Map Grid Representation */}
            <div className="border border-slate-150 rounded-xl relative overflow-hidden bg-slate-950 h-44 flex items-center justify-center">
              {/* Radial Scanner Animation */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(16,185,129,0.02)_70%)] animate-pulse" />
              
              {/* Radar rings */}
              <div className="absolute w-28 h-28 border border-emerald-500/10 rounded-full" />
              <div className="absolute w-16 h-16 border border-emerald-500/5 rounded-full" />
              <div className="absolute w-40 h-40 border border-emerald-500/10 rounded-full" />

              {/* Grid axes */}
              <div className="absolute w-full h-px bg-emerald-500/10" />
              <div className="absolute h-full w-px bg-emerald-500/10" />

              {/* Selected Equipment Spot Indicator */}
              <div className="absolute text-center" style={{ transform: "translate(15px, -10px)" }}>
                <div className="h-3 w-3 bg-emerald-500 rounded-full border-2 border-white animate-ping absolute" />
                <div className="h-3 w-3 bg-emerald-500 rounded-full border-2 border-white relative" />
                <span className="bg-slate-900/90 text-[7px] text-emerald-400 font-extrabold px-1.5 py-0.5 rounded border border-slate-800 block mt-1">
                  Active lease
                </span>
              </div>

              {/* Nearby equipment 1 spot */}
              <div className="absolute text-center" style={{ transform: "translate(-60px, 30px)" }}>
                <div className="h-2.5 w-2.5 bg-teal-400 rounded-full border border-slate-900" />
                <span className="text-[6px] text-slate-400 font-semibold block mt-0.5">Ludhiana Hub</span>
              </div>

              {/* Nearby equipment 2 spot */}
              <div className="absolute text-center" style={{ transform: "translate(55px, 45px)" }}>
                <div className="h-2.5 w-2.5 bg-amber-400 rounded-full border border-slate-900" />
                <span className="text-[6px] text-slate-400 font-semibold block mt-0.5">Batala Depot</span>
              </div>

              {/* HUD Readout overlay */}
              <div className="absolute bottom-2.5 left-2.5 bg-slate-900/95 border border-slate-800 p-2 rounded text-[7px] font-mono text-slate-400 space-y-0.5">
                <p className="text-white font-extrabold">GPS HUD:</p>
                <p>Lat: {selectedEquip.gpsLocation.lat.toFixed(3)}</p>
                <p>Lng: {selectedEquip.gpsLocation.lng.toFixed(3)}</p>
                <p className="text-emerald-400 font-bold">Location: {selectedEquip.gpsLocation.label}</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: AI PREDICTIVE SCANNER & IOT CONTROLLER (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-4">

          {/* IOT ENGINE COMMAND CONTROLLER DESK */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[9px] uppercase font-black text-amber-700 tracking-wider">IoT Remote Command Portal</span>
              <h3 className="text-xs font-black text-slate-900 mt-0.5">IoT Remote Control Panel</h3>
              <p className="text-[10px] text-slate-400">Dispatch engine commands, toggle state triggers, and log machine pressure outputs.</p>
            </div>

            <div className="space-y-4">
              {/* remote start stop switch */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <div className="text-[10px]">
                  <span className="text-slate-500 font-bold block uppercase text-[8px]">Virtual Remote Ignition</span>
                  <span className={`font-black ${engineState.running ? "text-emerald-700 animate-pulse" : "text-slate-500"}`}>
                    {engineState.running ? "● ENGINE RUNNING" : "○ ENGINE IDLE"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleRemoteIgnition}
                  className={`p-2.5 rounded-xl cursor-pointer text-xs font-black flex items-center justify-center transition-all ${
                    engineState.running
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-emerald-600 text-white shadow-sm"
                  }`}
                >
                  {engineState.running ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                </button>
              </div>

              {/* IoT Telemetry Gauges */}
              <div className="space-y-2">
                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Virtual Engine HUD</span>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-50 border border-slate-150 rounded-lg p-2 font-mono">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Engine RPM</span>
                    <span className="text-slate-800 text-[11px] font-black">{engineState.rpm} rpm</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 rounded-lg p-2 font-mono">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Engine Temp</span>
                    <span className={`text-[11px] font-black ${engineState.temp >= 95 ? "text-red-600 animate-pulse" : "text-slate-800"}`}>
                      {engineState.temp.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 rounded-lg p-2 font-mono">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Fuel Level</span>
                    <span className="text-slate-800 text-[11px] font-black">{selectedEquip.iotState.fuelLevel}%</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 rounded-lg p-2 font-mono">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">GPS Speed</span>
                    <span className="text-slate-800 text-[11px] font-black">{engineState.speed} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI PREDICTIVE MAINTENANCE SCANNER */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[9px] uppercase font-black text-indigo-700 tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Machine AI Telematics
              </span>
              <h3 className="text-xs font-black text-slate-900 mt-0.5">Predictive Health Metrics</h3>
              <p className="text-[10px] text-slate-400">Neural analysis of belt wear, acoustic vibration anomalies, and filter debris levels.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1 text-xs font-semibold">
                <div className="flex justify-between text-[10px] pb-1">
                  <span className="text-slate-500">Structural Score:</span>
                  <span className="text-slate-800 font-extrabold">{selectedEquip.aiMaintenanceStatus.healthScore}%</span>
                </div>
                {/* Visual Health Bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      selectedEquip.aiMaintenanceStatus.healthScore >= 90
                        ? "bg-emerald-600"
                        : selectedEquip.aiMaintenanceStatus.healthScore >= 80
                        ? "bg-amber-500"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${selectedEquip.aiMaintenanceStatus.healthScore}%` }}
                  />
                </div>
              </div>

              {/* Failure predictions lists */}
              <div className="space-y-2">
                <span className="block text-[8px] font-bold text-slate-400 uppercase">ML Failure Log Warns</span>
                <div className="space-y-1.5">
                  {selectedEquip.aiMaintenanceStatus.predictedFailures.map((pf, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-100 p-2 rounded text-[8px] text-red-800 flex items-start gap-1 font-semibold leading-normal">
                      <AlertTriangle className="h-3 w-3 text-red-600 shrink-0 mt-0.5" />
                      <span>{pf}</span>
                    </div>
                  ))}

                  {selectedEquip.aiMaintenanceStatus.predictedFailures.length === 0 && (
                    <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded text-[8px] text-emerald-800 flex items-center gap-1.5 font-bold">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                      No mechanical fault detected by AI.
                    </div>
                  )}
                </div>
              </div>

              {/* Real-time Sensor readouts */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 text-[9px] space-y-1.5 font-semibold text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Oil pressure:</span>
                  <span className="text-slate-800">{selectedEquip.aiMaintenanceStatus.sensorReadouts.oilPressure} PSI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Belt Tension:</span>
                  <span className="text-slate-800">{selectedEquip.aiMaintenanceStatus.sensorReadouts.beltTension}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hydraulic Fluid:</span>
                  <span className="text-slate-800">{selectedEquip.aiMaintenanceStatus.sensorReadouts.hydraulicFluid}% capacity</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAiDiagnostic}
                disabled={isDiagnosticScanning}
                className="w-full py-2 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/70 text-indigo-700 text-[10px] font-black rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                {isDiagnosticScanning ? (
                  <>
                    <div className="h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    Scanning Acoustic Waves...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Trigger Predictive Acoustic Diagnosis
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* LOWER GRID: USAGE ANALYTICS & REVIEW SUBMISSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* RECHARTS USAGE ANALYTICS (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-600" />
              Machine Fuel Burn & Usage Analytics
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Real-time charts of diesel burn rate overlaying throttle efficiency across operating hours.</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" fontSize={9} stroke="#64748b" />
                <YAxis fontSize={9} stroke="#64748b" />
                <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Line type="monotone" name="Fuel Burn Rate (L/hr)" dataKey="dieselBurn" stroke="#ef4444" strokeWidth={2.5} activeDot={{ r: 5 }} />
                <Line type="monotone" name="Throttle Efficiency (%)" dataKey="throttleEfficiency" stroke="#10b981" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FEEDBACK & RATINGS CORNER (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-4.5 w-4.5 text-emerald-600" />
              Verified Farmer Reviews
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Post-harvest performance commentary on chosen hardware configurations.</p>
          </div>

          {/* Form */}
          <form onSubmit={handlePostReview} className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase">My Name</label>
                <input
                  type="text"
                  placeholder="Amir P."
                  value={newReviewerName}
                  onChange={(e) => setNewReviewerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-[10px] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase">Rating Score</label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(parseInt(e.target.value) || 5)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-[10px] focus:outline-none font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[8px] font-bold text-slate-400 uppercase">Commentary</label>
              <textarea
                placeholder="Describe engine tilling precision, blade speed..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-[10px] focus:outline-none"
                rows={2}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-[10px] rounded cursor-pointer"
            >
              Post Machine Efficiency Log
            </button>
          </form>

          {/* List reviews */}
          <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1 pt-2 border-t border-slate-100">
            {selectedEquip.reviews.map((rev) => (
              <div key={rev.id} className="bg-slate-50 p-2.5 rounded-lg text-[9px] font-semibold space-y-1">
                <div className="flex justify-between items-center text-[8px]">
                  <span className="text-slate-700 font-extrabold">{rev.user}</span>
                  <span className="text-slate-400">{rev.date}</span>
                </div>
                <div className="flex items-center gap-0.5 text-[8px] text-amber-500 font-bold">
                  {"⭐".repeat(rev.rating)}
                </div>
                <p className="text-slate-600 leading-normal italic font-medium">"{rev.comment}"</p>
              </div>
            ))}

            {selectedEquip.reviews.length === 0 && (
              <div className="text-center py-4 text-[9px] italic text-slate-400">
                No verified reviews logged yet. Be the first to review this unit!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
