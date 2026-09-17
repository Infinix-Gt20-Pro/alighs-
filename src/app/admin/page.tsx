// src/app/admin/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck, Package, Calendar, Phone, MessageCircle, Clock,
  RefreshCw, Search, CheckCircle2, Truck, ExternalLink, Lock,
  LogOut, MapPin, TrendingUp, Archive, Plus, Trash2, Pencil,
  AlertTriangle, X, ChevronDown, ChevronUp, Layers
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  productId?: string;
  name: string;
  color?: string;
  quantity: number;
  price: number;
}

interface OrderRecord {
  orderId: string;
  customer: { name: string; phone: string; email?: string; city: string; address: string; pincode: string; };
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  orderStatus: "placed" | "confirmed" | "shipped" | "delivered";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  isOfflineMode?: boolean;
}

interface AppointmentRecord {
  appointmentId: string;
  name: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  concern: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  frameShape?: string;
  brand?: string;
  sku?: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  colors?: string[];
  notes?: string;
  updatedAt: string;
}

const CATEGORIES = ["Eyeglasses", "Sunglasses", "Computer Glasses", "Kids Glasses", "Sports Glasses", "Lens Only", "Accessories"];
const FRAME_SHAPES = ["Rectangle", "Round", "Oval", "Square", "Cat-Eye", "Aviator", "Clubmaster", "Hexagonal", "Wayfarer", "Rimless"];

// ─── Blank Inventory Form ─────────────────────────────────────────────────────
const blankForm = (): Partial<InventoryItem> => ({
  name: "", category: "Eyeglasses", frameShape: "Rectangle", brand: "ALIG'S WARE",
  sku: "", price: 0, stock: 0, lowStockThreshold: 5, colors: [], notes: "",
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"orders" | "appointments" | "inventory">("orders");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Inventory state
  const [invSearch, setInvSearch] = useState("");
  const [invCategory, setInvCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryItem>>(blankForm());
  const [colorInput, setColorInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [stockEditId, setStockEditId] = useState<string | null>(null);
  const [stockEditVal, setStockEditVal] = useState<number>(0);

  // Check persisted auth
  useEffect(() => {
    const saved = localStorage.getItem("aligs_admin_authenticated");
    if (saved === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPin = pinInput.trim();
    if (["786", "6396", "7217", "1499", "admin"].includes(cleanPin)) {
      setIsAuthenticated(true);
      localStorage.setItem("aligs_admin_authenticated", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect Passcode. Enter 786 or 6396");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("aligs_admin_authenticated");
    setPinInput("");
  };

  // ─── Fetch Data ─────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resOrders, resApts, resInv] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/appointments"),
        fetch("/api/inventory"),
      ]);
      if (resOrders.ok) { const d = await resOrders.json(); setOrders(d.orders || []); }
      if (resApts.ok)   { const d = await resApts.json();   setAppointments(d.appointments || []); }
      if (resInv.ok)    { const d = await resInv.json();    setInventory(d.items || []); }
    } catch (err) { console.error("Error fetching admin data:", err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (isAuthenticated) fetchData(); }, [isAuthenticated, fetchData]);

  // ─── Order Actions ───────────────────────────────────────────────────────────
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      });
      if (res.ok) setOrders((prev) => prev.map((o) => o.orderId === orderId ? { ...o, orderStatus: newStatus as OrderRecord["orderStatus"] } : o));
    } catch (err) { console.error(err); }
    finally { setUpdatingId(null); }
  };

  // ─── Appointment Actions ─────────────────────────────────────────────────────
  const handleUpdateAptStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, status: newStatus }),
      });
      if (res.ok) setAppointments((prev) => prev.map((a) => a.appointmentId === appointmentId ? { ...a, status: newStatus as AppointmentRecord["status"] } : a));
    } catch (err) { console.error(err); }
  };

  // ─── Inventory Actions ───────────────────────────────────────────────────────
  const handleSaveInventory = async () => {
    if (!formData.name || !formData.category) return;
    setSaving(true);
    try {
      const method = editingItem ? "PATCH" : "POST";
      const payload = editingItem ? { ...formData, id: editingItem.id } : formData;
      const res = await fetch("/api/inventory", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const saved = await res.json();
        if (editingItem) {
          setInventory((prev) => prev.map((i) => i.id === editingItem.id ? (saved.item || saved) : i));
        } else {
          setInventory((prev) => [saved, ...prev]);
        }
        setShowAddForm(false);
        setEditingItem(null);
        setFormData(blankForm());
        setColorInput("");
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDeleteInventory = async (id: string) => {
    if (!confirm("Yeh product inventory se delete kar dein?")) return;
    const res = await fetch(`/api/inventory?id=${id}`, { method: "DELETE" });
    if (res.ok) setInventory((prev) => prev.filter((i) => i.id !== id));
  };

  const handleQuickStockSave = async (id: string) => {
    const res = await fetch("/api/inventory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stock: stockEditVal, stockOnly: true }),
    });
    if (res.ok) {
      setInventory((prev) => prev.map((i) => i.id === id ? { ...i, stock: stockEditVal } : i));
      setStockEditId(null);
    }
  };

  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setColorInput("");
    setShowAddForm(true);
  };

  const addColor = () => {
    const c = colorInput.trim();
    if (c && !(formData.colors || []).includes(c)) {
      setFormData((p) => ({ ...p, colors: [...(p.colors || []), c] }));
    }
    setColorInput("");
  };

  const removeColor = (c: string) => setFormData((p) => ({ ...p, colors: (p.colors || []).filter((x) => x !== c) }));

  // ─── Computed Values ─────────────────────────────────────────────────────────
  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0), [orders]);
  const pendingOrdersCount = useMemo(() => orders.filter((o) => o.orderStatus === "placed" || o.orderStatus === "confirmed").length, [orders]);
  const lowStockCount = useMemo(() => inventory.filter((i) => i.stock <= i.lowStockThreshold).length, [inventory]);

  const filteredOrders = useMemo(() => orders.filter((o) => {
    const mf = statusFilter === "all" || o.orderStatus === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const ms = !q || o.orderId.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.phone.includes(q) || o.customer.city.toLowerCase().includes(q);
    return mf && ms;
  }), [orders, statusFilter, searchQuery]);

  const filteredInventory = useMemo(() => inventory.filter((i) => {
    const mc = invCategory === "all" || i.category === invCategory;
    const q = invSearch.toLowerCase().trim();
    const ms = !q || i.name.toLowerCase().includes(q) || (i.brand || "").toLowerCase().includes(q) || (i.sku || "").toLowerCase().includes(q);
    return mc && ms;
  }), [inventory, invCategory, invSearch]);

  // ─── Login Screen ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center p-4 selection:bg-amber-500/30">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c0d12]/90 border border-amber-400/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center mx-auto mb-5 shadow-[0_0_25px_rgba(212,175,55,0.4)]">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold tracking-wider text-white">ALIG&apos;S WARE</h1>
          <p className="text-xs font-mono text-amber-300 uppercase tracking-widest mt-1 mb-6">Atelier Management &bull; Orders Portal</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1.5">Enter Passcode / PIN</label>
              <input
                type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="••••"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 font-mono text-center text-lg tracking-widest" autoFocus
              />
              {authError && <p className="text-xs text-rose-400 mt-1.5 font-mono text-center">{authError}</p>}
            </div>
            <button type="submit" className="cursor-pointer w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-98 transition-all">
              Unlock Dashboard
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-2.5">
            <button onClick={() => { setIsAuthenticated(true); localStorage.setItem("aligs_admin_authenticated", "true"); }}
              className="cursor-pointer text-xs font-mono text-amber-300/80 hover:text-amber-300 underline underline-offset-4">
              ✦ Quick Access for Dr. Sheeraz Ahmad
            </button>
            <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors font-mono">&larr; Return to Storefront</Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-amber-500/30 selection:text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0c0d12]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-cinzel text-lg font-bold tracking-wider text-white group-hover:text-amber-300 transition-colors">ALIG&apos;S WARE</span>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">Backoffice Dashboard</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={fetchData} disabled={loading}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link href="/" target="_blank" className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all">
              <span>View Store</span><ExternalLink className="w-3 h-3 text-neutral-400" />
            </Link>
            <button onClick={handleLogout} className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-mono text-rose-300 transition-all">
              <LogOut className="w-3.5 h-3.5" /><span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {[
            { label: "Total Orders", value: orders.length, sub: "Lifetime store orders", icon: <Package className="w-4 h-4 text-amber-400" />, color: "text-white" },
            { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, sub: "From customer bookings", icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, color: "text-amber-300" },
            { label: "Pending Dispatch", value: pendingOrdersCount, sub: "Requires packing", icon: <Truck className="w-4 h-4 text-amber-400" />, color: "text-amber-400" },
            { label: "Appointments", value: appointments.length, sub: "Dr. Sheeraz patients", icon: <Calendar className="w-4 h-4 text-cyan-400" />, color: "text-cyan-300" },
            { label: "Low Stock", value: lowStockCount, sub: `of ${inventory.length} products`, icon: <AlertTriangle className="w-4 h-4 text-rose-400" />, color: lowStockCount > 0 ? "text-rose-400" : "text-emerald-400" },
          ].map((kpi) => (
            <div key={kpi.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider">{kpi.label}</span>
                {kpi.icon}
              </div>
              <div className={`text-2xl font-bold font-mono ${kpi.color}`}>{kpi.value}</div>
              <span className="text-[10px] font-mono text-neutral-500 mt-1 block">{kpi.sub}</span>
            </div>
          ))}
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: "orders", label: `Customer Orders (${orders.length})`, icon: <Package className="w-3.5 h-3.5" />, active: "from-amber-400 to-amber-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]" },
              { key: "appointments", label: `Appointments (${appointments.length})`, icon: <Calendar className="w-3.5 h-3.5" />, active: "from-cyan-400 to-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" },
              { key: "inventory", label: `Inventory (${inventory.length})${lowStockCount > 0 ? ` ⚠ ${lowStockCount}` : ""}`, icon: <Archive className="w-3.5 h-3.5" />, active: "from-violet-400 to-violet-500 text-black shadow-[0_0_15px_rgba(139,92,246,0.4)]" },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === tab.key ? `bg-gradient-to-r ${tab.active} font-bold` : "bg-white/[0.04] text-neutral-400 hover:text-white border border-white/10"
                }`}>
                {tab.icon}<span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab-specific toolbar */}
          {activeTab === "orders" && (
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                <input type="text" placeholder="Search name, phone, order ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400 cursor-pointer">
                <option value="all">All Statuses</option>
                <option value="placed">Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-52">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                <input type="text" placeholder="Search products..." value={invSearch} onChange={(e) => setInvSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-400 font-mono" />
              </div>
              <select value={invCategory} onChange={(e) => setInvCategory(e.target.value)}
                className="bg-black/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none cursor-pointer">
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={() => { setShowAddForm(true); setEditingItem(null); setFormData(blankForm()); setColorInput(""); }}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/50 text-violet-300 text-xs font-mono transition-all whitespace-nowrap">
                <Plus className="w-3.5 h-3.5" /><span>Add Product</span>
              </button>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════ TAB: ORDERS */}
        {activeTab === "orders" && (
          <div>
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10">
                <Package className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-lg font-cinzel text-white">No Orders Found</h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  {searchQuery || statusFilter !== "all" ? "Try clearing your search query or status filter." : "Jab koi customer naya order place karega, uski details automatically yahan aa jayengi."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent";
                  const isDelivered = order.orderStatus === "delivered";
                  const isShipped = order.orderStatus === "shipped";
                  const isConfirmed = order.orderStatus === "confirmed";
                  const whatsappMsg = encodeURIComponent(`Hello ${order.customer.name}! Greetings from ALIG'S WARE.\nRegarding your eyewear order *${order.orderId}* of ₹${order.totalAmount}:\nWe are preparing your package under Dr. Sheeraz Ahmad's care. Please let us know if you need any assistance.`);
                  return (
                    <div key={order.orderId} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-amber-400/30 transition-all shadow-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-white/10 gap-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono font-bold text-amber-400 text-sm sm:text-base tracking-wider">{order.orderId}</span>
                          <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1"><Clock className="w-3 h-3 text-neutral-500" />{dateStr}</span>
                          {order.isOfflineMode && <span className="text-[9px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">Cached</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-neutral-400 uppercase">Status:</span>
                          <select value={order.orderStatus || "placed"} disabled={updatingId === order.orderId}
                            onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                            className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold border cursor-pointer focus:outline-none transition-all ${isDelivered ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : isShipped ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" : isConfirmed ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-amber-500/20 text-amber-300 border-amber-500/40"}`}>
                            <option value="placed" className="bg-neutral-900 text-amber-300">Placed (Pending)</option>
                            <option value="confirmed" className="bg-neutral-900 text-cyan-300">Confirmed</option>
                            <option value="shipped" className="bg-neutral-900 text-indigo-300">Shipped (In Transit)</option>
                            <option value="delivered" className="bg-neutral-900 text-emerald-300">Delivered</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-4">
                        <div className="md:col-span-5 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-white">{order.customer.name}</span>
                            <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded-full bg-white/[0.04]">{order.customer.city}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                            <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" /><span>+91 {order.customer.phone}</span>
                          </div>
                          {order.customer.email && <div className="text-xs text-neutral-400 font-mono">{order.customer.email}</div>}
                          <div className="flex items-start gap-1.5 text-xs text-neutral-400 pt-1">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{order.customer.address}, {order.customer.city} - {order.customer.pincode}</span>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <a href={`https://wa.me/91${order.customer.phone}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-mono transition-all">
                              <MessageCircle className="w-3.5 h-3.5" /><span>WhatsApp Customer</span>
                            </a>
                            <a href={`tel:+91${order.customer.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-300 transition-all">
                              <Phone className="w-3.5 h-3.5" /><span>Call</span>
                            </a>
                          </div>
                        </div>
                        <div className="md:col-span-7 bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-2">Ordered Items ({order.items.length}):</span>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-none">
                                  <div>
                                    <span className="text-white font-medium">{item.name}</span>
                                    <span className="text-[11px] font-mono text-amber-300/80 ml-2">({item.color})</span>
                                  </div>
                                  <div className="font-mono text-right">
                                    <span className="text-neutral-400 mr-2">x{item.quantity}</span>
                                    <span className="text-white font-semibold">₹{item.price * item.quantity}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                            <div><span className="text-neutral-500 uppercase">Payment: </span><span className="text-amber-300 font-bold uppercase">{order.paymentMethod}</span></div>
                            <div><span className="text-neutral-400 mr-2">Grand Total:</span><span className="text-base font-bold text-amber-400">₹{order.totalAmount}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════ TAB: APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div>
            {appointments.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10">
                <Calendar className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-lg font-cinzel text-white">No Clinic Appointments Yet</h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">Patients booking eye checks or frame fittings with Dr. Sheeraz will show up here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => {
                  const dateStr = apt.preferredDate ? new Date(apt.preferredDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Flexible";
                  return (
                    <div key={apt.appointmentId} className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm sm:text-base">{apt.name}</span>
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">{apt.concern}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono text-neutral-300">
                          <span className="flex items-center gap-1 text-amber-300"><Calendar className="w-3 h-3" />{dateStr}</span>
                          <span className="flex items-center gap-1 text-neutral-400"><Clock className="w-3 h-3" />{apt.preferredTime}</span>
                          <span className="text-neutral-400">&bull; +91 {apt.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <a href={`https://wa.me/91${apt.phone}?text=Hello%20${encodeURIComponent(apt.name)},%20confirming%20your%20appointment%20with%20Dr.%20Sheeraz%20Ahmad%20at%20ALIG'S%20WARE%20Clinic.`}
                          target="_blank" rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-mono flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5" /><span>WhatsApp</span>
                        </a>
                        <select value={apt.status || "confirmed"} onChange={(e) => handleUpdateAptStatus(apt.appointmentId, e.target.value)}
                          className="bg-neutral-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none cursor-pointer">
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ TAB: INVENTORY */}
        {activeTab === "inventory" && (
          <div>
            {/* ADD / EDIT FORM */}
            {showAddForm && (
              <div className="mb-6 p-5 rounded-2xl bg-violet-500/5 border border-violet-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-mono font-bold text-violet-300 uppercase tracking-wider">
                    {editingItem ? "✦ Edit Product" : "✦ Add New Product"}
                  </h3>
                  <button onClick={() => { setShowAddForm(false); setEditingItem(null); setFormData(blankForm()); }}
                    className="cursor-pointer p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Name */}
                  <div className="lg:col-span-2">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Product Name *</label>
                    <input type="text" placeholder="e.g. Titanium Aviator Gold Frame"
                      value={formData.name || ""} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-violet-400 font-mono" />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">SKU / Code</label>
                    <input type="text" placeholder="e.g. AW-EG-001"
                      value={formData.sku || ""} onChange={(e) => setFormData((p) => ({ ...p, sku: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-violet-400 font-mono" />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Category *</label>
                    <select value={formData.category || "Eyeglasses"} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-400 font-mono cursor-pointer">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Frame Shape */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Frame Shape</label>
                    <select value={formData.frameShape || "Rectangle"} onChange={(e) => setFormData((p) => ({ ...p, frameShape: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-400 font-mono cursor-pointer">
                      {FRAME_SHAPES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Brand</label>
                    <input type="text" placeholder="ALIG'S WARE"
                      value={formData.brand || ""} onChange={(e) => setFormData((p) => ({ ...p, brand: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-violet-400 font-mono" />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Price (₹) *</label>
                    <input type="number" placeholder="1999" min={0}
                      value={formData.price || ""} onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-violet-400 font-mono" />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Stock Quantity *</label>
                    <input type="number" placeholder="10" min={0}
                      value={formData.stock ?? ""} onChange={(e) => setFormData((p) => ({ ...p, stock: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-violet-400 font-mono" />
                  </div>

                  {/* Low Stock Threshold */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Low Stock Alert When &lt;</label>
                    <input type="number" placeholder="5" min={1}
                      value={formData.lowStockThreshold || ""} onChange={(e) => setFormData((p) => ({ ...p, lowStockThreshold: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-violet-400 font-mono" />
                  </div>

                  {/* Colors */}
                  <div className="lg:col-span-2">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Colors Available</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="e.g. Matte Black" value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); } }}
                        className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-violet-400 font-mono" />
                      <button onClick={addColor} type="button"
                        className="cursor-pointer px-3 py-2 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-mono hover:bg-violet-500/30 transition-all">
                        Add
                      </button>
                    </div>
                    {(formData.colors || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(formData.colors || []).map((c) => (
                          <span key={c} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-mono text-neutral-300">
                            {c}<button onClick={() => removeColor(c)} className="cursor-pointer text-neutral-500 hover:text-rose-400 ml-0.5"><X className="w-2.5 h-2.5" /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="lg:col-span-3">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Notes / Description</label>
                    <input type="text" placeholder="e.g. Blue-Cut 420nm, Anti-Glare Sapphire coating"
                      value={formData.notes || ""} onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-violet-400 font-mono" />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                  <button onClick={handleSaveInventory} disabled={saving || !formData.name}
                    className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {saving ? "Saving..." : editingItem ? "Update Product" : "Add to Inventory"}
                  </button>
                  <button onClick={() => { setShowAddForm(false); setEditingItem(null); setFormData(blankForm()); }}
                    className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-400 hover:text-white transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Inventory Table */}
            {filteredInventory.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10">
                <Archive className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-lg font-cinzel text-white">Inventory Khali Hai</h3>
                <p className="text-xs text-neutral-400 font-mono mt-1 mb-4">Apne eyewear products add karein toh stock track ho sake.</p>
                <button onClick={() => { setShowAddForm(true); setEditingItem(null); setFormData(blankForm()); }}
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 text-violet-300 text-xs font-mono transition-all">
                  <Plus className="w-4 h-4" />Pehla Product Add Karein
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-white/[0.04] border-b border-white/10 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1 text-right">Price</div>
                  <div className="col-span-2 text-center">Stock</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-white/[0.05]">
                  {filteredInventory.map((item) => {
                    const isLow = item.stock <= item.lowStockThreshold;
                    const isOut = item.stock === 0;
                    return (
                      <div key={item.id} className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-white/[0.02] transition-colors items-center">
                        {/* Product name + sku */}
                        <div className="col-span-4">
                          <div className="text-sm font-medium text-white leading-tight">{item.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {item.sku && <span className="text-[10px] font-mono text-neutral-500">{item.sku}</span>}
                            {item.frameShape && <span className="text-[10px] font-mono text-violet-400/80">{item.frameShape}</span>}
                            {(item.colors || []).length > 0 && (
                              <span className="text-[10px] text-neutral-500 font-mono">• {item.colors!.slice(0, 2).join(", ")}{item.colors!.length > 2 ? ` +${item.colors!.length - 2}` : ""}</span>
                            )}
                          </div>
                        </div>

                        {/* Category */}
                        <div className="col-span-2">
                          <span className="text-[11px] font-mono text-neutral-300 bg-white/[0.05] px-2 py-0.5 rounded-full">{item.category}</span>
                        </div>

                        {/* Price */}
                        <div className="col-span-1 text-right font-mono text-sm font-semibold text-amber-300">₹{item.price.toLocaleString()}</div>

                        {/* Stock — inline edit */}
                        <div className="col-span-2 flex items-center justify-center">
                          {stockEditId === item.id ? (
                            <div className="flex items-center gap-1">
                              <input type="number" min={0} value={stockEditVal} onChange={(e) => setStockEditVal(Number(e.target.value))}
                                className="w-14 px-2 py-1 rounded-lg bg-white/[0.06] border border-violet-400/50 text-xs text-white font-mono text-center focus:outline-none" autoFocus />
                              <button onClick={() => handleQuickStockSave(item.id)}
                                className="cursor-pointer p-1 rounded-lg bg-violet-500/30 border border-violet-500/40 text-violet-300 hover:bg-violet-500/50 transition-all">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setStockEditId(null)}
                                className="cursor-pointer p-1 rounded-lg bg-white/[0.04] border border-white/10 text-neutral-400 hover:text-white transition-all">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => { setStockEditId(item.id); setStockEditVal(item.stock); }}
                              className="cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all group">
                              <span className={`text-sm font-bold font-mono ${isOut ? "text-rose-400" : isLow ? "text-amber-400" : "text-emerald-400"}`}>{item.stock}</span>
                              <Pencil className="w-2.5 h-2.5 text-neutral-500 group-hover:text-violet-400 transition-colors" />
                            </button>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="col-span-1 flex justify-center">
                          {isOut ? (
                            <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full">Out</span>
                          ) : isLow ? (
                            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" />Low
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">OK</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex items-center justify-end gap-1.5">
                          <button onClick={() => openEdit(item)}
                            className="cursor-pointer p-1.5 rounded-lg bg-white/[0.04] hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/30 text-neutral-400 hover:text-violet-300 transition-all">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteInventory(item.id)}
                            className="cursor-pointer p-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-neutral-400 hover:text-rose-300 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Table Footer */}
                <div className="px-4 py-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>{filteredInventory.length} products showing</span>
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400">{inventory.filter((i) => i.stock > i.lowStockThreshold).length} in stock</span>
                    <span className="text-amber-400">{inventory.filter((i) => i.stock > 0 && i.stock <= i.lowStockThreshold).length} low stock</span>
                    <span className="text-rose-400">{inventory.filter((i) => i.stock === 0).length} out of stock</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
