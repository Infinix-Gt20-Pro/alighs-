// src/app/admin/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Package,
  Calendar,
  Phone,
  MessageCircle,
  Clock,
  RefreshCw,
  Search,
  CheckCircle2,
  Truck,
  ExternalLink,
  Lock,
  LogOut,
  MapPin,
  TrendingUp
} from "lucide-react";

interface OrderItem {
  productId?: string;
  name: string;
  color?: string;
  quantity: number;
  price: number;
}

interface OrderRecord {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
    pincode: string;
  };
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

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [activeTab, setActiveTab] = useState<"orders" | "appointments">("orders");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Check persisted auth
  useEffect(() => {
    const saved = localStorage.getItem("aligs_admin_authenticated");
    if (saved === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPin = pinInput.trim();
    if (cleanPin === "786" || cleanPin === "6396" || cleanPin === "7217" || cleanPin === "1499" || cleanPin === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("aligs_admin_authenticated", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect Passcode. Enter 786 or 6396");
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    localStorage.setItem("aligs_admin_authenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("aligs_admin_authenticated");
    setPinInput("");
  };

  // Fetch orders and appointments
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resOrders, resApts] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/appointments")
      ]);

      if (resOrders.ok) {
        const data = await resOrders.json();
        setOrders(data.orders || []);
      }
      if (resApts.ok) {
        const dataApt = await resApts.json();
        setAppointments(dataApt.appointments || []);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus: newStatus })
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, orderStatus: newStatus as OrderRecord["orderStatus"] } : o))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Update appointment status
  const handleUpdateAptStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, status: newStatus })
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.appointmentId === appointmentId ? { ...a, status: newStatus as AppointmentRecord["status"] } : a))
        );
      }
    } catch (err) {
      console.error("Error updating apt status:", err);
    }
  };

  // Statistics
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0),
    [orders]
  );
  const pendingOrdersCount = useMemo(
    () => orders.filter((o) => o.orderStatus === "placed" || o.orderStatus === "confirmed").length,
    [orders]
  );

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchFilter = statusFilter === "all" || o.orderStatus === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.orderId.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.city.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // Render Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center p-4 selection:bg-amber-500/30">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c0d12]/90 border border-amber-400/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center mx-auto mb-5 shadow-[0_0_25px_rgba(212,175,55,0.4)]">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="font-cinzel text-2xl font-bold tracking-wider text-white">
            ALIG&apos;S WARE
          </h1>
          <p className="text-xs font-mono text-amber-300 uppercase tracking-widest mt-1 mb-6">
            Atelier Management &bull; Orders Portal
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1.5">
                Enter Passcode / PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 font-mono text-center text-lg tracking-widest"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-rose-400 mt-1.5 font-mono text-center">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-98 transition-all"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-2.5">
            <button
              onClick={handleQuickUnlock}
              className="cursor-pointer text-xs font-mono text-amber-300/80 hover:text-amber-300 underline underline-offset-4"
            >
              ✦ Quick Access for Dr. Sheeraz Ahmad
            </button>
            <Link
              href="/"
              className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors font-mono"
            >
              &larr; Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-amber-500/30 selection:text-white pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0c0d12]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-cinzel text-lg font-bold tracking-wider text-white group-hover:text-amber-300 transition-colors">
                  ALIG&apos;S WARE
                </span>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                  Backoffice Dashboard
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all"
            >
              <span>View Store</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-mono text-rose-300 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
        {/* KPI Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Total Orders</span>
              <Package className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {orders.length}
            </div>
            <span className="text-[10px] font-mono text-neutral-500 mt-1 block">
              Lifetime store orders
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Total Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-300">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <span className="text-[10px] font-mono text-emerald-400/80 mt-1 block">
              From customer bookings
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Pending Dispatch</span>
              <Truck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
              {pendingOrdersCount}
            </div>
            <span className="text-[10px] font-mono text-neutral-500 mt-1 block">
              Requires clinic packing
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Appointments</span>
              <Calendar className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300">
              {appointments.length}
            </div>
            <span className="text-[10px] font-mono text-neutral-500 mt-1 block">
              Dr. Sheeraz patients
            </span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white border border-white/10"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Customer Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("appointments")}
              className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "appointments"
                  ? "bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white border border-white/10"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Clinic Appointments ({appointments.length})</span>
            </button>
          </div>

          {activeTab === "orders" && (
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search name, phone, order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="placed">Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === "orders" && (
          <div>
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10">
                <Package className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-lg font-cinzel text-white">No Orders Found</h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  {searchQuery || statusFilter !== "all"
                    ? "Try clearing your search query or status filter."
                    : "Jab koi customer naya order place karega, uski details automatically yahan aa jayengi."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const dateStr = order.createdAt
                    ? new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "Recent";

                  const isConfirmed = order.orderStatus === "confirmed";
                  const isShipped = order.orderStatus === "shipped";
                  const isDelivered = order.orderStatus === "delivered";

                  const whatsappMsg = encodeURIComponent(
                    `Hello ${order.customer.name}! Greetings from ALIG'S WARE.
Regarding your eyewear order *${order.orderId}* of ₹${order.totalAmount}:
We are preparing your package under Dr. Sheeraz Ahmad's care. Please let us know if you need any assistance.`
                  );

                  return (
                    <div
                      key={order.orderId}
                      className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-amber-400/30 transition-all shadow-xl"
                    >
                      {/* Top Order Meta */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-white/10 gap-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono font-bold text-amber-400 text-sm sm:text-base tracking-wider">
                            {order.orderId}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-500" />
                            {dateStr}
                          </span>
                          {order.isOfflineMode && (
                            <span className="text-[9px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                              Cached
                            </span>
                          )}
                        </div>

                        {/* Status Changer */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-neutral-400 uppercase">
                            Status:
                          </span>
                          <select
                            value={order.orderStatus || "placed"}
                            disabled={updatingId === order.orderId}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.orderId, e.target.value)
                            }
                            className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold border cursor-pointer focus:outline-none transition-all ${
                              isDelivered
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : isShipped
                                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                                : isConfirmed
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            }`}
                          >
                            <option value="placed" className="bg-neutral-900 text-amber-300">
                              Placed (Pending)
                            </option>
                            <option value="confirmed" className="bg-neutral-900 text-cyan-300">
                              Confirmed
                            </option>
                            <option value="shipped" className="bg-neutral-900 text-indigo-300">
                              Shipped (In Transit)
                            </option>
                            <option value="delivered" className="bg-neutral-900 text-emerald-300">
                              Delivered
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Customer & Address Details */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-4">
                        {/* Left: Customer Info (5 cols) */}
                        <div className="md:col-span-5 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-white">
                              {order.customer.name}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded-full bg-white/[0.04]">
                              {order.customer.city}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                            <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>+91 {order.customer.phone}</span>
                          </div>

                          {order.customer.email && (
                            <div className="text-xs text-neutral-400 font-mono">
                              {order.customer.email}
                            </div>
                          )}

                          <div className="flex items-start gap-1.5 text-xs text-neutral-400 pt-1">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>
                              {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                            </span>
                          </div>

                          {/* Instant Communication Actions */}
                          <div className="flex items-center gap-2 pt-2">
                            <a
                              href={`https://wa.me/91${order.customer.phone}?text=${whatsappMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-mono transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp Customer</span>
                            </a>

                            <a
                              href={`tel:+91${order.customer.phone}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-300 transition-all"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call</span>
                            </a>
                          </div>
                        </div>

                        {/* Right: Ordered Items List (7 cols) */}
                        <div className="md:col-span-7 bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-2">
                              Ordered Items ({order.items.length}):
                            </span>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-none"
                                >
                                  <div>
                                    <span className="text-white font-medium">{item.name}</span>
                                    <span className="text-[11px] font-mono text-amber-300/80 ml-2">
                                      ({item.color})
                                    </span>
                                  </div>
                                  <div className="font-mono text-right">
                                    <span className="text-neutral-400 mr-2">x{item.quantity}</span>
                                    <span className="text-white font-semibold">
                                      ₹{item.price * item.quantity}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Footer Total */}
                          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                            <div>
                              <span className="text-neutral-500 uppercase">Payment Mode: </span>
                              <span className="text-amber-300 font-bold uppercase">
                                {order.paymentMethod}
                              </span>
                            </div>
                            <div>
                              <span className="text-neutral-400 mr-2">Grand Total:</span>
                              <span className="text-base font-bold text-amber-400">
                                ₹{order.totalAmount}
                              </span>
                            </div>
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

        {/* TAB 2: APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div>
            {appointments.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10">
                <Calendar className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-lg font-cinzel text-white">No Clinic Appointments Yet</h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  Patients booking eye checks or frame fittings with Dr. Sheeraz will show up here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => {
                  const dateStr = apt.preferredDate
                    ? new Date(apt.preferredDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })
                    : "Flexible";

                  return (
                    <div
                      key={apt.appointmentId}
                      className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm sm:text-base">
                            {apt.name}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">
                            {apt.concern}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono text-neutral-300">
                          <span className="flex items-center gap-1 text-amber-300">
                            <Calendar className="w-3 h-3" /> {dateStr}
                          </span>
                          <span className="flex items-center gap-1 text-neutral-400">
                            <Clock className="w-3 h-3" /> {apt.preferredTime}
                          </span>
                          <span className="text-neutral-400">&bull; +91 {apt.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <a
                          href={`https://wa.me/91${apt.phone}?text=Hello%20${encodeURIComponent(
                            apt.name
                          )},%20confirming%20your%20appointment%20with%20Dr.%20Sheeraz%20Ahmad%20at%20ALIG'S%20WARE%20Clinic.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-mono flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <select
                          value={apt.status || "confirmed"}
                          onChange={(e) =>
                            handleUpdateAptStatus(apt.appointmentId, e.target.value)
                          }
                          className="bg-neutral-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                        >
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
      </main>
    </div>
  );
}
