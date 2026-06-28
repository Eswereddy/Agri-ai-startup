import React, { useState, useEffect } from "react";
import {
  Sprout,
  Activity,
  Droplets,
  Thermometer,
  Wind,
  Plus,
  Compass,
  Sparkles,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  BrainCircuit,
  Search,
  Layers,
  MapPin,
  Database,
  Waves,
  Calendar,
  DollarSign,
  Trash2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  TrendingDown,
  RefreshCw,
  Info,
  FlaskConical,
  Camera,
  ShieldAlert,
  Globe,
  Coins,
  ShoppingBag,
  Wrench,
  CloudSun,
  Building2,
  Truck,
  Plane
} from "lucide-react";
import { TelemetryReading, CropDiagnostic } from "../../types";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { SmartMarketplace } from "../marketplace/SmartMarketplace";
import { CropSellingMarketplace } from "../marketplace/CropSellingMarketplace";
import { EquipmentRentalSystem } from "../equipment/EquipmentRentalSystem";
import { GovernmentIntegration } from "../government/GovernmentIntegration";
import { WeatherIntelligence } from "../weather/WeatherIntelligence";
import { YieldPricePrediction } from "../analytics/YieldPricePrediction";
import { WarehouseStorage } from "../warehouse/WarehouseStorage";
import { LogisticsModule } from "../logistics/LogisticsModule";
import { FinancialServices } from "../finance/FinancialServices";
import DroneMonitoringSystem from "../DroneMonitoringSystem";
import IoTSensorIntegration from "../IoTSensorIntegration";

// ============================================================================
// DATA STRUCTURES & PRESEEDS (Startup Mock Data)
// ============================================================================

interface Sector {
  id: string;
  name: string;
  cropName: string;
  cropVariety: string;
  moisture: number;
  temp: number;
  valveStatus: "Open" | "Closed";
  healthStatus: "Optimal" | "Warning" | "Critical";
  area: number;
}

interface FarmLocation {
  id: string;
  name: string;
  role: string;
  location: string;
  totalAcreage: number;
  soilType: string;
  organicMatter: number;
  waterSource: string;
  irrigationType: string;
  healthScore: number;
  baselineTelemetry: {
    soilMoisture: number;
    soilPh: number;
    temperature: number;
    humidity: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  sectors: Sector[];
}

const INITIAL_FARMS: FarmLocation[] = [
  {
    id: "farm-1",
    name: "Punjab Emerald Plains (North)",
    role: "Landowner / Operator",
    location: "Ludhiana Sector 4, Punjab",
    totalAcreage: 32.5,
    soilType: "Clay Loam (High Organic Carbon)",
    organicMatter: 3.4,
    waterSource: "Solar Borewell & Canal Ingress",
    irrigationType: "Precision Drip Solenoid Arrays",
    healthScore: 88,
    baselineTelemetry: {
      soilMoisture: 48,
      soilPh: 6.4,
      temperature: 28.5,
      humidity: 62,
      nitrogen: 85,
      phosphorus: 42,
      potassium: 110
    },
    sectors: [
      { id: "sec-11", name: "Sector A1 - Paddy Delta", cropName: "Rice Paddy", cropVariety: "Pusa Basmati 1121", moisture: 54, temp: 28, valveStatus: "Closed", healthStatus: "Optimal", area: 12 },
      { id: "sec-12", name: "Sector A2 - Garden Lot", cropName: "Tomato", cropVariety: "Arka Rakshak F1", moisture: 32, temp: 29, valveStatus: "Closed", healthStatus: "Warning", area: 6.5 },
      { id: "sec-13", name: "Sector B1 - Organic Acres", cropName: "Maize", cropVariety: "DeKalb Double-X", moisture: 42, temp: 27, valveStatus: "Open", healthStatus: "Optimal", area: 8 },
      { id: "sec-14", name: "Sector B2 - High-Ridge", cropName: "Wheat", cropVariety: "HD-2967 Amber", moisture: 38, temp: 26, valveStatus: "Closed", healthStatus: "Optimal", area: 6 }
    ]
  },
  {
    id: "farm-2",
    name: "Himalayan Terraces (Orchard)",
    role: "Tenant Partner",
    location: "Solan Valley Block B, Himachal",
    totalAcreage: 12.8,
    soilType: "Sandy Gravelly Loam (High-drainage)",
    organicMatter: 5.1,
    waterSource: "Mountain Spring Siphon System",
    irrigationType: "Micro-sprinklers & Canopy Drip",
    healthScore: 94,
    baselineTelemetry: {
      soilMoisture: 62,
      soilPh: 5.8,
      temperature: 19.2,
      humidity: 78,
      nitrogen: 55,
      phosphorus: 68,
      potassium: 92
    },
    sectors: [
      { id: "sec-21", name: "Terrace Upper - Coffee Block", cropName: "Coffee", cropVariety: "Arabica Typica Spec", moisture: 65, temp: 19, valveStatus: "Open", healthStatus: "Optimal", area: 5 },
      { id: "sec-22", name: "Terrace Mid - Soybeans", cropName: "Soybean", cropVariety: "JS 335 Organic", moisture: 58, temp: 20, valveStatus: "Closed", healthStatus: "Optimal", area: 4.8 },
      { id: "sec-23", name: "Terrace Lower - Root Crop", cropName: "Potato", cropVariety: "Kufri Jyoti Seeds", moisture: 48, temp: 18, valveStatus: "Closed", healthStatus: "Optimal", area: 3 }
    ]
  },
  {
    id: "farm-3",
    name: "Deccan Cotton Belt (Plot 4)",
    role: "Cooperative Landlord",
    location: "Amravati East, Maharashtra",
    totalAcreage: 48.0,
    soilType: "Black Cotton Soil (Regur Clay)",
    organicMatter: 1.8,
    waterSource: "River Diversion & In-ground Pond",
    irrigationType: "Sub-surface Gate Valves",
    healthScore: 71,
    baselineTelemetry: {
      soilMoisture: 32,
      soilPh: 7.6,
      temperature: 33.4,
      humidity: 45,
      nitrogen: 42,
      phosphorus: 25,
      potassium: 88
    },
    sectors: [
      { id: "sec-31", name: "Zone 1 - Wheat Fields", cropName: "Wheat", cropVariety: "GW-322 Lokwan", moisture: 35, temp: 33, valveStatus: "Closed", healthStatus: "Optimal", area: 18 },
      { id: "sec-32", name: "Zone 2 - Slopes (Dry)", cropName: "Soybean", cropVariety: "MACS 1407 Resistant", moisture: 22, temp: 35, valveStatus: "Closed", healthStatus: "Critical", area: 15 },
      { id: "sec-33", name: "Zone 3 - Low Canal Influx", cropName: "Maize", cropVariety: "Pioneer Hybrid", moisture: 28, temp: 34, valveStatus: "Open", healthStatus: "Warning", area: 15 }
    ]
  }
];

interface ActiveCrop {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  acreage: number;
  sowingDate: string;
  harvestDate: string;
  stage: "Sowing" | "Germination" | "Vegetative" | "Flowering" | "Yielding" | "Mature";
  projectedYield: number; // tons/acre
}

const INITIAL_CROPS: ActiveCrop[] = [
  { id: "crop-1", farmId: "farm-1", name: "Rice Paddy", variety: "Pusa Basmati 1121", acreage: 12, sowingDate: "2026-05-10", harvestDate: "2026-10-15", stage: "Vegetative", projectedYield: 2.2 },
  { id: "crop-2", farmId: "farm-1", name: "Tomato", variety: "Arka Rakshak F1", acreage: 6.5, sowingDate: "2026-06-01", harvestDate: "2026-09-10", stage: "Flowering", projectedYield: 8.5 },
  { id: "crop-3", farmId: "farm-1", name: "Maize", variety: "DeKalb Double-X", acreage: 8, sowingDate: "2026-06-15", harvestDate: "2026-11-01", stage: "Germination", projectedYield: 3.8 },
  { id: "crop-4", farmId: "farm-2", name: "Coffee", variety: "Arabica Typica Spec", acreage: 5, sowingDate: "2024-03-20", harvestDate: "2026-12-05", stage: "Yielding", projectedYield: 0.9 },
  { id: "crop-5", farmId: "farm-3", name: "Wheat", variety: "GW-322 Lokwan", acreage: 18, sowingDate: "2025-11-15", harvestDate: "2026-04-20", stage: "Mature", projectedYield: 1.8 }
];

const STAGES: ActiveCrop["stage"][] = ["Sowing", "Germination", "Vegetative", "Flowering", "Yielding", "Mature"];

interface FarmExpense {
  id: string;
  farmId: string;
  cropName: string;
  category: "Seeds" | "Fertilizers" | "Water & Irrigation" | "Labor & Work" | "Fuel & Power" | "Rent & Services";
  amount: number;
  description: string;
  date: string;
}

const INITIAL_EXPENSES: FarmExpense[] = [
  { id: "exp-1", farmId: "farm-1", cropName: "Rice Paddy", category: "Seeds", amount: 1250, description: "Certified Pusa Basmati seed stock", date: "2026-05-08" },
  { id: "exp-2", farmId: "farm-1", cropName: "Tomato", category: "Fertilizers", amount: 800, description: "Water-soluble organic potash nutrient packs", date: "2026-06-12" },
  { id: "exp-3", farmId: "farm-1", cropName: "General", category: "Fuel & Power", amount: 550, description: "Solar pump inverter maintenance & battery power grid", date: "2026-06-20" },
  { id: "exp-4", farmId: "farm-2", cropName: "Coffee", category: "Labor & Work", amount: 1800, description: "Pruning & terrace stone reinforcement labor", date: "2026-05-25" },
  { id: "exp-5", farmId: "farm-3", cropName: "Wheat", category: "Water & Irrigation", amount: 1100, description: "Canal canalization cleaning levy and gate valves", date: "2026-05-02" }
];

interface FarmTask {
  id: string;
  farmId: string;
  title: string;
  category: "Irrigation" | "Fertilization" | "Harvesting" | "Diagnostics" | "Maintenance";
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  isCompleted: boolean;
}

const INITIAL_TASKS: FarmTask[] = [
  { id: "task-1", farmId: "farm-1", title: "Apply bio-potash mix to tomato patch", category: "Fertilization", priority: "High", dueDate: "2026-06-29", isCompleted: false },
  { id: "task-2", farmId: "farm-1", title: "Inspect early blight reports in Block A2", category: "Diagnostics", priority: "High", dueDate: "2026-06-30", isCompleted: false },
  { id: "task-3", farmId: "farm-1", title: "Recalibrate pressure meters on sol-valves 3 & 4", category: "Maintenance", priority: "Medium", dueDate: "2026-07-02", isCompleted: true },
  { id: "task-4", farmId: "farm-2", title: "Monitor spring water flow level indicators", category: "Irrigation", priority: "High", dueDate: "2026-06-29", isCompleted: false },
  { id: "task-5", farmId: "farm-3", title: "Plan rotation matrix following wheat harvest", category: "Harvesting", priority: "Low", dueDate: "2026-07-10", isCompleted: false }
];

interface FarmerViewProps {
  telemetry: TelemetryReading;
  diagnostics: CropDiagnostic[];
  onAddDiagnostic: (newDiag: CropDiagnostic) => void;
  onUpdateDiagnostic: (id: string, updated: Partial<CropDiagnostic>) => void;
}

export default function FarmerView({
  telemetry,
  diagnostics,
  onAddDiagnostic,
  onUpdateDiagnostic
}: FarmerViewProps) {
  // Tabs: ecosystem | crops | profile | finances | tasks | pathologist
  const [activeTab, setActiveTab] = useState<string>("ecosystem");
  const [marketSubTab, setMarketSubTab] = useState<"inputs" | "crops">("crops");
  const [selectedFarmId, setSelectedFarmId] = useState<string>("farm-1");

  // State Management
  const [farms, setFarms] = useState<FarmLocation[]>(INITIAL_FARMS);
  const [cropsList, setCropsList] = useState<ActiveCrop[]>(INITIAL_CROPS);
  const [expensesList, setExpensesList] = useState<FarmExpense[]>(INITIAL_EXPENSES);
  const [tasksList, setTasksList] = useState<FarmTask[]>(INITIAL_TASKS);

  // Active farm focus derived
  const activeFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];
  const [selectedSectorId, setSelectedSectorId] = useState<string>("");

  // Sync selected sector when farm changes
  useEffect(() => {
    if (activeFarm && activeFarm.sectors.length > 0) {
      setSelectedSectorId(activeFarm.sectors[0].id);
    }
  }, [selectedFarmId]);

  const activeSector = activeFarm.sectors.find((s) => s.id === selectedSectorId) || activeFarm.sectors[0];

  // Forms states
  const [sowForm, setSowForm] = useState({ name: "Tomato", variety: "Pusa Ruby", acreage: 4, yield: 6.2 });
  const [expenseForm, setExpenseForm] = useState({ cropName: "Tomato", category: "Seeds" as FarmExpense["category"], amount: 350, description: "Seed packets", date: new Date().toISOString().split("T")[0] });
  const [taskForm, setTaskForm] = useState({ title: "", category: "Irrigation" as FarmTask["category"], priority: "Medium" as FarmTask["priority"], dueDate: new Date().toISOString().split("T")[0] });

  // Gemini Pathologist disease states
  const [cropName, setCropName] = useState("Tomato");
  const [symptoms, setSymptoms] = useState("Lower leaves have dark concentric rings like target spots. Stems have black lesions.");
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [activeDiagResult, setActiveDiagResult] = useState<any>(null);
  const [diseaseImageBase64, setDiseaseImageBase64] = useState<string | null>(null);
  const [diseaseImageMime, setDiseaseImageMime] = useState<string | null>(null);
  const [diseaseImageName, setDiseaseImageName] = useState<string>("");
  const [aiModel, setAiModel] = useState<string>("ResNet-50 Disease Classifier");
  const [pathologyLanguage, setPathologyLanguage] = useState<"english" | "spanish" | "hindi" | "swahili">("english");

  // Gemini Soil suit planner states
  const [plannerRegion, setPlannerRegion] = useState("Semiarid Hardpan");
  const [plannerPh, setPlannerPh] = useState(6.5);
  const [plannerMoisture, setPlannerMoisture] = useState(42);
  const [plannerN, setPlannerN] = useState(65);
  const [plannerP, setPlannerP] = useState(45);
  const [plannerK, setPlannerK] = useState(70);
  const [plannerSoilType, setPlannerSoilType] = useState("Loamy");
  const [plannerTemperature, setPlannerTemperature] = useState(28);
  const [plannerRainfall, setPlannerRainfall] = useState(850);
  const [plannerWaterAvailability, setPlannerWaterAvailability] = useState("Canal & Rainfed");
  const [plannerSeason, setPlannerSeason] = useState("Kharif");
  const [plannerHistoricalData, setPlannerHistoricalData] = useState("Previously grew legumes; soil has moderate organic matter and good aeration.");
  const [isPlanning, setIsPlanning] = useState(false);
  const [plannedCrops, setPlannedCrops] = useState<any[]>([]);
  const [expandedCropIndex, setExpandedCropIndex] = useState<number | null>(0);

  // Gemini Soil Lab states
  const [soilReportBase64, setSoilReportBase64] = useState<string | null>(null);
  const [soilReportMime, setSoilReportMime] = useState<string | null>(null);
  const [soilReportName, setSoilReportName] = useState<string>("");
  const [soilImageBase64, setSoilImageBase64] = useState<string | null>(null);
  const [soilImageMime, setSoilImageMime] = useState<string | null>(null);
  const [soilImageName, setSoilImageName] = useState<string>("");
  const [manualSoilType, setManualSoilType] = useState<string>("Loamy");
  const [manualPh, setManualPh] = useState<number>(6.5);
  const [manualLocation, setManualLocation] = useState<string>("Southern Delta Zone");
  const [isAnalyzingSoil, setIsAnalyzingSoil] = useState<boolean>(false);
  const [activeHorizon, setActiveHorizon] = useState<string>("O");
  const [soilAnalysisResult, setSoilAnalysisResult] = useState<any | null>(null);

  // Simulation flags
  const [simulationMsg, setSimulationMsg] = useState<string>("");

  // Merge external live simulation telemetry with local baseline
  const mergedTelemetry = {
    ...telemetry,
    soilMoisture: activeSector ? activeSector.moisture : activeFarm.baselineTelemetry.soilMoisture,
    soilPh: activeFarm.baselineTelemetry.soilPh,
    temperature: activeSector ? activeSector.temp : activeFarm.baselineTelemetry.temperature,
    humidity: activeFarm.baselineTelemetry.humidity,
    nitrogen: activeFarm.baselineTelemetry.nitrogen,
    phosphorus: activeFarm.baselineTelemetry.phosphorus,
    potassium: activeFarm.baselineTelemetry.potassium
  };

  // Switch farm cleanly
  const handleFarmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFarmId(e.target.value);
  };

  // Toggle water valve in local digital twin simulator
  const handleToggleValve = (sectorId: string) => {
    setFarms((prev) =>
      prev.map((f) => {
        if (f.id === selectedFarmId) {
          const updatedSectors = f.sectors.map((sec) => {
            if (sec.id === sectorId) {
              const open = sec.valveStatus === "Closed";
              const finalMoisture = open ? Math.min(sec.moisture + 15, 95) : Math.max(sec.moisture - 8, 15);
              return {
                ...sec,
                valveStatus: open ? "Open" : "Closed" as any,
                moisture: finalMoisture,
                healthStatus: finalMoisture > 30 && finalMoisture < 80 ? "Optimal" : ("Warning" as any)
              };
            }
            return sec;
          });
          return { ...f, sectors: updatedSectors };
        }
        return f;
      })
    );
    setSimulationMsg("Solenoid valve command dispatched. Moisture levels updating...");
    setTimeout(() => setSimulationMsg(""), 3500);
  };

  // Flush irrigate the entire farm
  const handleIrrigateAll = () => {
    setFarms((prev) =>
      prev.map((f) => {
        if (f.id === selectedFarmId) {
          const updatedSectors = f.sectors.map((sec) => ({
            ...sec,
            moisture: Math.min(sec.moisture + 10, 85),
            valveStatus: "Open" as any,
            healthStatus: "Optimal" as any
          }));
          return { ...f, sectors: updatedSectors };
        }
        return f;
      })
    );
    setSimulationMsg("Emergency irrigation flush activated across all sectors!");
    setTimeout(() => setSimulationMsg(""), 4000);
  };

  // Advanced stage of crop in simulation
  const handleAdvanceStage = (cropId: string) => {
    setCropsList((prev) =>
      prev.map((crop) => {
        if (crop.id === cropId) {
          const currentIndex = STAGES.indexOf(crop.stage);
          const nextIndex = (currentIndex + 1) % STAGES.length;
          return { ...crop, stage: STAGES[nextIndex] };
        }
        return crop;
      })
    );
  };

  // Plant/Sow a new crop
  const handleSowCrop = (e: React.FormEvent) => {
    e.preventDefault();
    const newCrop: ActiveCrop = {
      id: `crop-${Date.now()}`,
      farmId: selectedFarmId,
      name: sowForm.name,
      variety: sowForm.variety,
      acreage: sowForm.acreage,
      sowingDate: new Date().toISOString().split("T")[0],
      harvestDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      stage: "Sowing",
      projectedYield: sowForm.yield
    };
    setCropsList((prev) => [newCrop, ...prev]);
    setSowForm({ name: "Tomato", variety: "Pusa Ruby", acreage: 4, yield: 6.2 });

    // Also update digital twin mapping if possible by replacing fallow sectors
    setSimulationMsg(`Sowed ${sowForm.name} variety in ${selectedFarmId} database ledger!`);
    setTimeout(() => setSimulationMsg(""), 3000);
  };

  // Log expense
  const handleLogExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp: FarmExpense = {
      id: `exp-${Date.now()}`,
      farmId: selectedFarmId,
      cropName: expenseForm.cropName,
      category: expenseForm.category,
      amount: expenseForm.amount,
      description: expenseForm.description,
      date: expenseForm.date
    };
    setExpensesList((prev) => [newExp, ...prev]);
    setExpenseForm({ cropName: "Tomato", category: "Fertilizers", amount: 150, description: "", date: new Date().toISOString().split("T")[0] });
  };

  // Delete transaction
  const handleDeleteExpense = (id: string) => {
    setExpensesList((prev) => prev.filter((exp) => exp.id !== id));
  };

  // Add chore
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    const newTask: FarmTask = {
      id: `task-${Date.now()}`,
      farmId: selectedFarmId,
      title: taskForm.title,
      category: taskForm.category,
      priority: taskForm.priority,
      dueDate: taskForm.dueDate,
      isCompleted: false
    };
    setTasksList((prev) => [newTask, ...prev]);
    setTaskForm({ title: "", category: "Irrigation", priority: "Medium", dueDate: new Date().toISOString().split("T")[0] });
  };

  // Toggle chore complete
  const toggleTaskComplete = (id: string) => {
    setTasksList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  // Delete chore
  const handleDeleteTask = (id: string) => {
    setTasksList((prev) => prev.filter((t) => t.id !== id));
  };

  // Run AI plant diagnosis
  const handleDiseaseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDiseaseImageName(file.name);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const commaIdx = base64String.indexOf(",");
      if (commaIdx !== -1) {
        setDiseaseImageBase64(base64String.substring(commaIdx + 1));
        setDiseaseImageMime(file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSampleDisease = () => {
    setCropName("Tomato");
    setSymptoms("Lower foliage shows dark concentric spot patterns matching early blight signs. Leaves are yellowing and wilted.");
    setDiseaseImageName("tomato_early_blight_lesion.jpeg");
    // mini 1x1 valid-ish jpeg base64
    setDiseaseImageBase64("/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=");
    setDiseaseImageMime("image/jpeg");
    setAiModel("ResNet-50 Disease Classifier");
  };

  const handleDiagnose = async () => {
    if (!symptoms.trim() && !diseaseImageBase64) {
      alert("Please enter symptoms description or upload a plant image.");
      return;
    }
    setIsDiagnosing(true);
    setActiveDiagResult(null);
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName,
          symptoms,
          diseaseImageBase64,
          diseaseImageMime,
          aiModel
        })
      });
      const data = await response.json();
      if (response.ok && data.diseaseName) {
        setActiveDiagResult(data);
        const newRecord: CropDiagnostic = {
          id: `diag-${Date.now()}`,
          cropName,
          symptoms: symptoms || "Camera physical leaves scanner run",
          status: "AI Diagnosed",
          aiDiagnosis: data.diseaseName,
          treatment: `Chemical: ${data.treatments?.chemicalPesticide || "N/A"}. Organic: ${data.treatments?.organicTreatment || "N/A"}`,
          confidence: data.confidenceScore || 95,
          date: new Date().toLocaleDateString()
        };
        onAddDiagnostic(newRecord);
      } else {
        alert(data.error || "Pathological models busy. Standardizing diagnostic sequence.");
      }
    } catch (err) {
      console.error(err);
      alert("Pathology server connection timed out.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Run AI soil rotation planning
  const handleGeneratePlan = async () => {
    setIsPlanning(true);
    setPlannedCrops([]);
    try {
      const response = await fetch("/api/crop-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soilType: plannerSoilType,
          temperature: plannerTemperature,
          rainfall: plannerRainfall,
          soilPh: plannerPh,
          waterAvailability: plannerWaterAvailability,
          season: plannerSeason,
          historicalData: plannerHistoricalData,
          soilMoisture: plannerMoisture,
          nitrogen: plannerN,
          phosphorus: plannerP,
          potassium: plannerK,
          region: plannerRegion
        })
      });
      const data = await response.json();
      if (response.ok && data.recommendedCrops) {
        setPlannedCrops(data.recommendedCrops);
      } else {
        alert(data.error || "Failed to calculate suitability metrics. Please check parameters.");
      }
    } catch (err) {
      console.error(err);
      alert("Error reaching agronomist suite.");
    } finally {
      setIsPlanning(false);
    }
  };

  // Run AI soil analysis
  const handleSoilReportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSoilReportName(file.name);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const commaIdx = base64String.indexOf(",");
      if (commaIdx !== -1) {
        setSoilReportBase64(base64String.substring(commaIdx + 1));
        setSoilReportMime(file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSoilImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSoilImageName(file.name);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const commaIdx = base64String.indexOf(",");
      if (commaIdx !== -1) {
        setSoilImageBase64(base64String.substring(commaIdx + 1));
        setSoilImageMime(file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeSoil = async () => {
    setIsAnalyzingSoil(true);
    try {
      const response = await fetch("/api/analyze-soil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soilReportBase64,
          soilReportMime,
          soilImageBase64,
          soilImageMime,
          soilTypeManual: manualSoilType,
          phManual: manualPh,
          location: manualLocation
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSoilAnalysisResult(data);
        setActiveHorizon("O");
      } else {
        alert(data.error || "Soil diagnostic systems busy. Re-routing analysis stream.");
      }
    } catch (err) {
      console.error(err);
      alert("Soil analysis server offline or timed out.");
    } finally {
      setIsAnalyzingSoil(false);
    }
  };

  const handleLoadSampleSoil = () => {
    setManualSoilType("Clay Loam");
    setManualPh(5.9);
    setManualLocation("Indo-Gangetic Alluvial Plain");
    setSoilReportName("sample_lab_report_alluvial.pdf");
    setSoilImageName("topsoil_sample_loam.jpeg");
    // Simple mock base64 to satisfy server presence if we want, or send clean parameters
    setSoilReportBase64("JVBERi0xLjQKJbXtrvM="); // mini valid-ish dummy pdf header base64
    setSoilReportMime("application/pdf");
    setSoilImageBase64("/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="); // mini 1x1 jpeg
    setSoilImageMime("image/jpeg");
  };

  // Calculate dynamic statistics based on states
  const activeCrops = cropsList.filter((c) => c.farmId === selectedFarmId);
  const activeExpenses = expensesList.filter((e) => e.farmId === selectedFarmId);
  const activeTasks = tasksList.filter((t) => t.farmId === selectedFarmId);

  const totalRevenueMock = activeFarm.id === "farm-1" ? 42500 : activeFarm.id === "farm-2" ? 18900 : 31200;
  const totalExpenses = activeExpenses.reduce((sum, item) => sum + item.amount, 0);
  const netProfit = totalRevenueMock - totalExpenses;
  const marginPercentage = totalRevenueMock > 0 ? Math.round((netProfit / totalRevenueMock) * 100) : 0;

  // Pie chart simulator percentages for expenses categories
  const categoryCosts = { Seeds: 0, Fertilizers: 0, "Water & Irrigation": 0, "Labor & Work": 0, "Fuel & Power": 0, "Rent & Services": 0 };
  activeExpenses.forEach((exp) => {
    if (categoryCosts[exp.category] !== undefined) {
      categoryCosts[exp.category] += exp.amount;
    }
  });

  return (
    <div id="farmer-startup-workspace" className="space-y-6">
      {/* Dynamic Header & Switcher Row */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              Autonomous Farm Hub
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Active Twin
              </span>
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Enterprise management suite with micro-climate telemetry, real-time financials, and Gemini agronomy engines.
            </p>
          </div>
        </div>

        {/* Multi-farm Switcher Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl w-full md:w-auto">
          <MapPin className="h-4 w-4 text-emerald-600 shrink-0 ml-1" />
          <div className="flex-1">
            <label className="block text-[9px] uppercase font-bold text-slate-400">Current Holding</label>
            <select
              value={selectedFarmId}
              onChange={handleFarmChange}
              className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none pr-6 cursor-pointer"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Simulator message banner */}
      {simulationMsg && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2 animate-bounce">
          <RefreshCw className="h-4 w-4 text-indigo-600 animate-spin" />
          <span>{simulationMsg}</span>
        </div>
      )}

      {/* Primary Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-px scrollbar-none">
        {[
          { id: "ecosystem", label: "Ecosystem Hub", icon: Compass },
          { id: "iot", label: "IoT Sensors", icon: Activity },
          { id: "drones", label: "Drone Monitoring", icon: Plane },
          { id: "crops", label: "Crop Manager", icon: Sprout },
          { id: "soil", label: "Soil Analysis Lab", icon: FlaskConical },
          { id: "profile", label: "Land & Assets", icon: Layers },
          { id: "finances", label: "Ledger (P&L)", icon: DollarSign },
          { id: "fin_services", label: "Financial Services", icon: Coins },
          { id: "tasks", label: "Chore Calendar", icon: Calendar },
          { id: "pathologist", label: "AI Pathologist", icon: BrainCircuit },
          { id: "marketplace", label: "Smart Marketplace", icon: ShoppingBag },
          { id: "rentals", label: "Equipment Rental", icon: Wrench },
          { id: "government", label: "Sovereign Schemes", icon: Globe },
          { id: "weather", label: "Weather Intel", icon: CloudSun },
          { id: "predictions", label: "AI Forecasts", icon: TrendingUp },
          { id: "warehouse", label: "Cold Storage", icon: Building2 },
          { id: "logistics", label: "Smart Logistics", icon: Truck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 border-t border-x cursor-pointer ${
                isSelected
                  ? "bg-white text-emerald-700 border-slate-200 border-b-white -mb-px shadow-xs"
                  : "bg-transparent text-slate-500 border-transparent hover:text-slate-800"
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? "text-emerald-600" : "text-slate-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ============================================================================
          TAB 1: ECOSYSTEM HUB (Digital Twin Map, Sensors, Health Index)
          ============================================================================ */}
      {activeTab === "ecosystem" && (
        <div className="space-y-6">
          {/* Top Row: Health Score Radial & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Real-time Health Index Gauge */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Farm Health Index</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded">
                    Real-time
                  </span>
                </h3>
                <p className="text-slate-400 text-[10px] mt-0.5">Algorithmic index calculated from sensor nodes.</p>
              </div>

              {/* Radial Score Gauge */}
              <div className="flex flex-col items-center justify-center my-4 relative">
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke={activeFarm.healthScore > 85 ? "#059669" : activeFarm.healthScore > 75 ? "#d97706" : "#dc2626"}
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * activeFarm.healthScore) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{activeFarm.healthScore}</span>
                  <span className="text-xs text-slate-400 font-bold block">/ 100</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] border-t border-slate-100 pt-2 font-medium">
                  <span className="text-slate-500">Node Connectivity</span>
                  <span className="text-emerald-600 font-bold">100% Operational</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-medium">
                  <span className="text-slate-500">Active Stressors</span>
                  <span className={`${activeFarm.healthScore > 85 ? "text-slate-500" : "text-amber-600 font-bold"}`}>
                    {activeFarm.healthScore > 85 ? "None Detected" : "1 Stressor Alert"}
                  </span>
                </div>
              </div>
            </div>

            {/* Micro-climate Live Dashboard Telemetry */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-4.5 w-4.5 text-emerald-600" />
                  Live Sensor Array: {activeSector ? activeSector.name : "Holding Core"}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">Updated 3 mins ago</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Gauge 1 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                    <Droplets className="h-3.5 w-3.5 text-emerald-600" />
                    Moisture
                  </div>
                  <p className="text-2xl font-black text-slate-800 mt-2">{mergedTelemetry.soilMoisture}%</p>
                  <p className="text-[9px] text-slate-400 mt-1">Optimal Range: 40-70%</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" style={{ width: `${mergedTelemetry.soilMoisture}%` }} />
                </div>

                {/* Gauge 2 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                    <Thermometer className="h-3.5 w-3.5 text-rose-500" />
                    Temp
                  </div>
                  <p className="text-2xl font-black text-slate-800 mt-2">{mergedTelemetry.temperature}°C</p>
                  <p className="text-[9px] text-slate-400 mt-1">Optimal Range: 18-32°C</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" style={{ width: `${Math.min((mergedTelemetry.temperature / 45) * 100, 100)}%` }} />
                </div>

                {/* Gauge 3 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                    <Wind className="h-3.5 w-3.5 text-sky-500" />
                    Air Humidity
                  </div>
                  <p className="text-2xl font-black text-slate-800 mt-2">{mergedTelemetry.humidity}%</p>
                  <p className="text-[9px] text-slate-400 mt-1">Transpiration balance</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500" style={{ width: `${mergedTelemetry.humidity}%` }} />
                </div>

                {/* Gauge 4 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                    <Compass className="h-3.5 w-3.5 text-amber-500" />
                    Soil pH
                  </div>
                  <p className="text-2xl font-black text-slate-800 mt-2">{mergedTelemetry.soilPh}</p>
                  <p className="text-[9px] text-slate-400 mt-1">Slightly acidic balance</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" style={{ width: `${(mergedTelemetry.soilPh / 14) * 100}%` }} />
                </div>
              </div>

              {/* Soil Nutrient Matrix breakdown */}
              <div className="mt-4 bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="h-4 w-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">NPK Soil Composition</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                      <span>Nitrogen (N)</span>
                      <span className="font-bold text-slate-800">{mergedTelemetry.nitrogen} mg/kg</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min((mergedTelemetry.nitrogen / 120) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                      <span>Phosphorus (P)</span>
                      <span className="font-bold text-slate-800">{mergedTelemetry.phosphorus} mg/kg</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min((mergedTelemetry.phosphorus / 120) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                      <span>Potassium (K)</span>
                      <span className="font-bold text-slate-800">{mergedTelemetry.potassium} mg/kg</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min((mergedTelemetry.potassium / 150) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Digital Twin 2.5D Farm Map Section */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-4.5 w-4.5 text-teal-600" />
                  Digital Twin Map (Active Isometric Sectors)
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">Click any sector grid box to load localization telemetry and toggle irrigation solenoid valves.</p>
              </div>

              <button
                onClick={handleIrrigateAll}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Waves className="h-3.5 w-3.5" />
                Flush Irrigation Overrides
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Grid map (Left) */}
              <div className="lg:col-span-8 bg-slate-50 border border-slate-250 p-4 rounded-xl flex items-center justify-center min-h-[260px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-2 pointer-events-none" style={{ backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

                <div className="grid grid-cols-2 gap-4 w-full max-w-lg relative z-10">
                  {activeFarm.sectors.map((sec) => {
                    const isSelected = sec.id === selectedSectorId;
                    const isIrrigating = sec.valveStatus === "Open";
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setSelectedSectorId(sec.id)}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between min-h-[110px] ${
                          isSelected
                            ? "bg-white border-emerald-600 shadow-md ring-2 ring-emerald-600/10"
                            : "bg-white border-slate-200 hover:border-slate-350 shadow-xs"
                        }`}
                      >
                        {/* Status bar top */}
                        <div className="flex justify-between items-start w-full">
                          <span className="font-extrabold text-[10px] text-slate-500 uppercase tracking-wide">{sec.name}</span>
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              sec.healthStatus === "Optimal"
                                ? "bg-emerald-500"
                                : sec.healthStatus === "Warning"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                        </div>

                        {/* Mid crop info */}
                        <div className="my-2">
                          <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                            <Sprout className="h-3.5 w-3.5 text-emerald-600" />
                            {sec.cropName}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{sec.cropVariety}</p>
                        </div>

                        {/* Bottom stats with pulsing blue water wave if irrigating */}
                        <div className="flex justify-between items-center w-full text-[10px] text-slate-500 pt-1.5 border-t border-slate-100">
                          <span>Moist: <strong className="text-slate-800">{sec.moisture}%</strong></span>
                          <span className="flex items-center gap-1 font-bold">
                            {isIrrigating ? (
                              <>
                                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-ping" />
                                <span className="text-sky-600 uppercase text-[9px]">Watering</span>
                              </>
                            ) : (
                              <span className="text-slate-400 text-[9px] uppercase">Dry</span>
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sector Controller panel (Right) */}
              <div className="lg:col-span-4 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between min-h-[260px]">
                {activeSector ? (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                        <span className="text-xs font-bold text-slate-800">{activeSector.name}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                          activeSector.healthStatus === "Optimal"
                            ? "bg-emerald-100 text-emerald-800"
                            : activeSector.healthStatus === "Warning"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}>
                          {activeSector.healthStatus}
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>Sown Crop:</span>
                          <span className="font-bold text-slate-800">{activeSector.cropName} ({activeSector.area} Ac)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Moisture Level:</span>
                          <span className="font-bold text-slate-800">{activeSector.moisture}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sector Temp:</span>
                          <span className="font-bold text-slate-800">{activeSector.temp}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Solenoid Signal:</span>
                          <span className={`font-bold uppercase ${activeSector.valveStatus === "Open" ? "text-sky-600" : "text-slate-500"}`}>
                            {activeSector.valveStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Solenoid Control Valve</p>
                      <button
                        onClick={() => handleToggleValve(activeSector.id)}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          activeSector.valveStatus === "Open"
                            ? "bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/10"
                            : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                        }`}
                      >
                        <Waves className="h-3.5 w-3.5" />
                        {activeSector.valveStatus === "Open" ? "Close Solenoid Valve" : "Open Solenoid Valve"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Layers className="h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-500">Select sector mapping to activate node.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "drones" && (
        <DroneMonitoringSystem />
      )}

      {activeTab === "iot" && (
        <IoTSensorIntegration />
      )}

      {/* ============================================================================
          TAB 2: CROP MANAGER (Active Crops, Linear Steppers, Crop History, AI Soil Planner)
          ============================================================================ */}
      {activeTab === "crops" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Active Crops growth stage monitoring (Left) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs space-y-5">
              <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <Sprout className="h-4.5 w-4.5 text-emerald-600" />
                Active Crop Sowing Ledger
              </h3>

              {activeCrops.length > 0 ? (
                <div className="space-y-5">
                  {activeCrops.map((crop) => (
                    <div key={crop.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3 shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {crop.name}
                            <span className="text-[10px] text-slate-400 font-medium">({crop.variety})</span>
                          </h4>
                          <p className="text-slate-500 text-[10px] mt-0.5">
                            Acreage: <strong>{crop.acreage} Acres</strong> | Est. Yield: <strong>{crop.projectedYield} tons/Ac</strong>
                          </p>
                        </div>

                        <button
                          onClick={() => handleAdvanceStage(crop.id)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                        >
                          Advance Growth Stage
                        </button>
                      </div>

                      {/* Growth stepper progress bar */}
                      <div className="pt-2">
                        <div className="relative flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                          {STAGES.map((stg, sIdx) => {
                            const isPastOrCurrent = STAGES.indexOf(crop.stage) >= sIdx;
                            return (
                              <span
                                key={stg}
                                className={isPastOrCurrent ? "text-emerald-700 font-extrabold" : "text-slate-300"}
                              >
                                {stg}
                              </span>
                            );
                          })}
                        </div>
                        {/* Real-time bar */}
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${((STAGES.indexOf(crop.stage) + 1) / STAGES.length) * 100}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Yield analytics dates info */}
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase pt-1 border-t border-slate-100">
                        <span>Sown: {crop.sowingDate}</span>
                        <span>Est. Harvest: {crop.harvestDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <Sprout className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500">No active crops registered for this holding.</p>
                </div>
              )}
            </div>

            {/* Sow new crop form (Right) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-3">Sow New Acreage</h3>
                <form onSubmit={handleSowCrop} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9px] mb-1">Crop Type</label>
                    <select
                      value={sowForm.name}
                      onChange={(e) => setSowForm({ ...sowForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium"
                    >
                      <option value="Tomato">Tomato</option>
                      <option value="Rice Paddy">Rice Paddy</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Maize">Maize / Corn</option>
                      <option value="Soybean">Soybean</option>
                      <option value="Coffee">Coffee Bean</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9px] mb-1">Seed Variety Name</label>
                    <input
                      type="text"
                      required
                      value={sowForm.variety}
                      onChange={(e) => setSowForm({ ...sowForm, variety: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-bold uppercase text-[9px] mb-1">Area (Acres)</label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.1"
                        required
                        value={sowForm.acreage}
                        onChange={(e) => setSowForm({ ...sowForm, acreage: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold uppercase text-[9px] mb-1">Yield (Tons/Ac)</label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        required
                        value={sowForm.yield}
                        onChange={(e) => setSowForm({ ...sowForm, yield: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Confirm Planting & Dispatch
                  </button>
                </form>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 bg-emerald-50/50 p-3 rounded-lg text-[10px] text-emerald-800 leading-relaxed font-medium">
                <strong>Tip:</strong> Sowing data syncs directly with local carbon credit calculation ledger frameworks.
              </div>
            </div>
          </div>

          {/* AI soil suit rotation scheduler using `/api/crop-plan` */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <BrainCircuit className="h-4.5 w-4.5 text-emerald-600" />
                AI Crop Suitability & Precision Advisory Hub
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">Leverage the Gemini Deep Agronomist to analyze real-time environments, soil types, and market trends for custom crop plans.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sliders & Inputs matrix (Left - lg:col-span-5) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50/70 border border-slate-200/60 p-4 rounded-xl space-y-3.5">
                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider border-b border-emerald-100/50 pb-1.5 flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    1. Environment & Soil Profile
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 font-bold text-[10px] mb-1">Soil Type</label>
                      <select
                        value={plannerSoilType}
                        onChange={(e) => setPlannerSoilType(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none"
                      >
                        <option value="Loamy">Loamy Soil</option>
                        <option value="Clayey">Clayey Soil</option>
                        <option value="Sandy">Sandy Soil</option>
                        <option value="Silt">Silt Soil</option>
                        <option value="Peaty">Peaty Soil</option>
                        <option value="Chalky">Chalky Soil</option>
                        <option value="Saline">Saline Soil</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[10px] mb-1">Soil pH ({plannerPh})</label>
                      <input
                        type="range"
                        min="4"
                        max="10"
                        step="0.1"
                        value={plannerPh}
                        onChange={(e) => setPlannerPh(parseFloat(e.target.value))}
                        className="w-full accent-emerald-600 mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 font-bold text-[10px] mb-1">Temperature ({plannerTemperature}°C)</label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={plannerTemperature}
                        onChange={(e) => setPlannerTemperature(parseInt(e.target.value))}
                        className="w-full accent-emerald-600 mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[10px] mb-1">Annual Rainfall ({plannerRainfall} mm)</label>
                      <input
                        type="range"
                        min="100"
                        max="3000"
                        step="50"
                        value={plannerRainfall}
                        onChange={(e) => setPlannerRainfall(parseInt(e.target.value))}
                        className="w-full accent-emerald-600 mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 font-bold text-[10px] mb-1">Water Source</label>
                      <select
                        value={plannerWaterAvailability}
                        onChange={(e) => setPlannerWaterAvailability(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none"
                      >
                        <option value="Canal & Rainfed">Canal & Rainfed</option>
                        <option value="Borewell/Tubewell">Borewell/Tubewell</option>
                        <option value="Purely Rainfed">Purely Rainfed</option>
                        <option value="Drip Irrigation">Drip Irrigation</option>
                        <option value="Sprinkler Irrigation">Sprinkler Irrigation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[10px] mb-1">Season</label>
                      <select
                        value={plannerSeason}
                        onChange={(e) => setPlannerSeason(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none"
                      >
                        <option value="Kharif">Kharif (Monsoon)</option>
                        <option value="Rabi">Rabi (Winter)</option>
                        <option value="Zaid">Zaid (Summer)</option>
                        <option value="Spring">Spring</option>
                        <option value="Year-round">Year-round</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 font-bold text-[10px] mb-1">Moisture ({plannerMoisture}%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={plannerMoisture}
                        onChange={(e) => setPlannerMoisture(parseInt(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[10px] mb-1">Region/Climate Zone</label>
                      <input
                        type="text"
                        value={plannerRegion}
                        onChange={(e) => setPlannerRegion(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/60 p-4 rounded-xl space-y-3.5">
                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider border-b border-emerald-100/50 pb-1.5 flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    2. Soil Chemistry & Historical Data
                  </h4>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="block text-slate-500 font-bold text-[9px] mb-1">Nitrogen (N)</label>
                      <input
                        type="number"
                        value={plannerN}
                        onChange={(e) => setPlannerN(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-center font-medium text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[9px] mb-1">Phosphorus (P)</label>
                      <input
                        type="number"
                        value={plannerP}
                        onChange={(e) => setPlannerP(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-center font-medium text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[9px] mb-1">Potassium (K)</label>
                      <input
                        type="number"
                        value={plannerK}
                        onChange={(e) => setPlannerK(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-center font-medium text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-slate-500 font-bold text-[10px] mb-1">Farming & Soil History Logs</label>
                    <textarea
                      rows={2}
                      value={plannerHistoricalData}
                      onChange={(e) => setPlannerHistoricalData(e.target.value)}
                      placeholder="e.g., Sowed pulses last season; moderate organic humus, no prior root wilt diseases."
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 leading-normal"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePlan}
                  disabled={isPlanning}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
                >
                  {isPlanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Calibrating Agronomic Models...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-emerald-200" />
                      Evaluate & Recommend Top 5 Crops
                    </>
                  )}
                </button>
              </div>

              {/* Recommendations Display (Right - lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-4">
                {plannedCrops.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-100/60 rounded-xl p-3 border border-slate-200/50">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Top 5 Crop Matches Found</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Click a crop to inspect detailed plans</span>
                    </div>

                    <div className="space-y-2.5">
                      {plannedCrops.slice(0, 5).map((crop: any, index: number) => {
                        const isExpanded = expandedCropIndex === index;
                        return (
                          <div 
                            key={index} 
                            className={`border rounded-2xl transition-all overflow-hidden ${
                              isExpanded 
                                ? "bg-white border-emerald-500 shadow-sm" 
                                : "bg-slate-50/70 hover:bg-slate-50 border-slate-200/85 hover:border-slate-300"
                            }`}
                          >
                            {/* Accordion Header Row */}
                            <button
                              type="button"
                              onClick={() => setExpandedCropIndex(isExpanded ? null : index)}
                              className="w-full p-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <span className={`h-8 w-8 rounded-full font-bold text-sm flex items-center justify-center ${
                                  isExpanded ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                                }`}>
                                  {index + 1}
                                </span>
                                <div>
                                  <h4 className="font-bold text-slate-800 text-sm">{crop.name}</h4>
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                                      {crop.suitabilityScore}% Match
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                                      <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
                                      {crop.expectedYield} ton/acre
                                    </span>
                                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                                      <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                                      ₹{crop.estimatedProfit.toLocaleString()}/acre
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-slate-400 font-bold shrink-0 text-sm">
                                {isExpanded ? "▲ Hide Details" : "▼ Show Details"}
                              </span>
                            </button>

                            {/* Accordion Expandable Bento Grid */}
                            {isExpanded && (
                              <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-4">
                                {/* Yield & Financial Estimates */}
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                                    <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-widest block mb-0.5">Estimated Yield</span>
                                    <span className="text-xl font-black text-emerald-900">{crop.expectedYield}</span>
                                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Metric tons per cultivated acre</span>
                                  </div>
                                  <div className="bg-emerald-600 p-3.5 rounded-xl text-white shadow-sm">
                                    <span className="text-[9px] font-bold text-emerald-100 uppercase tracking-widest block mb-0.5">Estimated Profit</span>
                                    <span className="text-xl font-black">₹{crop.estimatedProfit.toLocaleString()}</span>
                                    <span className="text-[10px] text-emerald-100 font-medium block mt-0.5">Net cash return per acre</span>
                                  </div>
                                </div>

                                {/* Custom Fertilizer NPK & Irrigation */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                                    <h5 className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                      <Sprout className="h-4 w-4 text-emerald-600" />
                                      Fertilizer NPK Schedule
                                    </h5>
                                    <div className="bg-slate-50 rounded-lg p-2 flex items-center justify-between text-center border border-slate-100">
                                      <div>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase block">NPK Ratio</span>
                                        <span className="font-extrabold text-emerald-800 text-xs mt-0.5 block">{crop.fertilizerSchedule?.npkRatio || "N/A"}</span>
                                      </div>
                                      <div className="h-6 border-r border-slate-200"></div>
                                      <div className="text-left pl-3">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Active Application</span>
                                        <span className="text-[10px] text-slate-600 font-medium leading-tight mt-0.5 block">{crop.fertilizerSchedule?.schedule || "N/A"}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                                    <h5 className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                      <Droplets className="h-4 w-4 text-blue-500" />
                                      Irrigation Plan
                                    </h5>
                                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 space-y-1">
                                      <div className="flex justify-between text-[10px]">
                                        <span className="text-slate-400 font-bold">Frequency:</span>
                                        <span className="font-extrabold text-blue-700 uppercase">{crop.irrigationPlan?.frequency || "Daily"}</span>
                                      </div>
                                      <p className="text-[10px] text-slate-600 leading-normal font-medium border-t border-slate-200/50 pt-1">
                                        {crop.irrigationPlan?.planDetails}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Pest Prevention Calendar */}
                                <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                                  <h5 className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <ClipboardList className="h-4 w-4 text-amber-500" />
                                    Pest Prevention Calendar
                                  </h5>
                                  <div className="space-y-2">
                                    {crop.pestPreventionCalendar?.map((p: any, pIdx: number) => (
                                      <div key={pIdx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col md:flex-row gap-2 items-start justify-between text-[10px]">
                                        <div className="md:w-1/3">
                                          <span className="font-extrabold text-slate-700 uppercase block tracking-wider">{p.period}</span>
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {p.keyPests?.map((pest: string, pestIdx: number) => (
                                              <span key={pestIdx} className="bg-red-50 text-red-700 border border-red-100 text-[8px] font-extrabold px-1 rounded">
                                                {pest}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-slate-200/60 pt-1.5 md:pt-0 md:pl-3 text-slate-600 font-medium leading-relaxed">
                                          {p.preventiveAction}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Market Demand & Competitive Advantage */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                                    <h5 className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                      <TrendingUp className="h-4 w-4 text-purple-600" />
                                      Market Demand Prediction
                                    </h5>
                                    <div className="space-y-1.5">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Demand Tier:</span>
                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                          crop.marketDemand?.prediction === "High" 
                                            ? "bg-purple-100 text-purple-800" 
                                            : crop.marketDemand?.prediction === "Medium"
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-slate-100 text-slate-800"
                                        }`}>
                                          {crop.marketDemand?.prediction} Demand
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-slate-600 font-medium leading-normal bg-purple-50/40 p-2 rounded-lg border border-purple-100/30">
                                        {crop.marketDemand?.priceTrend}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                                    <h5 className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                                      Competitive Advantage
                                    </h5>
                                    <p className="text-[10px] text-slate-600 leading-normal font-medium bg-emerald-50/20 p-2.5 rounded-lg border border-emerald-100/40">
                                      {crop.competitiveAdvantage}
                                    </p>
                                  </div>
                                </div>

                                {/* Scientific Justifications / Reasons */}
                                <div className="bg-slate-100/50 rounded-xl p-3 space-y-1.5">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider">Scientific Alignment Reasons</span>
                                  {crop.reasons?.map((reason: string, rIdx: number) => (
                                    <div key={rIdx} className="text-[10px] text-slate-700 flex items-start gap-1.5 leading-normal">
                                      <span className="text-emerald-600 font-extrabold">✓</span>
                                      <span className="font-medium">{reason}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[380px] bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                    <Compass className="h-12 w-12 text-slate-300 mb-2.5" />
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Agronomist Advisory Awaiting Inputs</h4>
                    <p className="text-[10px] text-slate-400 mt-2 max-w-sm font-medium leading-relaxed">
                      Adjust soil parameters, climate type, temperature range, water source, and historical crop logs on the left, then click "Evaluate" to receive your customized 5-crop crop plans, schedules, financial analysis, and pest prevention calendar.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          TAB 3: LAND & ASSETS (Detailed Holding Profiles & Irrigation Setup)
          ============================================================================ */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Farm Profile Specs */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs space-y-4">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="h-4.5 w-4.5 text-emerald-600" />
              Landholding Profile Specs
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Total Acreage</span>
                <span className="text-sm font-black text-slate-800 mt-0.5 block">{activeFarm.totalAcreage} Acres</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Ownership Classification</span>
                <span className="text-sm font-black text-slate-800 mt-0.5 block">{activeFarm.role}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Topography</span>
                <span className="text-sm font-black text-slate-800 mt-0.5 block">Terraced & Silted Lowlands</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Soil Matrix</span>
                <span className="text-sm font-black text-slate-800 mt-0.5 block">{activeFarm.soilType}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-150 space-y-2 text-xs text-emerald-950 font-medium leading-relaxed">
              <h4 className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Info className="h-4 w-4" />
                Soil Organic Content Analysis
              </h4>
              <p>
                Organic Matter is rated at <strong className="text-emerald-900 font-extrabold">{activeFarm.organicMatter}%</strong>. 
                Values above 3% denote top-tier humus levels with excellent nitrogen synthesis buffers.
              </p>
            </div>
          </div>

          {/* Water & Irrigation Infrastructure specs */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs space-y-4">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Waves className="h-4.5 w-4.5 text-emerald-600" />
              Solenoid Irrigation & Hydric Network
            </h3>

            <div className="space-y-3.5 text-xs font-medium text-slate-600">
              <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Primary Water Source</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">{activeFarm.waterSource}</span>
                </div>
                <Waves className="h-5 w-5 text-emerald-600" />
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Irrigation Delivery Setup</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">{activeFarm.irrigationType}</span>
                </div>
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Infrastructure Efficiency Rating</span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: "92%" }} />
                  </div>
                  <span className="font-bold text-slate-800 shrink-0">92% Index</span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Zero runoff water compliance certified</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          TAB 4: FINANCES (Revenues, Stacked Expenses Bar, Transactions List, Logger)
          ============================================================================ */}
      {activeTab === "finances" && (
        <div className="space-y-6">
          {/* Revenue and Profit High-Level overview card */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Gross Contract Value</span>
              <p className="text-xl font-black text-slate-800 mt-1">${totalRevenueMock.toLocaleString()}</p>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                <span>Market contracts verified</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Logged Operating Cost</span>
              <p className="text-xl font-black text-slate-800 mt-1">${totalExpenses.toLocaleString()}</p>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
                <span>Adjusted dynamically</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Net Operating Profit</span>
              <p className={`text-xl font-black mt-1 ${netProfit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                ${netProfit.toLocaleString()}
              </p>
              <div className="text-[10px] text-slate-400 mt-1">Ecosystem Margin Analysis</div>
            </div>

            <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Operating Margin</span>
              <p className="text-xl font-black text-slate-800 mt-1">{marginPercentage}%</p>
              <div className="text-[10px] text-slate-400 mt-1 font-semibold text-emerald-600">Above industry baseline</div>
            </div>
          </div>

          {/* Custom visually rich cost allocation stacked bar */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider">Operating Expense (OpEx) Allocation</h3>
              <p className="text-slate-400 text-[10px] mt-0.5">Distribution across input categories.</p>
            </div>

            {/* Custom Multi-colored bar */}
            <div className="space-y-3">
              <div className="w-full bg-slate-100 h-5 rounded-lg overflow-hidden flex">
                {Object.entries(categoryCosts).map(([cat, amount]) => {
                  const pct = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                  if (pct === 0) return null;
                  const colors = {
                    Seeds: "bg-emerald-600",
                    Fertilizers: "bg-amber-500",
                    "Water & Irrigation": "bg-sky-500",
                    "Labor & Work": "bg-indigo-500",
                    "Fuel & Power": "bg-rose-500",
                    "Rent & Services": "bg-slate-400"
                  };
                  return (
                    <div
                      key={cat}
                      className={`${colors[cat as keyof typeof colors]} h-full hover:opacity-95 transition-opacity relative group`}
                      style={{ width: `${pct}%` }}
                    >
                      {/* Tooltip trigger */}
                      <span className="sr-only">{cat}: {pct}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend with sums */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2 text-xs">
                {[
                  { label: "Seeds", color: "bg-emerald-600" },
                  { label: "Fertilizers", color: "bg-amber-500" },
                  { label: "Water & Irrigation", color: "bg-sky-500" },
                  { label: "Labor & Work", color: "bg-indigo-500" },
                  { label: "Fuel & Power", color: "bg-rose-500" },
                  { label: "Rent & Services", color: "bg-slate-400" }
                ].map((leg) => {
                  const amt = categoryCosts[leg.label as keyof typeof categoryCosts] || 0;
                  return (
                    <div key={leg.label} className="flex items-center gap-1.5 font-medium">
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${leg.color}`} />
                      <div className="truncate">
                        <span className="text-slate-400 text-[10px] block leading-none">{leg.label}</span>
                        <span className="text-slate-800 font-bold block mt-0.5">${amt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Receipts table ledger (Left) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs space-y-4">
              <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider">Transaction Receipts</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[9px] uppercase tracking-wider">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Crop Focus</th>
                      <th className="pb-2">Expense Category</th>
                      <th className="pb-2">Description</th>
                      <th className="pb-2 text-right">Amount</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                    {activeExpenses.map((exp) => (
                      <tr key={exp.id} className="text-slate-700 hover:bg-slate-50/50">
                        <td className="py-2.5 text-slate-400">{exp.date}</td>
                        <td className="py-2.5 font-bold text-slate-800">{exp.cropName}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-2.5 truncate max-w-[150px]" title={exp.description}>
                          {exp.description}
                        </td>
                        <td className="py-2.5 text-right font-extrabold text-slate-950">${exp.amount}</td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Log transaction form (Right) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs">
              <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-4">Log Farm Expense</h3>
              <form onSubmit={handleLogExpense} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-500 uppercase text-[9px] font-bold mb-1">Crop/Holding Focus</label>
                  <input
                    type="text"
                    required
                    value={expenseForm.cropName}
                    onChange={(e) => setExpenseForm({ ...expenseForm, cropName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 uppercase text-[9px] font-bold mb-1">Expense Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2"
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Water & Irrigation">Water & Irrigation</option>
                    <option value="Labor & Work">Labor & Work</option>
                    <option value="Fuel & Power">Fuel & Power</option>
                    <option value="Rent & Services">Rent & Services</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 uppercase text-[9px] font-bold mb-1">Cost (USD)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 uppercase text-[9px] font-bold mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 uppercase text-[9px] font-bold mb-1">Receipt Notes</label>
                  <input
                    type="text"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    placeholder="Merchant info or invoice batch code"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Append Invoice to Ledger
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          TAB 5: TASK CALENDAR (Scheduler list, Add custom reminders, Checkbox completion)
          ============================================================================ */}
      {activeTab === "tasks" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Agendas List (Left) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider">Dynamic Crop Task Chore Calendar</h3>
                <p className="text-slate-400 text-[10px] mt-0.5">Review and tick chores in order of chronological operational urgency.</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-extrabold font-mono">
                {activeTasks.filter((t) => t.isCompleted).length}/{activeTasks.length} Done
              </span>
            </div>

            {activeTasks.length > 0 ? (
              <div className="space-y-2.5">
                {activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3.5 border rounded-xl flex items-center justify-between gap-4 transition-all ${
                      task.isCompleted
                        ? "bg-slate-50/50 border-slate-200 opacity-60 line-through"
                        : "bg-white border-slate-200 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleTaskComplete(task.id)}
                        className="h-4 w-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{task.title}</span>
                        <div className="flex gap-2 mt-1 items-center">
                          <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due: {task.dueDate}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase ${
                              task.priority === "High"
                                ? "bg-rose-50 text-rose-700 border border-rose-100"
                                : task.priority === "Medium"
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-slate-50 text-slate-600"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">Chore schedule is clear! No pending tasks registered.</p>
              </div>
            )}
          </div>

          {/* Schedule chore form (Right) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-4">Add Task Reminder</h3>
            <form onSubmit={handleAddTask} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-500 uppercase text-[9px] font-bold mb-1">Chore Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Clean drip irrigation valves"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase text-[9px] font-bold mb-1">Chore Category</label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-semibold text-slate-700"
                  >
                    <option value="Irrigation">Irrigation</option>
                    <option value="Fertilization">Fertilization</option>
                    <option value="Harvesting">Harvesting</option>
                    <option value="Diagnostics">Diagnostics</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 uppercase text-[9px] font-bold mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-semibold text-slate-700"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 uppercase text-[9px] font-bold mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Schedule Chore
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================================
          TAB: AI SOIL ANALYSIS LAB
          ============================================================================ */}
      {activeTab === "soil" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3.5 mb-4 gap-2">
              <div>
                <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <FlaskConical className="h-4.5 w-4.5 text-emerald-600" />
                  Gemini Precision Soil Lab
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Combine physical soil images, lab reports, and contextual parameters using ensemble models (Random Forest, XGBoost, Neural Networks) to assess biochemistry.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadSampleSoil}
                className="shrink-0 text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg border border-emerald-200/60 transition-all cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                Preload Punjab Clay-Loam Report
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Inputs Matrix (Left - lg:col-span-5) */}
              <div className="lg:col-span-5 space-y-4">
                {/* File Upload Box 1: Soil Test Report */}
                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 space-y-3">
                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 border-b border-emerald-100/50 pb-1.5">
                    <ClipboardList className="h-3.5 w-3.5" />
                    1. Upload Chemistry Report (PDF / Image)
                  </h4>
                  <div className="relative border border-dashed border-slate-300 rounded-lg p-4 bg-white text-center hover:bg-slate-50/30 transition-all">
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleSoilReportChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-700">
                        {soilReportName ? `Selected: ${soilReportName}` : "Drag & drop or browse chemistry PDF/image"}
                      </p>
                      <p className="text-[9px] text-slate-400">Supports laboratory reports, PDF files, and scan captures</p>
                    </div>
                  </div>
                  {soilReportName && (
                    <div className="text-[10px] bg-emerald-50/70 text-emerald-800 p-2 rounded-lg flex items-center justify-between border border-emerald-100/40">
                      <span className="font-semibold truncate max-w-[80%]">✓ {soilReportName}</span>
                      <button
                        onClick={() => {
                          setSoilReportName("");
                          setSoilReportBase64(null);
                        }}
                        className="text-red-500 font-bold hover:text-red-700 text-[9px]"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* File Upload Box 2: Soil Close-up Image */}
                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 space-y-3">
                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 border-b border-emerald-100/50 pb-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    2. Upload Soil Image (Physical Structure)
                  </h4>
                  <div className="relative border border-dashed border-slate-300 rounded-lg p-4 bg-white text-center hover:bg-slate-50/30 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSoilImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-700">
                        {soilImageName ? `Selected: ${soilImageName}` : "Drag & drop or browse physical soil photograph"}
                      </p>
                      <p className="text-[9px] text-slate-400">Enables physical soil texture and color analysis via AI models</p>
                    </div>
                  </div>
                  {soilImageName && (
                    <div className="text-[10px] bg-emerald-50/70 text-emerald-800 p-2 rounded-lg flex items-center justify-between border border-emerald-100/40">
                      <span className="font-semibold truncate max-w-[80%]">✓ {soilImageName}</span>
                      <button
                        onClick={() => {
                          setSoilImageName("");
                          setSoilImageBase64(null);
                        }}
                        className="text-red-500 font-bold hover:text-red-700 text-[9px]"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Manual Calibration Overrides */}
                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 space-y-3.5">
                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 border-b border-emerald-100/50 pb-1.5">
                    <Activity className="h-3.5 w-3.5" />
                    3. Contextual Overrides & Location
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 font-bold text-[10px] mb-1">Soil Texture Class</label>
                      <select
                        value={manualSoilType}
                        onChange={(e) => setManualSoilType(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-700 outline-none"
                      >
                        <option value="Loamy">Loamy Soil</option>
                        <option value="Clay Loam">Clay Loam</option>
                        <option value="Sandy Loam">Sandy Loam</option>
                        <option value="Silty Clay">Silty Clay</option>
                        <option value="Peaty">Peaty Soil</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[10px] mb-1">Target pH ({manualPh})</label>
                      <input
                        type="range"
                        min="4"
                        max="10"
                        step="0.1"
                        value={manualPh}
                        onChange={(e) => setManualPh(parseFloat(e.target.value))}
                        className="w-full accent-emerald-600 mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold text-[10px] mb-1">Farm Location / Region</label>
                    <input
                      type="text"
                      value={manualLocation}
                      onChange={(e) => setManualLocation(e.target.value)}
                      placeholder="e.g. Punjab North Basin, India"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                    />
                  </div>
                </div>

                {/* Action Trigger button */}
                <button
                  type="button"
                  onClick={handleAnalyzeSoil}
                  disabled={isAnalyzingSoil}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
                >
                  {isAnalyzingSoil ? (
                    <div className="space-y-1 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-white" />
                        <span>Running Multi-Ensemble Estimators...</span>
                      </div>
                      <p className="text-[8px] text-emerald-200 font-medium tracking-wide">Random Forest classification & Neural Net pH mapping active...</p>
                    </div>
                  ) : (
                    <>
                      <FlaskConical className="h-4.5 w-4.5" />
                      Run AI Soil Diagnostic Sequence
                    </>
                  )}
                </button>
              </div>

              {/* Outputs Matrix (Right - lg:col-span-7) */}
              <div className="lg:col-span-7">
                {soilAnalysisResult ? (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    
                    {/* Overall Score Badge Row */}
                    <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-xl p-4 shadow-md flex items-center justify-between border border-emerald-700/50">
                      <div>
                        <span className="text-[9px] uppercase font-black text-emerald-200 tracking-wider">AI Soil Fertility Index</span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-3xl font-black">{soilAnalysisResult.fertilityIndex}</span>
                          <span className="text-xs text-emerald-200">/ 100</span>
                        </div>
                        <p className="text-[10px] text-emerald-100 font-medium mt-1">
                          Estimated Soil Texture: <span className="font-extrabold text-white">{soilAnalysisResult.soilTexture}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-emerald-700 text-white font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider block border border-emerald-600/40">
                          {soilAnalysisResult.fertilityIndex >= 80 ? "Optimal Fertility" : soilAnalysisResult.fertilityIndex >= 60 ? "Moderate Fertility" : "Deficient Soil"}
                        </span>
                        <span className="text-[9px] text-emerald-200 mt-1.5 block font-semibold">Location: {manualLocation}</span>
                      </div>
                    </div>

                    {/* Interactive 3D Soil Horizon Column & Status readout */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-xs">
                      <div>
                        <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="h-4 w-4 text-emerald-600" />
                          3D Interactive Soil Horizon Profile
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Click each structural horizon below to analyze physical biology and root penetration potential.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* 3D Stack (md:col-span-4) */}
                        <div className="md:col-span-4 flex flex-col gap-1 pr-2">
                          {/* Horizon O */}
                          <button
                            type="button"
                            onClick={() => setActiveHorizon("O")}
                            className={`w-full text-left p-3 rounded-lg border transition-all text-[10px] font-extrabold shadow-sm ${
                              activeHorizon === "O"
                                ? "bg-amber-950 text-white border-amber-800 ring-2 ring-emerald-500 ring-offset-2 scale-102"
                                : "bg-amber-950/80 hover:bg-amber-950 text-amber-200 border-amber-900"
                            }`}
                          >
                            <span className="block text-[8px] uppercase font-black text-amber-400 tracking-wider">O - Organic (0-2")</span>
                            Rich Humus Layer
                          </button>

                          {/* Horizon A */}
                          <button
                            type="button"
                            onClick={() => setActiveHorizon("A")}
                            className={`w-full text-left p-3 rounded-lg border transition-all text-[10px] font-extrabold shadow-sm ${
                              activeHorizon === "A"
                                ? "bg-yellow-950 text-white border-yellow-800 ring-2 ring-emerald-500 ring-offset-2 scale-102"
                                : "bg-yellow-950/80 hover:bg-yellow-950 text-yellow-200 border-yellow-900"
                            }`}
                          >
                            <span className="block text-[8px] uppercase font-black text-yellow-400 tracking-wider">A - Topsoil (2-10")</span>
                            Active Root Zone
                          </button>

                          {/* Horizon B */}
                          <button
                            type="button"
                            onClick={() => setActiveHorizon("B")}
                            className={`w-full text-left p-3 rounded-lg border transition-all text-[10px] font-extrabold shadow-sm ${
                              activeHorizon === "B"
                                ? "bg-amber-800 text-white border-amber-700 ring-2 ring-emerald-500 ring-offset-2 scale-102"
                                : "bg-amber-800/80 hover:bg-amber-800 text-amber-100 border-amber-900"
                            }`}
                          >
                            <span className="block text-[8px] uppercase font-black text-amber-300 tracking-wider">B - Subsoil (10-30")</span>
                            Leached Clay Matrix
                          </button>

                          {/* Horizon C */}
                          <button
                            type="button"
                            onClick={() => setActiveHorizon("C")}
                            className={`w-full text-left p-3 rounded-lg border transition-all text-[10px] font-extrabold shadow-sm ${
                              activeHorizon === "C"
                                ? "bg-slate-600 text-white border-slate-500 ring-2 ring-emerald-500 ring-offset-2 scale-102"
                                : "bg-slate-600/80 hover:bg-slate-600 text-slate-100 border-slate-700"
                            }`}
                          >
                            <span className="block text-[8px] uppercase font-black text-slate-300 tracking-wider">C - Substratum (30"+)</span>
                            Weathered Rock Bed
                          </button>
                        </div>

                        {/* Status Readout (md:col-span-8) */}
                        <div className="md:col-span-8 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] uppercase font-black text-slate-400">Selected Horizon Assessment</span>
                            <h5 className="font-extrabold text-slate-800 text-xs mt-0.5 uppercase tracking-wider">
                              {activeHorizon === "O" ? "O-Horizon: Humus & Leaf Litter" : activeHorizon === "A" ? "A-Horizon: Active Biome Topsoil" : activeHorizon === "B" ? "B-Horizon: Clay Accumulation Subsoil" : "C-Horizon: Weathered Bedrock Substratum"}
                            </h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-2 p-3 bg-white border border-slate-100 rounded-lg">
                              {activeHorizon === "O" ? soilAnalysisResult.horizons.horizonO : activeHorizon === "A" ? soilAnalysisResult.horizons.horizonA : activeHorizon === "B" ? soilAnalysisResult.horizons.horizonB : soilAnalysisResult.horizons.horizonC}
                            </p>
                          </div>
                          <div className="text-[9px] text-slate-400 font-bold border-t border-slate-200/50 pt-2 flex items-center gap-1.5 mt-2.5">
                            <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            Structure is determined based on physical soil imagery color hues and density analysis.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Biochemical NPK & Micro-nutrient deficiency table */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                      <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="h-4 w-4 text-emerald-600" />
                        Biochemical Nutrient Deficiencies & Stats
                      </h4>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {/* Nitrogen */}
                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Nitrogen (N)</span>
                          <span className="block text-sm font-black text-slate-800">{soilAnalysisResult.nutrients.nitrogenVal} mg/kg</span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full inline-block ${
                            soilAnalysisResult.nutrients.nitrogenStatus === "Optimal" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : soilAnalysisResult.nutrients.nitrogenStatus === "Deficient"
                                ? "bg-red-50 text-red-700 border border-red-100 animate-pulse"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {soilAnalysisResult.nutrients.nitrogenStatus}
                          </span>
                        </div>

                        {/* Phosphorus */}
                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Phosphorus (P)</span>
                          <span className="block text-sm font-black text-slate-800">{soilAnalysisResult.nutrients.phosphorusVal} mg/kg</span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full inline-block ${
                            soilAnalysisResult.nutrients.phosphorusStatus === "Optimal" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : soilAnalysisResult.nutrients.phosphorusStatus === "Deficient"
                                ? "bg-red-50 text-red-700 border border-red-100 animate-pulse"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {soilAnalysisResult.nutrients.phosphorusStatus}
                          </span>
                        </div>

                        {/* Potassium */}
                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Potassium (K)</span>
                          <span className="block text-sm font-black text-slate-800">{soilAnalysisResult.nutrients.potassiumVal} mg/kg</span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full inline-block ${
                            soilAnalysisResult.nutrients.potassiumStatus === "Optimal" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : soilAnalysisResult.nutrients.potassiumStatus === "Deficient"
                                ? "bg-red-50 text-red-700 border border-red-100 animate-pulse"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {soilAnalysisResult.nutrients.potassiumStatus}
                          </span>
                        </div>

                        {/* Zinc */}
                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Zinc (Zn)</span>
                          <span className="block text-sm font-black text-slate-800">{soilAnalysisResult.nutrients.zincVal} ppm</span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full inline-block ${
                            soilAnalysisResult.nutrients.zincStatus === "Optimal" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : soilAnalysisResult.nutrients.zincStatus === "Deficient"
                                ? "bg-red-50 text-red-700 border border-red-100 animate-pulse"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {soilAnalysisResult.nutrients.zincStatus}
                          </span>
                        </div>

                        {/* Iron */}
                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Iron (Fe)</span>
                          <span className="block text-sm font-black text-slate-800">{soilAnalysisResult.nutrients.ironVal} ppm</span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full inline-block ${
                            soilAnalysisResult.nutrients.ironStatus === "Optimal" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : soilAnalysisResult.nutrients.ironStatus === "Deficient"
                                ? "bg-red-50 text-red-700 border border-red-100 animate-pulse"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {soilAnalysisResult.nutrients.ironStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* pH scale and Adjustment Panel */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          pH Level & biochemical Amendments
                        </h4>
                        <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                          pH {soilAnalysisResult.soilPh}
                        </span>
                      </div>

                      {/* pH graphical bar */}
                      <div className="space-y-1">
                        <div className="h-2.5 rounded-full w-full bg-gradient-to-r from-red-500 via-green-500 to-purple-600 relative overflow-visible">
                          <div 
                            style={{ left: `${Math.min(Math.max((soilAnalysisResult.soilPh - 4) * 16.6, 0), 100)}%` }} 
                            className="absolute -top-1 w-4.5 h-4.5 bg-white border-2 border-slate-800 rounded-full shadow-md -translate-x-1/2 flex items-center justify-center font-bold text-[8px] text-slate-800"
                          >
                            •
                          </div>
                        </div>
                        <div className="flex justify-between text-[8px] text-slate-400 font-extrabold uppercase px-1">
                          <span>4.0 Acidic</span>
                          <span>7.0 Neutral</span>
                          <span>10.0 Alkaline</span>
                        </div>
                      </div>

                      <div className="bg-blue-50/55 rounded-lg p-3 border border-blue-100/50 text-[10px] text-slate-700 leading-relaxed font-semibold">
                        <span className="text-[9px] uppercase font-black text-blue-800 tracking-wider block mb-1">Adjustment Action Plan:</span>
                        {soilAnalysisResult.phRecommendations}
                      </div>
                    </div>

                    {/* Organic Matter & Water capacity stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Organic Matter Percentage</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-slate-800">{soilAnalysisResult.organicMatter}%</span>
                          <span className="text-[10px] text-slate-400 font-semibold">(Benchmark: 3.0%+)</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">Critical indicator for biological moisture retaining carbon.</p>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Water Holding Capacity</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-slate-800">{soilAnalysisResult.waterHoldingCapacity}%</span>
                          <span className="text-[10px] text-slate-400 font-semibold">(Soil Retention Index)</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">Indicates moisture capacity held against gravitational runoff.</p>
                      </div>
                    </div>

                    {/* Suitable crop recommendations with probabilities */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
                      <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Sprout className="h-4 w-4 text-emerald-600" />
                        Matched Rotation Crops & Success Probability
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {soilAnalysisResult.suitableCrops.map((c: any, cIdx: number) => (
                          <div key={cIdx} className="bg-slate-50 border border-slate-200/70 p-3 rounded-lg text-center space-y-1.5">
                            <span className="text-[10px] font-black text-slate-700 block truncate">{c.cropName}</span>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div style={{ width: `${c.successProbability}%` }} className="h-full bg-emerald-600 rounded-full"></div>
                            </div>
                            <span className="text-[9px] font-extrabold text-emerald-800 block">{c.successProbability}% success probability</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Remediation Action Plan Timeline */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
                      <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <ClipboardList className="h-4 w-4 text-emerald-600" />
                        Soil Remediation Action Plan
                      </h4>

                      <div className="space-y-3 border-l border-emerald-100 pl-4 ml-1 relative">
                        {soilAnalysisResult.remediationPlan.map((p: any, pIdx: number) => (
                          <div key={pIdx} className="space-y-1 relative">
                            <div className="absolute -left-5 top-0.5 h-2 w-2 rounded-full bg-emerald-600"></div>
                            <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{p.phaseName}</h5>
                            <div className="space-y-1 text-[10px] text-slate-600 font-medium leading-relaxed pl-1">
                              {p.actions.map((act: string, actIdx: number) => (
                                <p key={actIdx} className="flex items-start gap-1">
                                  <span className="text-emerald-500 shrink-0">•</span>
                                  <span>{act}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Historical Soil Health Area Chart (Recharts) */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                      <div>
                        <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                          Historical Soil Health & Nitrogen Trends
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Continuous improvement trends of soil fertility & mineral status across quarters.</p>
                      </div>

                      <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={[
                              { name: "Autumn 2025", fertility: 54, nitrogen: 32 },
                              { name: "Winter 2025", fertility: 61, nitrogen: 38 },
                              { name: "Spring 2026", fertility: 74, nitrogen: 49 },
                              { name: "Current Run", fertility: soilAnalysisResult.fertilityIndex, nitrogen: soilAnalysisResult.nutrients.nitrogenVal },
                            ]}
                            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="fertilityGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#059669" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                            <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                            <Tooltip contentStyle={{ fontSize: "10px", fontWeight: "bold", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                            <Legend wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
                            <Area type="monotone" name="Fertility Index" dataKey="fertility" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#fertilityGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="h-full min-h-[450px] bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                    <FlaskConical className="h-12 w-12 text-slate-300 mb-2.5" />
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Soil Diagnostic Lab Idle</h4>
                    <p className="text-[10px] text-slate-400 mt-2 max-w-sm font-medium leading-relaxed">
                      Upload chemical reports and structure photographs or click the **"Preload Punjab Clay-Loam Report"** button at the top to generate a precision dashboard.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          TAB 6: AI PATHOLOGIST DISEASE SCANNER
          ============================================================================ */}
      {activeTab === "pathologist" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Symptoms and trigger form (Left) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <BrainCircuit className="h-4.5 w-4.5 text-emerald-600" />
                Gemini Pathological Plant Scan
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded">
                v3.5 Flash
              </span>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-500 uppercase text-[9px] font-bold mb-1">Select Crop Class</label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none"
                >
                  <option value="Tomato">Tomato Patch</option>
                  <option value="Rice Paddy">Basmati Rice Paddy</option>
                  <option value="Wheat">Wheat Field</option>
                  <option value="Maize">Corn Maize Field</option>
                  <option value="Coffee">Arabica Coffee Canopy</option>
                  <option value="Soybean">Soybean Acreage</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 uppercase text-[9px] font-bold mb-1">AI Classification Model</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none"
                >
                  <option value="ResNet-50 Disease Classifier">ResNet-50 Disease Classifier (Primary)</option>
                  <option value="YOLO v8 Leaf Object Detector">YOLO v8 Leaf Object Detector</option>
                  <option value="CNN Spectral Leaf Scan">CNN Spectral Leaf Scan</option>
                  <option value="TensorFlow MobileNet Edge Engine">TensorFlow MobileNet Edge Engine</option>
                </select>
              </div>

              {/* Crop Leaf Image Upload */}
              <div>
                <label className="block text-slate-500 uppercase text-[9px] font-bold mb-1">
                  Upload Leaf / Fruit Scan (Mobile Camera / Image)
                </label>
                
                <div className="relative border border-dashed border-slate-300 hover:border-emerald-500 rounded-lg p-3 text-center transition-all bg-slate-50/50">
                  <input
                    id="disease-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleDiseaseImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1 py-1.5">
                    <Camera className="h-5 w-5 text-slate-400" />
                    <span className="text-[10px] text-slate-500 font-bold">
                      {diseaseImageName ? diseaseImageName : "Tap to open Camera / Choose file"}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      Supports direct JPEG, PNG, HEIC leaf scans
                    </span>
                  </div>
                </div>

                {diseaseImageBase64 && (
                  <div className="mt-2 flex items-center justify-between bg-emerald-50/50 border border-emerald-100 rounded-lg px-2.5 py-1.5">
                    <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Leaf Image Loaded
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDiseaseImageBase64(null);
                        setDiseaseImageMime(null);
                        setDiseaseImageName("");
                      }}
                      className="text-[10px] text-red-500 hover:text-red-700 font-extrabold cursor-pointer"
                    >
                      Clear Image
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-500 uppercase text-[9px] font-bold">Symptom Log Description</label>
                  <button
                    type="button"
                    onClick={handleLoadSampleDisease}
                    className="text-[9px] text-emerald-600 hover:text-emerald-700 font-extrabold tracking-wide"
                  >
                    ⚡ Preload Early Blight Demo
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., lower foliage curling inwards with concentric black target circles."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>

              <button
                type="button"
                onClick={handleDiagnose}
                disabled={isDiagnosing || (!symptoms.trim() && !diseaseImageBase64)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-55 cursor-pointer"
              >
                {isDiagnosing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing leaf pathology...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-emerald-200" />
                    Query Gemini AI Diagnosis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results readout (Right) */}
          <div className="lg:col-span-7 space-y-4">
            {activeDiagResult ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-in fade-in">
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Identified Crop Disease</span>
                    <h4 className="text-sm font-black text-slate-950 flex items-center gap-2 mt-0.5">
                      <ShieldAlert className="h-4.5 w-4.5 text-red-600 animate-pulse" />
                      {activeDiagResult.diseaseName}
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      activeDiagResult.severityLevel === "Severe" ? "bg-red-50 text-red-700 border border-red-200" :
                      activeDiagResult.severityLevel === "Moderate" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                      "bg-yellow-50 text-yellow-700 border border-yellow-200"
                    }`}>
                      Severity: {activeDiagResult.severityLevel}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {activeDiagResult.confidenceScore}% Confidence
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Chemical Pesticide Remediation */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-1.5">
                    <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      Recommended Chemical Pesticide
                    </span>
                    <p className="text-slate-800 text-xs leading-relaxed font-semibold">
                      {activeDiagResult.treatments?.chemicalPesticide}
                    </p>
                  </div>

                  {/* Organic Remedies */}
                  <div className="bg-emerald-50/20 border border-emerald-200/40 rounded-xl p-3.5 space-y-1.5">
                    <span className="text-emerald-700 text-[10px] uppercase font-bold flex items-center gap-1.5">
                      <Sprout className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Organic Remedial Treatment
                    </span>
                    <p className="text-emerald-950 text-xs leading-relaxed font-semibold">
                      {activeDiagResult.treatments?.organicTreatment}
                    </p>
                  </div>
                </div>

                {/* Prevention and Proactive Safeguards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Cultural Prevention Methods</span>
                    <p className="text-slate-700 text-xs leading-relaxed font-medium">
                      {activeDiagResult.prevention?.cultural}
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Biological Controls & Vectors</span>
                    <p className="text-slate-700 text-xs leading-relaxed font-medium">
                      {activeDiagResult.prevention?.biological}
                    </p>
                  </div>
                </div>

                {/* Epidemiology & Diagnostics Summary */}
                <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <h5 className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Epidemiology & Spread Controls</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Dissemination Velocity & Area</span>
                      <p className="text-slate-700 mt-0.5 leading-relaxed font-medium">
                        <strong className="text-slate-900">Affected Area:</strong> {activeDiagResult.spreadPrediction?.estimatedInfectedArea}<br />
                        <strong className="text-slate-900">Velocity:</strong> {activeDiagResult.spreadPrediction?.velocity}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Quarantine Protocol</span>
                      <p className="text-slate-700 mt-0.5 leading-relaxed font-medium">
                        {activeDiagResult.quarantineRecommendations}
                      </p>
                    </div>
                  </div>

                  {/* Treatment Cost Estimator & Nearby Infected Farms Alert */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-200/60 pt-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block flex items-center gap-1">
                        <Coins className="h-3 w-3 text-slate-500" /> Remediative Cost Est.
                      </span>
                      <p className="text-slate-900 mt-0.5 font-bold">
                        {activeDiagResult.treatmentCostEstimator}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-500" /> Local Outbreak Registry
                      </span>
                      <p className="text-amber-700 mt-0.5 font-bold flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        {activeDiagResult.nearbyFarmsAlert}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Multilingual Symptom Descriptions Section */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-2 gap-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-slate-500" />
                      Multilingual Symptoms Explanation
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(["english", "spanish", "hindi", "swahili"] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setPathologyLanguage(lang)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-colors cursor-pointer ${
                            pathologyLanguage === lang
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed italic font-medium">
                    {activeDiagResult.multilingualSymptoms?.[pathologyLanguage] || 
                     activeDiagResult.multilingualSymptoms?.english ||
                     "Symptom translation preparing..."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-center items-center text-center min-h-[400px]">
                <Sprout className="h-10 w-10 text-emerald-300 animate-pulse mb-2" />
                <h4 className="text-xs font-bold text-slate-700">Awaiting pathology diagnostic run</h4>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                  Log symptoms above and request the agronomist pathologist server to run biochemical matching models.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "marketplace" && (
        <div className="space-y-6">
          {/* Sub-tabs for inputs vs crop trade */}
          <div className="flex border-b border-slate-200/85">
            <button
              type="button"
              onClick={() => setMarketSubTab("crops")}
              className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
                marketSubTab === "crops"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              🌾 Sovereign Crop Selling
            </button>
            <button
              type="button"
              onClick={() => setMarketSubTab("inputs")}
              className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-6 cursor-pointer transition-all ${
                marketSubTab === "inputs"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              🛒 Purchase Inputs
            </button>
          </div>

          {marketSubTab === "crops" ? (
            <CropSellingMarketplace currentRole="Farmer" />
          ) : (
            <SmartMarketplace
              activeCrops={activeFarm.sectors.map((sec) => ({
                name: sec.cropName,
                stage: sec.cropName === "Rice Paddy" ? "Tillering Stage" : sec.cropName === "Tomato" ? "Vegetative Stage" : "Pre-Harvest Sowing",
                healthStatus: sec.healthStatus,
                sector: sec.name
              }))}
              soilType={activeFarm.soilType}
              activeDiseases={diagnostics.map((d) => d.aiDiagnosis).filter(Boolean) as string[]}
            />
          )}
        </div>
      )}

      {activeTab === "rentals" && (
        <EquipmentRentalSystem />
      )}

      {activeTab === "government" && (
        <GovernmentIntegration />
      )}

      {activeTab === "weather" && (
        <WeatherIntelligence />
      )}

      {activeTab === "predictions" && (
        <YieldPricePrediction />
      )}

      {activeTab === "fin_services" && (
        <FinancialServices />
      )}

      {activeTab === "warehouse" && (
        <WarehouseStorage />
      )}

      {activeTab === "logistics" && (
        <LogisticsModule />
      )}

      {/* Historic consult logs */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs">
        <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4">
          <ClipboardList className="h-4.5 w-4.5 text-emerald-600" />
          Historic Diagnostics & Verified consultations
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[9px] uppercase tracking-wider">
                <th className="pb-2.5">Crop Class</th>
                <th className="pb-2.5">Reported Symptoms</th>
                <th className="pb-2.5">AI pathology diagnosis</th>
                <th className="pb-2.5">Match confidence</th>
                <th className="pb-2.5">Audit Status</th>
                <th className="pb-2.5">Date logged</th>
                <th className="pb-2.5 text-right">Expert Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {diagnostics.map((diag) => (
                <tr key={diag.id} className="text-slate-700 hover:bg-slate-50/50">
                  <td className="py-3 font-semibold text-slate-800">{diag.cropName}</td>
                  <td className="py-3 truncate max-w-[150px]">{diag.symptoms}</td>
                  <td className="py-3 text-slate-900 font-bold">{diag.aiDiagnosis || "Pending Analysis"}</td>
                  <td className="py-3 text-emerald-600 font-extrabold">{diag.confidence ? `${diag.confidence}%` : "88%"}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        diag.status === "Expert Verified"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-teal-50 text-teal-700 border border-teal-100"
                      }`}
                    >
                      {diag.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{diag.date}</td>
                  <td className="py-3 text-right">
                    {diag.status === "AI Diagnosed" ? (
                      <button
                        onClick={() =>
                          onUpdateDiagnostic(diag.id, {
                            status: "Expert Verified",
                            expertName: "Dr. Rachel Carter",
                            expertNotes: "I verified this fungus outbreak. Recommending organic bio-fungicide immediately."
                          })
                        }
                        className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-[9px] font-bold transition-all cursor-pointer"
                      >
                        Sign Off (Expert Verification)
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold italic">Cooperative Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
