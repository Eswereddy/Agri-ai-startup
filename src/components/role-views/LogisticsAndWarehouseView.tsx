import React, { useState } from "react";
import {
  Truck,
  Layers,
  Thermometer,
  Wind,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Fan,
  Activity,
  Plus,
  Scale
} from "lucide-react";
import { LogisticsRoute, WarehouseSilo, UserRole } from "../../types";

interface LogisticsAndWarehouseViewProps {
  activeRole: UserRole;
  routes: LogisticsRoute[];
  silos: WarehouseSilo[];
  onAddRoute: (newRoute: LogisticsRoute) => void;
  onUpdateRoute: (id: string, updated: Partial<LogisticsRoute>) => void;
  onUpdateSilo: (id: string, updated: Partial<WarehouseSilo>) => void;
}

export default function LogisticsAndWarehouseView({
  activeRole,
  routes,
  silos,
  onAddRoute,
  onUpdateRoute,
  onUpdateSilo
}: LogisticsAndWarehouseViewProps) {
  // Logistics form state
  const [driverName, setDriverName] = useState("David Miller");
  const [cargo, setCargo] = useState("Premium Basmati Rice Grade-A");
  const [weight, setWeight] = useState(4500);
  const [origin, setOrigin] = useState("Punjab Agri Cooperative");
  const [destination, setDestination] = useState("Silo Terminal 4B");

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim()) return;

    const newRoute: LogisticsRoute = {
      id: `route-${Date.now()}`,
      driverName,
      cargo,
      weight,
      origin,
      destination,
      tempCelsius: 4.2,
      status: "In Transit",
      progress: 10
    };
    onAddRoute(newRoute);
  };

  const handleAerate = (id: string) => {
    // Action: Silo aeration cools the grain down and lowers humidity
    onUpdateSilo(id, {
      tempCelsius: 14.5,
      humidityPercent: 11.2,
      status: "Optimal"
    });
    alert("Industrial silo fan cooling and aeration cycles triggered successfully.");
  };

  // RENDER LOGISTICS VIEW
  if (activeRole === UserRole.LOGISTICS) {
    return (
      <div id="logistics-workspace" className="space-y-6 animate-in fade-in">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-800/60 rounded-xl">
                <Truck className="h-6 w-6 text-blue-200" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Cold Chain & Logistics Control</h2>
            </div>
            <p className="text-blue-100/90 text-xs max-w-xl">
              Track refrigerated freight fleets, monitor cargo temperatures to extend agricultural shelf-life, and optimize dispatch pathways from farms to marine ports.
            </p>
          </div>
          <div className="flex gap-4 text-center">
            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
              <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Active Fleet</p>
              <p className="text-lg font-bold">{routes.length} Reefers</p>
            </div>
            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
              <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Cold Integrity</p>
              <p className="text-lg font-bold">100% SLA</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Dispatch Reefer Form */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Plus className="h-4.5 w-4.5 text-blue-600" />
              Dispatch Reefer Cargo
            </h3>

            <form onSubmit={handleAddRoute} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Driver & Vehicle ID</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Cargo Type</label>
                  <input
                    type="text"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Cargo Weight</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Origin Point</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs"
                  />
                </div>
              </div>

              <button
                id="logistics-dispatch-btn"
                type="submit"
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Launch Transit Pipeline
              </button>
            </form>
          </div>

          {/* Transit Map / Tracker */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-3">
              Fleet Tracking and Cold Chain Monitoring
            </h3>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {routes.map((route) => (
                <div key={route.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{route.cargo}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Driver: {route.driverName} • Route ID: {route.id}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-700 rounded uppercase">
                        {route.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-white border border-slate-100 p-2.5 rounded-lg text-center text-xs">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Transit Corridor</p>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5 truncate">{route.origin} → {route.destination}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Reefer Temp</p>
                      <p className={`text-xs font-bold mt-0.5 ${route.tempCelsius > 8 ? "text-amber-600 animate-pulse" : "text-emerald-600"}`}>
                        {route.tempCelsius}°C
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Load Weight</p>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{(route.weight / 1000).toFixed(1)} Tons</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>Delivery Path Completion</span>
                      <span>{route.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${route.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-[10px] font-bold">
                    {route.status === "In Transit" && (
                      <button
                        onClick={() => onUpdateRoute(route.id, { progress: 100, status: "Delivered", tempCelsius: 14.5 })}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded cursor-pointer"
                      >
                        Confirm Safe Cargo Landing
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER WAREHOUSE OPERATOR VIEW
  return (
    <div id="warehouse-workspace" className="space-y-6 animate-in fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-700/50 rounded-xl">
              <Layers className="h-6 w-6 text-blue-200" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Silo Storage and Airflow Analytics</h2>
          </div>
          <p className="text-blue-100/90 text-xs max-w-xl">
            Audit grain terminal capacities, track humidity logs to prevent aflatoxin contamination, and manage automated grain drying/aeration fans remotely.
          </p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
            <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Total Storage Capacity</p>
            <p className="text-lg font-bold">12,000 Tons</p>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
            <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Average Moisture</p>
            <p className="text-lg font-bold">11.8%</p>
          </div>
        </div>
      </div>

      {/* Silo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {silos.map((silo) => (
          <div key={silo.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-blue-200 transition-colors">
            <div className="space-y-3.5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{silo.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Storage: {silo.grainType || "Empty"}</p>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                  silo.status === "Optimal" ? "bg-emerald-50 text-emerald-700" : silo.status === "Warning" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700 animate-pulse"
                }`}>
                  {silo.status}
                </span>
              </div>

              {/* Silo visual fill bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>Capacity Filled</span>
                  <span>{Math.round((silo.currentFillTons / silo.capacityTons) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-6 rounded-lg relative overflow-hidden border border-slate-200">
                  <div
                    className="bg-blue-500 h-full absolute left-0 bottom-0 transition-all duration-500"
                    style={{ width: `${(silo.currentFillTons / silo.capacityTons) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-slate-700 z-10">
                    {silo.currentFillTons} / {silo.capacityTons} Tons
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-xs text-center">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Temperature</p>
                  <p className={`text-xs font-bold mt-0.5 ${silo.tempCelsius > 22 ? "text-rose-500 font-extrabold" : "text-slate-700"}`}>{silo.tempCelsius}°C</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Grain Moisture</p>
                  <p className={`text-xs font-bold mt-0.5 ${silo.humidityPercent > 14 ? "text-amber-600 font-extrabold" : "text-slate-700"}`}>{silo.humidityPercent}%</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleAerate(silo.id)}
                className="w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Fan className="h-3.5 w-3.5 animate-spin" />
                Trigger Aeration & Drying cycle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
