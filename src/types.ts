export enum UserRole {
  FARMER = "Farmer",
  BUYER = "Buyer",
  GOVERNMENT = "Government Officer",
  SUPPLIER = "Supplier",
  EXPERT = "Agriculture Expert",
  ADMIN = "Admin",
  LOGISTICS = "Logistics Provider",
  WAREHOUSE = "Warehouse Operator",
  INSURANCE = "Insurance Agent",
  BANK = "Bank Officer",
  RESEARCHER = "Researcher",
  EXTENSION = "Extension Officer",
}

export interface TelemetryReading {
  soilMoisture: number; // %
  soilPh: number;
  temperature: number; // °C
  humidity: number; // %
  nitrogen: number; // mg/kg
  phosphorus: number; // mg/kg
  potassium: number; // mg/kg
  timestamp: string;
}

export interface CropDiagnostic {
  id: string;
  cropName: string;
  symptoms: string;
  imageType?: string; // Mock or visual simulation
  status: "Pending AI" | "AI Diagnosed" | "Expert Verified";
  aiDiagnosis?: string;
  treatment?: string;
  confidence?: number;
  expertName?: string;
  expertNotes?: string;
  date: string;
}

export interface MarketBid {
  id: string;
  cropType: string;
  quantity: number; // tons
  quality: "Grade A" | "Grade B" | "Grade C";
  pricePerTon: number; // USD
  buyerName: string;
  status: "Active" | "Accepted" | "Countered" | "Completed";
  date: string;
}

export interface SubsidyScheme {
  id: string;
  title: string;
  category: "Climate Resilience" | "Equipment" | "Organic Transition" | "Financial Relief";
  fundingAmount: number;
  approvedCount: number;
  status: "Active" | "Closed";
  description: string;
}

export interface SupplierItem {
  id: string;
  name: string;
  category: "Seeds" | "Fertilizers" | "IoT Sensors" | "Machinery";
  price: number;
  stock: number;
  rating: number;
  image: string;
}

export interface LogisticsRoute {
  id: string;
  driverName: string;
  cargo: string;
  weight: number; // kg
  origin: string;
  destination: string;
  tempCelsius: number;
  status: "In Transit" | "Dispatched" | "Delivered";
  progress: number; // %
}

export interface WarehouseSilo {
  id: string;
  name: string;
  grainType: string;
  capacityTons: number;
  currentFillTons: number;
  tempCelsius: number;
  humidityPercent: number;
  status: "Optimal" | "Warning" | "Critical";
}

export interface InsurancePolicy {
  id: string;
  farmerName: string;
  premiumAmount: number;
  coverageAmount: number;
  riskScore: number; // 0 - 100
  status: "Active" | "Claimed" | "Expired";
  cropInsured: string;
}

export interface MicroLoan {
  id: string;
  farmerName: string;
  requestedAmount: number;
  purpose: string;
  creditScore: number;
  status: "Applied" | "Approved" | "Disbursed" | "Rejected";
  date: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  author: string;
  domain: string;
  summary: string;
  views: number;
  date: string;
}

export interface FieldWorkshop {
  id: string;
  title: string;
  location: string;
  date: string;
  attendeesCount: number;
  status: "Scheduled" | "Completed";
  objective: string;
}
