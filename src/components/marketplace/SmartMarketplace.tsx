import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Star,
  Award,
  Sliders,
  Calendar,
  MapPin,
  Truck,
  History,
  HeartHandshake,
  Check,
  Percent,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Info,
  ChevronRight,
  Sparkles,
  Map,
  BadgeAlert,
  Bell,
  Clock,
  ThumbsUp,
  RotateCcw,
  ShieldCheck,
  Compass,
  Sprout,
  RefreshCw
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ReferenceLine } from "recharts";

// Interfaces
interface Product {
  id: string;
  name: string;
  category: "Seeds" | "Fertilizers" | "Pesticides" | "Equipment" | "Irrigation" | "Organic";
  price: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  reviews: { author: string; rating: number; text: string; date: string }[];
  supplier: string;
  certification: string;
  returnPolicy: string;
  warranty: string;
  stockLevel: "In Stock" | "Low Stock" | "Out of Stock";
  nearbyStock: { dealer: string; distance: number; stock: number; price: number }[];
  aiMatchReason: string;
  priceForecast: {
    recommendation: "Buy Now" | "Wait" | "Strong Buy";
    reason: string;
    trendData: { month: string; historicalPrice: number; projectedPrice?: number }[];
  };
}

interface SmartMarketplaceProps {
  activeCrops: { name: string; stage: string; healthStatus: string; sector: string }[];
  soilType: string;
  activeDiseases: string[];
}

export const SmartMarketplace: React.FC<SmartMarketplaceProps> = ({
  activeCrops = [],
  soilType = "Clay Loam",
  activeDiseases = []
}) => {
  // Mock products database
  const products: Product[] = [
    {
      id: "prod-1",
      name: "Pre-Vigor F1 Hybrid Tomato Seeds",
      category: "Seeds",
      price: 18.5,
      unit: "pack (500 seeds)",
      rating: 4.8,
      reviewsCount: 34,
      reviews: [
        { author: "Gurdev S.", rating: 5, text: "Outstanding germination rate (above 96%). Vigorous vines.", date: "2026-05-12" },
        { author: "Ramesh P.", rating: 4, text: "High yield, but needs solid trellis support.", date: "2026-06-01" }
      ],
      supplier: "Saraswati Agro-Seeds Ltd",
      certification: "APEDA Quality Seed Stamp #A-483",
      returnPolicy: "30-Day Germination Performance Guarantee (Free return/replace if germination < 90%)",
      warranty: "Germination viability guaranteed for 12 months in sealed storage",
      stockLevel: "In Stock",
      nearbyStock: [
        { dealer: "Amritsar Farmers Co-op", distance: 4.2, stock: 45, price: 18.0 },
        { dealer: "Precision Agri-Inputs Ludhiana", distance: 12.8, stock: 150, price: 18.5 }
      ],
      aiMatchReason: "Optimal match for your active Tomato crop. Supports high-density vertical row farming.",
      priceForecast: {
        recommendation: "Buy Now",
        reason: "Seed supply projected to tighten next month ahead of the major sowing window, causing a 12% price hike.",
        trendData: [
          { month: "Mar", historicalPrice: 17.5 },
          { month: "Apr", historicalPrice: 17.8 },
          { month: "May", historicalPrice: 18.2 },
          { month: "Jun (Now)", historicalPrice: 18.5, projectedPrice: 18.5 },
          { month: "Jul (Proj)", historicalPrice: 20.2, projectedPrice: 20.2 },
          { month: "Aug (Proj)", historicalPrice: 21.0, projectedPrice: 21.0 }
        ]
      }
    },
    {
      id: "prod-2",
      name: "Bio-Organic Nitrogen Booster",
      category: "Fertilizers",
      price: 34.0,
      unit: "bag (25 kg)",
      rating: 4.6,
      reviewsCount: 52,
      reviews: [
        { author: "Sukhwinder S.", rating: 5, text: "Very gentle release. Leaf color improved in 5 days.", date: "2026-04-20" },
        { author: "Amit K.", rating: 4, text: "No burning compared to urea. Great organic supplement.", date: "2026-05-28" }
      ],
      supplier: "Prithvi Organic Inputs",
      certification: "NPOP National Organic Standard Certified",
      returnPolicy: "14-Day Unopened bag hassle-free returns",
      warranty: "Nutrient analysis guaranteed; 2-year chemical stability warranty",
      stockLevel: "In Stock",
      nearbyStock: [
        { dealer: "Amritsar Farmers Co-op", distance: 4.2, stock: 120, price: 33.5 },
        { dealer: "Gurdaspur Agro Hub", distance: 8.5, stock: 80, price: 34.0 }
      ],
      aiMatchReason: "Highly recommended for nitrogen replenishment in Clay Loam soil to prevent compaction yellowing.",
      priceForecast: {
        recommendation: "Wait",
        reason: "Global urea import subsidies starting in 10 days will drive down organic/inorganic fertilizer prices by ~10%.",
        trendData: [
          { month: "Mar", historicalPrice: 38.0 },
          { month: "Apr", historicalPrice: 36.5 },
          { month: "May", historicalPrice: 35.0 },
          { month: "Jun (Now)", historicalPrice: 34.0, projectedPrice: 34.0 },
          { month: "Jul (Proj)", historicalPrice: 31.2, projectedPrice: 31.2 },
          { month: "Aug (Proj)", historicalPrice: 30.5, projectedPrice: 30.5 }
        ]
      }
    },
    {
      id: "prod-3",
      name: "Copper-Shield Bio-Fungicide",
      category: "Pesticides",
      price: 22.8,
      unit: "bottle (1 Liter)",
      rating: 4.9,
      reviewsCount: 19,
      reviews: [
        { author: "Eswar R.", rating: 5, text: "Completely arrested my tomato early blight outbreak within 36 hours. Best copper formula.", date: "2026-06-15" }
      ],
      supplier: "Apex Plant Protection",
      certification: "Govt Insecticides Act Approved (No. G-9284)",
      returnPolicy: "Full refund if packaging seal arrives damaged",
      warranty: "24-month expiry from manufacturing date",
      stockLevel: "Low Stock",
      nearbyStock: [
        { dealer: "Gurdaspur Agro Hub", distance: 8.5, stock: 3, price: 24.0 },
        { dealer: "Precision Agri-Inputs Ludhiana", distance: 12.8, stock: 12, price: 22.8 }
      ],
      aiMatchReason: "Perfect match! Direct remediation target for suspected Tomato Early Blight pathogens.",
      priceForecast: {
        recommendation: "Strong Buy",
        reason: "Monsoon humidity spikes are initiating active fungal spore alerts across the region. Demand is surging, stocks are critical.",
        trendData: [
          { month: "Mar", historicalPrice: 21.0 },
          { month: "Apr", historicalPrice: 21.5 },
          { month: "May", historicalPrice: 22.0 },
          { month: "Jun (Now)", historicalPrice: 22.8, projectedPrice: 22.8 },
          { month: "Jul (Proj)", historicalPrice: 26.5, projectedPrice: 26.5 },
          { month: "Aug (Proj)", historicalPrice: 28.0, projectedPrice: 28.0 }
        ]
      }
    },
    {
      id: "prod-4",
      name: "Smart Micro-Drip Irrigation Kit",
      category: "Irrigation",
      price: 185.0,
      unit: "kit (covers 0.5 acre)",
      rating: 4.7,
      reviewsCount: 28,
      reviews: [
        { author: "Baldev D.", rating: 5, text: "Halved my water bills. Easy installation with push-fit components.", date: "2026-03-10" }
      ],
      supplier: "Neer-Agri Water Tech",
      certification: "BIS Certified (IS:12786) / Govt Subsidy Approved",
      returnPolicy: "30-Day trial returns (buyer pays shipping)",
      warranty: "3-Year UV degradation warranty on emitter lines & flow nodes",
      stockLevel: "In Stock",
      nearbyStock: [
        { dealer: "Precision Agri-Inputs Ludhiana", distance: 12.8, stock: 25, price: 180.0 }
      ],
      aiMatchReason: "Essential upgrade for your clay-loam sectors to avoid waterlogged root zones and root rot.",
      priceForecast: {
        recommendation: "Buy Now",
        reason: "Irrigation metal and polymer tariffs scheduled to rise next month. Prices stable now but set to increase by 8%.",
        trendData: [
          { month: "Mar", historicalPrice: 180.0 },
          { month: "Apr", historicalPrice: 182.0 },
          { month: "May", historicalPrice: 185.0 },
          { month: "Jun (Now)", historicalPrice: 185.0, projectedPrice: 185.0 },
          { month: "Jul (Proj)", historicalPrice: 198.0, projectedPrice: 198.0 },
          { month: "Aug (Proj)", historicalPrice: 200.0, projectedPrice: 200.0 }
        ]
      }
    },
    {
      id: "prod-5",
      name: "Premium Vermicompost Blend",
      category: "Organic",
      price: 15.0,
      unit: "bag (50 kg)",
      rating: 4.5,
      reviewsCount: 41,
      reviews: [
        { author: "Harman S.", rating: 5, text: "Excellent humic acid levels. Great soil conditioner.", date: "2026-05-30" }
      ],
      supplier: "GreenEarth Bio-Inputs",
      certification: "Vedic Farming Guild Certified Organic",
      returnPolicy: "No return on open soil/compost bags unless mold is present",
      warranty: "100% pure worm castings guaranteed; shelf stable for 6 months",
      stockLevel: "In Stock",
      nearbyStock: [
        { dealer: "Amritsar Farmers Co-op", distance: 4.2, stock: 300, price: 14.5 },
        { dealer: "Gurdaspur Agro Hub", distance: 8.5, stock: 110, price: 15.0 }
      ],
      aiMatchReason: "Will improve biological aeration and nutrient holding in hard clay loam soil layers.",
      priceForecast: {
        recommendation: "Wait",
        reason: "Local municipal compost processing plants are doubling capacity, creating a regional organic input surplus next month.",
        trendData: [
          { month: "Mar", historicalPrice: 16.5 },
          { month: "Apr", historicalPrice: 16.0 },
          { month: "May", historicalPrice: 15.5 },
          { month: "Jun (Now)", historicalPrice: 15.0, projectedPrice: 15.0 },
          { month: "Jul (Proj)", historicalPrice: 13.5, projectedPrice: 13.5 },
          { month: "Aug (Proj)", historicalPrice: 12.8, projectedPrice: 12.8 }
        ]
      }
    },
    {
      id: "prod-6",
      name: "Solar-Powered Ultrasonic Pest Repeller",
      category: "Equipment",
      price: 45.0,
      unit: "unit",
      rating: 4.4,
      reviewsCount: 15,
      reviews: [
        { author: "Kartar S.", rating: 4, text: "Keeps wild rodents away from grain stores quite effectively.", date: "2026-06-05" }
      ],
      supplier: "AgriShield Electronic Solutions",
      certification: "CE Certified / FCC Compliant",
      returnPolicy: "45-Day risk free trial. Full refund if pests don't diminish.",
      warranty: "2-Year full electrical & solar panel warranty replacement",
      stockLevel: "In Stock",
      nearbyStock: [
        { dealer: "Precision Agri-Inputs Ludhiana", distance: 12.8, stock: 15, price: 45.0 }
      ],
      aiMatchReason: "Recommended tool to protect grain assets and chore barns from vermin pressure.",
      priceForecast: {
        recommendation: "Buy Now",
        reason: "Component shortages are causing delayed imports. Price expected to remain steady but lead times will double.",
        trendData: [
          { month: "Mar", historicalPrice: 42.0 },
          { month: "Apr", historicalPrice: 43.5 },
          { month: "May", historicalPrice: 45.0 },
          { month: "Jun (Now)", historicalPrice: 45.0, projectedPrice: 45.0 },
          { month: "Jul (Proj)", historicalPrice: 45.0, projectedPrice: 45.0 },
          { month: "Aug (Proj)", historicalPrice: 46.5, projectedPrice: 46.5 }
        ]
      }
    }
  ];

  // States
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0].id);
  const [purchaseQty, setPurchaseQty] = useState<number>(10);
  const [deliverySpeed, setDeliverySpeed] = useState<"standard" | "express" | "drone">("standard");
  const [purchaseType, setPurchaseType] = useState<"one-time" | "subscription">("one-time");
  const [subscriptionInterval, setSubscriptionInterval] = useState<"monthly" | "quarterly">("monthly");
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [onlyAiMatches, setOnlyAiMatches] = useState<boolean>(false);

  // Selected product logic
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [selectedProductId]);

  // Bulk Discount Calculator Math
  const discountTier = useMemo(() => {
    if (purchaseQty >= 50) return { percent: 15, label: "Volume Super Discount (15% Off)" };
    if (purchaseQty >= 10) return { percent: 5, label: "Bulk Tier Discount (5% Off)" };
    return { percent: 0, label: "No bulk discount (< 10 units)" };
  }, [purchaseQty]);

  const deliveryCost = useMemo(() => {
    const base = deliverySpeed === "drone" ? 25.0 : deliverySpeed === "express" ? 12.5 : 4.99;
    return base;
  }, [deliverySpeed]);

  const subTotal = useMemo(() => {
    return selectedProduct.price * purchaseQty;
  }, [selectedProduct, purchaseQty]);

  const discountValue = useMemo(() => {
    return subTotal * (discountTier.percent / 100);
  }, [subTotal, discountTier]);

  const subscriptionDiscountValue = useMemo(() => {
    if (purchaseType === "subscription") {
      return (subTotal - discountValue) * 0.10; // extra 10% off for subscription
    }
    return 0;
  }, [purchaseType, subTotal, discountValue]);

  const grandTotal = useMemo(() => {
    return subTotal - discountValue - subscriptionDiscountValue + deliveryCost;
  }, [subTotal, discountValue, subscriptionDiscountValue, deliveryCost]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // AI matches matching current context (Tomato or Clay Loam or Blight)
      const matchesAi = !onlyAiMatches || 
        p.aiMatchReason.toLowerCase().includes("tomato") || 
        p.aiMatchReason.toLowerCase().includes("blight") || 
        p.aiMatchReason.toLowerCase().includes("clay loam") ||
        p.category === "Pesticides"; // copper fungicide always matched for blight
      
      return matchesCategory && matchesSearch && matchesAi;
    });
  }, [selectedCategory, searchTerm, onlyAiMatches]);

  // Smart Reorder Reminders Data
  const reorderReminders = useMemo(() => {
    const list = [];
    // Crop stage checks
    const tomatoCrop = activeCrops.find(c => c.name.toLowerCase().includes("tomato"));
    if (tomatoCrop) {
      list.push({
        id: "rem-1",
        crop: "Tomato",
        stage: tomatoCrop.stage,
        product: "Bio-Organic Nitrogen Booster",
        timing: "Due in 4 days",
        reason: `Your Tomatoes are in "${tomatoCrop.stage}" phase. To optimize nitrogen levels before flowering, apply organic boosters now.`
      });
    } else {
      // Default placeholder reminder if no tomato active
      list.push({
        id: "rem-1",
        crop: "Tomato (Planned)",
        stage: "Vegetative Sowing",
        product: "Bio-Organic Nitrogen Booster",
        timing: "Due in 3 days",
        reason: "Based on climate cycles and clay loam composition, soil nitrogen needs fortification prior to root elongation."
      });
    }

    if (activeDiseases.length > 0 || activeCrops.some(c => c.healthStatus.toLowerCase().includes("blight") || c.healthStatus.toLowerCase().includes("diseased"))) {
      list.push({
        id: "rem-2",
        crop: "Tomato",
        stage: "Defense Cycle",
        product: "Copper-Shield Bio-Fungicide",
        timing: "IMMEDIATE REORDER",
        reason: "Suspected Early Blight detected in sector. High humidity prediction indicates high pathogen dispersion vector. Stock depleted."
      });
    }

    list.push({
      id: "rem-3",
      crop: "Alluvial Field (Rotation)",
      stage: "Pre-Sowing Conditioning",
      product: "Premium Vermicompost Blend",
      timing: "Buy now for July delivery",
      reason: "Bulk compost deliveries require a 14-day booking buffer to secure government-subsidized shipping rates."
    });

    return list;
  }, [activeCrops, activeDiseases]);

  // Delivery estimation text
  const estimatedDeliveryDate = useMemo(() => {
    const today = new Date();
    let daysToAdd = 4;
    if (deliverySpeed === "drone") daysToAdd = 0; // Same day!
    else if (deliverySpeed === "express") daysToAdd = 1;
    
    today.setDate(today.getDate() + daysToAdd);
    
    if (deliverySpeed === "drone") {
      return "TODAY (Within 2 hours - autonomous drone delivery)";
    }
    return today.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  }, [deliverySpeed]);

  const handleCheckout = () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      setSuccessMsg(`✓ Successfully ordered ${purchaseQty} ${selectedProduct.unit} of "${selectedProduct.name}"! Total charged: $${grandTotal.toFixed(2)}. Delivery dispatched via ${deliverySpeed.toUpperCase()} payload.`);
      setTimeout(() => setSuccessMsg(""), 6000);
    }, 1200);
  };

  const handleAutoSchedule = (productName: string) => {
    alert(`[Autonomous Agent] Smart auto-delivery scheduler activated for "${productName}". The system will automatically place orders based on real-time soil nitrogen/moisture sensor levels.`);
  };

  return (
    <div id="smart-marketplace-module" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Upper Alerts & Smart Reminders Panel */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500 animate-bounce" />
            <div>
              <h3 className="text-xs uppercase font-black tracking-widest text-slate-300">Autonomous Reorder Engine</h3>
              <p className="text-[10px] text-slate-400 font-medium">Predictive input restocking based on real-time crop stage growth velocity & localized weather forecasts.</p>
            </div>
          </div>
          <span className="text-[9px] bg-slate-800 border border-slate-700 font-bold px-2.5 py-1 rounded-md text-slate-300">
            {reorderReminders.length} Active Reminders
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reorderReminders.map((rem) => (
            <div key={rem.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] uppercase font-black text-amber-400 tracking-wider">
                    {rem.crop} • {rem.stage}
                  </span>
                  <span className="text-[8px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded uppercase">
                    {rem.timing}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{rem.product}</h4>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{rem.reason}</p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const match = products.find(p => p.name === rem.product);
                    if (match) setSelectedProductId(match.id);
                  }}
                  className="flex-1 text-center py-1.5 bg-emerald-700 hover:bg-emerald-600 transition-colors text-[9px] font-bold rounded text-white cursor-pointer"
                >
                  Configure Order
                </button>
                <button
                  type="button"
                  onClick={() => handleAutoSchedule(rem.product)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 transition-colors text-[9px] font-bold rounded text-slate-300 cursor-pointer"
                  title="Auto-delivery based on sensor feedback"
                >
                  Auto-Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 font-semibold p-4 rounded-xl text-xs shadow-sm flex items-start gap-2 animate-bounce">
          <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: left column products list, right column detailed selected product */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PRODUCTS CATALOG SECTION (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            
            {/* Catalog Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="h-4.5 w-4.5 text-emerald-600" />
                  Smart Supplier Marketplace
                </h3>
                <p className="text-slate-400 text-[10px] mt-0.5">APEDA & NPOP certified inputs matched with localized diagnostic demands.</p>
              </div>

              {/* Toggle AI Recommendation Filter */}
              <button
                type="button"
                onClick={() => setOnlyAiMatches(!onlyAiMatches)}
                className={`text-[9px] font-extrabold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  onlyAiMatches 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {onlyAiMatches ? "Showing AI Matched Inputs" : "Show Only Farm Matches"}
              </button>
            </div>

            {/* Category selection pill rows */}
            <div className="flex flex-wrap gap-1.5">
              {["All", "Seeds", "Fertilizers", "Pesticides", "Equipment", "Irrigation", "Organic"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog by input name, supplier, crop suitability..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs font-semibold text-slate-700"
              />
            </div>

            {/* AI Recommendation Context Box if Blight or Tomato is active */}
            {(activeDiseases.length > 0 || activeCrops.length > 0) && (
              <div className="bg-gradient-to-r from-emerald-550/5 to-emerald-550/10 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5">
                <Sparkles className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black text-emerald-700 tracking-wider">Dynamic Agronomy Recommendation</span>
                  <p className="text-[10px] text-slate-700 font-semibold leading-relaxed">
                    Active disease markers <strong className="text-red-700 font-bold">({activeDiseases.join(", ") || "Early Blight"})</strong> and crop logs <strong className="text-emerald-800 font-bold">({activeCrops.map(c=>c.name).join(", ") || "Tomatoes"})</strong> require defensive biochemical copper shielding and nitrogen aeration compost to reinforce root density.
                  </p>
                </div>
              </div>
            )}

            {/* Grid of Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((prod) => {
                const isSelected = prod.id === selectedProductId;
                const isAiRecommended = prod.aiMatchReason.toLowerCase().includes("tomato") || 
                                        prod.aiMatchReason.toLowerCase().includes("blight") || 
                                        prod.category === "Pesticides";
                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md space-y-3 relative ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/10 ring-2 ring-emerald-600/20"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    {/* Badge Overlay */}
                    {isAiRecommended && (
                      <span className="absolute top-2.5 right-2.5 bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-emerald-200">
                        <Sparkles className="h-2 w-2" /> AI Match
                      </span>
                    )}

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-wide">{prod.category}</span>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug pr-12">{prod.name}</h4>
                      <p className="text-[9px] text-slate-500 font-bold">Supplier: {prod.supplier}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-black text-slate-900">${prod.price.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400">/ {prod.unit}</span>
                      </div>

                      {/* Ratings and reviews summary */}
                      <div className="flex items-center gap-1">
                        <div className="flex items-center text-amber-500">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span className="text-[10px] font-bold text-slate-700 ml-0.5">{prod.rating}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold">({prod.reviewsCount} reviews)</span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md ml-auto ${
                          prod.stockLevel === "In Stock" ? "bg-emerald-50 text-emerald-700" :
                          prod.stockLevel === "Low Stock" ? "bg-amber-50 text-amber-700 animate-pulse" :
                          "bg-red-50 text-red-700"
                        }`}>
                          {prod.stockLevel}
                        </span>
                      </div>
                    </div>

                    {/* Gov badge representation */}
                    <div className="border-t border-slate-100/70 pt-2 flex items-center justify-between text-[8px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Award className="h-3.5 w-3.5 text-emerald-600" />
                        Gov-Approved Badge
                      </span>
                      <span className="text-slate-500 font-semibold">{prod.certification.split(" ")[0]} Certified</span>
                    </div>

                  </div>
                );
              })}

              {filteredProducts.length === 0 && (
                <div className="col-span-2 text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No matching certified inputs found</p>
                  <p className="text-[10px] text-slate-400 mt-1">Try clearing your filters or resetting search parameters.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* SELECTED PRODUCT DETAILS SECTION (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Details Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Product Evaluation Suite</span>
                <span className="text-[9px] bg-slate-100 text-slate-600 font-extrabold px-2 py-0.5 rounded-full border border-slate-200">
                  ID: {selectedProduct.id}
                </span>
              </div>
              <h3 className="text-slate-900 font-black text-sm mt-1 leading-snug">{selectedProduct.name}</h3>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Dispatched by: <strong className="text-slate-700">{selectedProduct.supplier}</strong></p>
            </div>

            {/* Badges & Quality Indicators */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-2 text-xs">
                <Award className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[9px] uppercase font-black text-emerald-800 tracking-wider block">Government Quality Clearance</span>
                  <p className="text-[10px] text-slate-700 font-bold">{selectedProduct.certification}</p>
                </div>
              </div>
              <div className="border-t border-slate-200/50 my-2 pt-2 flex justify-between text-[10px]">
                <div className="flex items-center gap-1 text-slate-500">
                  <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                  <span>Return: <strong className="text-slate-700 font-bold">{selectedProduct.returnPolicy.split(" (")[0]}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                  <span>Warranty: <strong className="text-slate-700 font-bold">{selectedProduct.warranty.split(" ")[0]}</strong></span>
                </div>
              </div>
            </div>

            {/* Price Forecasting & Trends (AI FORECAST) */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-600" />
                  AI Price Forecasting Index
                </h4>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase ${
                  selectedProduct.priceForecast.recommendation === "Buy Now" || selectedProduct.priceForecast.recommendation === "Strong Buy"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {selectedProduct.priceForecast.recommendation}
                </span>
              </div>

              <div className="text-[10px] bg-slate-50/50 border border-slate-100 p-2.5 rounded-lg text-slate-600 leading-normal font-semibold">
                <span className="text-[9px] uppercase font-black text-slate-800 tracking-wider block mb-0.5">Predictive Recommendation:</span>
                {selectedProduct.priceForecast.reason}
              </div>

              {/* Price Trend Chart */}
              <div className="h-36 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={selectedProduct.priceForecast.trendData}
                    margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                    <YAxis stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                    <Tooltip contentStyle={{ fontSize: "9px", borderRadius: "6px" }} />
                    <Line type="monotone" name="Actual Price ($)" dataKey="historicalPrice" stroke="#059669" strokeWidth={2.5} activeDot={{ r: 4 }} />
                    <Line type="monotone" name="Projected Price ($)" dataKey="projectedPrice" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bulk Discount Calculator & Subscription Toggle */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-4">
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="h-4.5 w-4.5 text-emerald-600" />
                Pricing Configuration Matrix
              </h4>

              {/* Purchase Type Toggle (One-time vs Subscription) */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPurchaseType("one-time")}
                  className={`py-1.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                    purchaseType === "one-time"
                      ? "bg-white text-emerald-700 shadow-xs border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  One-time Order
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseType("subscription")}
                  className={`py-1.5 rounded-md text-[10px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    purchaseType === "subscription"
                      ? "bg-white text-emerald-700 shadow-xs border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Percent className="h-3 w-3 text-emerald-600" />
                  Subscribe (Save 10%)
                </button>
              </div>

              {/* Subscription Options */}
              {purchaseType === "subscription" && (
                <div className="bg-emerald-50/20 border border-emerald-100 p-3 rounded-lg space-y-2 text-xs">
                  <label className="block text-[9px] uppercase font-black text-emerald-800">Choose Delivery Interval</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSubscriptionInterval("monthly")}
                      className={`py-1 rounded text-[10px] font-bold ${
                        subscriptionInterval === "monthly" ? "bg-emerald-700 text-white" : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      Monthly Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubscriptionInterval("quarterly")}
                      className={`py-1 rounded text-[10px] font-bold ${
                        subscriptionInterval === "quarterly" ? "bg-emerald-700 text-white" : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      Quarterly Delivery
                    </button>
                  </div>
                </div>
              )}

              {/* Quantity Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500">Order Quantity:</span>
                  <span className="text-slate-900 font-extrabold">{purchaseQty} {selectedProduct.unit.split(" ")[0]}s</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={purchaseQty}
                  onChange={(e) => setPurchaseQty(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase">
                  <span>1 unit</span>
                  <span>10 units (5% off)</span>
                  <span>50+ units (15% off)</span>
                </div>
              </div>

              {/* Delivery Methods Panel */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-slate-500 text-[10px] font-bold">Autonomous Dispatch Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "standard", label: "Standard Truck", desc: "$4.99 • 3-5d" },
                    { id: "express", label: "Express Cargo", desc: "$12.50 • 1-2d" },
                    { id: "drone", label: "Drone-Drop", desc: "$25.00 • 2 hrs" }
                  ].map((speed) => (
                    <button
                      key={speed.id}
                      type="button"
                      onClick={() => setDeliverySpeed(speed.id as any)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        deliverySpeed === speed.id
                          ? "border-emerald-600 bg-emerald-50/20 text-emerald-800 ring-1 ring-emerald-500/25"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <span className="block text-[10px] font-black">{speed.label}</span>
                      <span className="block text-[8px] font-bold text-slate-400 mt-0.5">{speed.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-[10px] space-y-2">
                <div className="flex justify-between font-bold text-slate-600">
                  <span>Base Price ({purchaseQty} x ${selectedProduct.price.toFixed(2)}):</span>
                  <span>${subTotal.toFixed(2)}</span>
                </div>
                {discountValue > 0 && (
                  <div className="flex justify-between font-extrabold text-emerald-600">
                    <span>{discountTier.label}:</span>
                    <span>-${discountValue.toFixed(2)}</span>
                  </div>
                )}
                {subscriptionDiscountValue > 0 && (
                  <div className="flex justify-between font-extrabold text-blue-600">
                    <span>Subscription discount (10% Off):</span>
                    <span>-${subscriptionDiscountValue.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-600 border-t border-slate-200/40 pt-1.5">
                  <span className="flex items-center gap-1">
                    <Truck className="h-3 w-3 text-slate-400" />
                    Dispatch Logistics Mode:
                  </span>
                  <span>${deliveryCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total (Inc. Subsidies & Taxes):</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
                
                {/* Live Delivery Timeline Estimation */}
                <div className="border-t border-slate-200/50 pt-2 text-[9px] text-slate-400 font-bold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Est. Delivery: <strong className="text-slate-600">{estimatedDeliveryDate}</strong></span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isAddingToCart}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
              >
                {isAddingToCart ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Reserving allocation allocations...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Place Secure Order (${grandTotal.toFixed(2)})
                  </>
                )}
              </button>
            </div>

            {/* Nearby Availability Dealers Map Representation */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3.5">
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Map className="h-4.5 w-4.5 text-emerald-600" />
                Local Regional Inventory Map
              </h4>
              <p className="text-[10px] text-slate-400 leading-normal font-semibold">Closest approved retailers stock matching of selected certified input.</p>

              {/* Styled Mock Mini Map Grid */}
              <div className="h-28 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {/* Map style dots and grid overlays */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
                
                {/* Path Lines between dealers */}
                <svg className="absolute inset-0 w-full h-full text-emerald-200/60 pointer-events-none">
                  <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                  <line x1="80%" y1="70%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                </svg>

                {/* Main Farm representation */}
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="h-5 w-5 bg-emerald-600 text-white border-2 border-white rounded-full flex items-center justify-center shadow-md">
                    <Sprout className="h-3 w-3" />
                  </div>
                  <span className="text-[8px] font-black bg-emerald-900 text-white px-1 rounded shadow-xs mt-0.5">Your Farm</span>
                </div>

                {/* Dealer Amritsar Co-op */}
                <div className="absolute top-[20%] left-[15%] flex flex-col items-center">
                  <div className="h-4.5 w-4.5 bg-amber-500 text-white border border-white rounded-full flex items-center justify-center shadow-md animate-pulse">
                    <MapPin className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-[7px] font-bold bg-slate-800 text-slate-100 px-1 rounded shadow-xs mt-0.5">Amritsar (4.2km)</span>
                </div>

                {/* Dealer Precision Inputs */}
                <div className="absolute bottom-[20%] left-[70%] flex flex-col items-center">
                  <div className="h-4.5 w-4.5 bg-amber-500 text-white border border-white rounded-full flex items-center justify-center shadow-md">
                    <MapPin className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-[7px] font-bold bg-slate-800 text-slate-100 px-1 rounded shadow-xs mt-0.5">Ludhiana (12.8km)</span>
                </div>
              </div>

              {/* Retailers List */}
              <div className="space-y-2">
                {selectedProduct.nearbyStock.map((ns, nsIdx) => (
                  <div key={nsIdx} className="bg-slate-50 border border-slate-200/50 p-2.5 rounded-lg flex items-center justify-between text-[10px]">
                    <div>
                      <span className="font-bold text-slate-800 block">{ns.dealer}</span>
                      <span className="text-slate-400 font-semibold">{ns.distance} km away • Coordinates checked by GPS</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">${ns.price.toFixed(2)} / unit</span>
                      <span className="text-emerald-700 font-extrabold">{ns.stock} units available</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supplier Ratings & Reviews */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                Supplier Performance & Peer Reviews
              </h4>

              <div className="space-y-3.5">
                {selectedProduct.reviews.map((rev, rIdx) => (
                  <div key={rIdx} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 space-y-1 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-700">{rev.author}</span>
                      <span className="text-slate-400 font-bold">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star key={starIdx} className={`h-3 w-3 ${starIdx < rev.rating ? "fill-amber-500" : "text-slate-200"}`} />
                      ))}
                    </div>
                    <p className="text-slate-600 leading-normal italic font-medium">"{rev.text}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
