import React, { useState } from "react";
import {
  Tag,
  Package,
  Wrench,
  BarChart,
  ShoppingBag,
  TrendingUp,
  Sliders,
  DollarSign,
  Briefcase,
  Layers,
  ArrowUpRight,
  AlertCircle
} from "lucide-react";
import { SupplierItem } from "../../types";

interface SupplierViewProps {
  items: SupplierItem[];
  onUpdateItem: (id: string, updated: Partial<SupplierItem>) => void;
}

export default function SupplierView({ items, onUpdateItem }: SupplierViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempStock, setTempStock] = useState<number>(0);

  const categories = ["All", "Seeds", "Fertilizers", "IoT Sensors", "Machinery"];

  const filteredItems = selectedCategory === "All"
    ? items
    : items.filter(item => item.category === selectedCategory);

  const startEdit = (item: SupplierItem) => {
    setEditingId(item.id);
    setTempPrice(item.price);
    setTempStock(item.stock);
  };

  const saveEdit = (id: string) => {
    onUpdateItem(id, { price: tempPrice, stock: tempStock });
    setEditingId(null);
  };

  return (
    <div id="supplier-workspace" className="space-y-6">
      {/* Supplier Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-700/50 rounded-xl">
              <Package className="h-6 w-6 text-teal-200" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Agricultural Input Storefront</h2>
          </div>
          <p className="text-teal-100/90 text-xs max-w-xl">
            Distribute state-certified hybrid seeds, bio-fertilizers, solar-powered drip kits, and advanced IoT telemetry soil probes to cooperatives worldwide. Monitor warehouse levels and update market prices.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <p className="text-[10px] text-teal-200 uppercase tracking-widest font-semibold">Store Items</p>
            <p className="text-lg font-bold">{items.length} SKUs</p>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <p className="text-[10px] text-teal-200 uppercase tracking-widest font-semibold">Critical Stock</p>
            <p className="text-lg font-bold">{items.filter((item) => item.stock < 15).length} Items</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Inventory Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Filter and Supply Stats */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-6">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-3">
              Input Categories
            </h3>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full">
                    {cat === "All" ? items.length : items.filter((i) => i.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" /> Stock Warnings
            </h4>
            <p className="text-[10px] text-amber-700 mt-1 leading-relaxed">
              Verify your inventory levels. High demand is expected for certified drought-resilient millets and nitrogen-release organic compost next week.
            </p>
          </div>
        </div>

        {/* Product SKU Table / Grid */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-teal-600" />
              SKU Inventory Controls
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">
              Prices in USD
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-2.5 font-bold">Product Name</th>
                  <th className="py-2.5 font-bold">Category</th>
                  <th className="py-2.5 font-bold text-center">Rating</th>
                  <th className="py-2.5 font-bold">Price</th>
                  <th className="py-2.5 font-bold">In-Stock</th>
                  <th className="py-2.5 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 font-medium">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="text-slate-700 hover:bg-slate-50/50">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1 bg-slate-100 rounded-lg text-slate-600 font-bold">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{item.name}</p>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[11px] text-slate-500 font-semibold">{item.category}</td>
                    <td className="py-3 text-center text-amber-500 font-bold">★ {item.rating}</td>
                    <td className="py-3">
                      {editingId === item.id ? (
                        <div className="relative max-w-[80px]">
                          <span className="absolute left-1.5 top-1 text-slate-400">$</span>
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-800 pl-4"
                          />
                        </div>
                      ) : (
                        <span className="text-slate-800 font-bold">${item.price}</span>
                      )}
                    </td>
                    <td className="py-3">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          value={tempStock}
                          onChange={(e) => setTempStock(parseInt(e.target.value) || 0)}
                          className="max-w-[70px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-800"
                        />
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.stock < 15 ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"
                        }`}>
                          {item.stock} left
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {editingId === item.id ? (
                        <button
                          onClick={() => saveEdit(item.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(item)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Adjust SKU
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
