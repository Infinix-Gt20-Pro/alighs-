// src/app/admin/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Package, Calendar, Phone, MessageCircle, Clock,
  RefreshCw, Search, CheckCircle2, Truck, ExternalLink, Lock,
  LogOut, MapPin, TrendingUp, Archive, Plus, Trash2, Pencil,
  AlertTriangle, X, Settings2, Sparkles, Database, ArrowRight,
  SlidersHorizontal, Check, Globe, Download, Users, BarChart3,
  Eye, ShoppingBag, Layers, Key, DollarSign, ChevronRight, Filter,
  Paperclip, FileText
} from "lucide-react";

interface OrderItem {
  productId?: string;
  name: string;
  color?: string;
  quantity: number;
  price: number;
  totalPrice?: number;
}

interface OrderRecord {
  id?: string;
  order_number: string;
  orderId?: string;
  customer: {
    full_name?: string;
    name?: string;
    phone: string;
    email?: string;
    city: string;
    state?: string;
    address: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal?: number;
  shipping_charge?: number;
  total_amount: number;
  totalAmount?: number;
  payment_method: string;
  paymentMethod?: string;
  order_status: string;
  orderStatus?: string;
  payment_status: string;
  paymentStatus?: string;
  customer_notes?: string;
  prescription_url?: string;
  prescription_name?: string;
  created_at: string;
  createdAt?: string;
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
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: number;
}

interface ProductRecord {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  original_price: number;
  discount: number;
  sku: string;
  stock_quantity: number;
  image_url: string;
  status: "active" | "out_of_stock" | "inactive";
  created_at: string;
  updated_at: string;
}

interface CustomerRecord {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

interface AnalyticsData {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  monthRevenue: number;
  totalUnitsSold: number;
  aov?: number;
  averageOrderValue?: number;
  lowStockCount: number;
  ordersPerDay: Array<{ date: string; orders: number; revenue: number }>;
  bestSellers: Array<{ name: string; units: number; revenue: number }>;
}

const CATEGORIES = [
  "All", "Eyeglasses", "Sunglasses", "Computer Glasses",
  "Kids Glasses", "Sports Glasses", "Rimless", "Luxury Gold"
];

const ORDER_STATUSES = [
  "Pending", "Confirmed", "Processing", "Packed",
  "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"
];

const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refunded", "COD"];

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [authMode, setAuthMode] = useState<"pin" | "password">("pin");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Executive Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "customers" | "inventory" | "appointments"
  >("overview");

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [orderSort, setOrderSort] = useState<"newest" | "oldest">("newest");
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 10;

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [internalNote, setInternalNote] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const [invSearch, setInvSearch] = useState("");
  const [invCategory, setInvCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdForm, setNewProdForm] = useState({
    name: "", category: "Eyeglasses", price: 1999, original_price: 2999,
    sku: "", stock_quantity: 20, image_url: "/logo.png",
    description: "Atelier Handcrafted Luxury Titanium Frame."
  });
  const [savingProduct, setSavingProduct] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("aligs_admin_session_token");
    if (token && token.startsWith("adm_")) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent, identifier: string, secret: string) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          username: identifier.trim(),
          password: secret.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setIsAuthenticated(true);
        localStorage.setItem("aligs_admin_session_token", data.token);
        localStorage.setItem("aligs_admin_role", data.role || "superadmin");
        showToast("Authenticated successfully. Welcome to Executive Atelier OS.", "success");
      } else {
        setAuthError(data.error || "Invalid executive credentials. Access denied.");
      }
    } catch {
      setAuthError("Failed to connect to authentication server. Please check your network.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("aligs_admin_session_token");
    localStorage.removeItem("aligs_admin_role");
    localStorage.removeItem("aligs_admin_authenticated");
    setPinInput("");
    setUsernameInput("");
    setPasswordInput("");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (newPw !== confirmPw) {
      setPwMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change-password", password: currentPw, newPassword: newPw })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPwMsg({ type: "success", text: "Master password successfully updated." });
        setTimeout(() => {
          setShowPasswordModal(false);
          setCurrentPw("");
          setNewPw("");
          setConfirmPw("");
          setPwMsg(null);
        }, 1500);
      } else {
        setPwMsg({ type: "error", text: data.error || "Failed to update password." });
      }
    } catch {
      setPwMsg({ type: "error", text: "Network error updating password." });
    }
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [resOrders, resAnalytics, resCust, resInv, resApts] = await Promise.all([
        fetch("/api/orders?sort=newest"),
        fetch("/api/admin/analytics"),
        fetch("/api/admin/customers"),
        fetch("/api/admin/inventory"),
        fetch("/api/appointments")
      ]);

      if (resOrders.ok) { const d = await resOrders.json(); setOrders(d.orders || []); }
      if (resAnalytics.ok) { const d = await resAnalytics.json(); setAnalytics(d.analytics || null); }
      if (resCust.ok) { const d = await resCust.json(); setCustomers(d.customers || []); }
      if (resInv.ok) { const d = await resInv.json(); setProducts(d.products || []); }
      if (resApts.ok) { const d = await resApts.json(); setAppointments(d.appointments || []); }
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchAllData();
  }, [isAuthenticated, fetchAllData]);

  const handleOpenOrder = async (orderNum: string) => {
    setOrderDrawerOpen(true);
    const existing = orders.find(
      (o) => (o.order_number && o.order_number.toLowerCase() === orderNum.toLowerCase()) || o.orderId === orderNum
    );
    if (existing) {
      setSelectedOrder(existing);
      setNewOrderStatus(existing.order_status || existing.orderStatus || "Pending");
      setNewPaymentStatus(existing.payment_status || existing.paymentStatus || "Pending");
    } else {
      setSelectedOrder(null);
    }
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderNum)}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data.order);
        setNewOrderStatus(data.order.order_status);
        setNewPaymentStatus(data.order.payment_status);
      }
    } catch (e) {
      console.error("Order detail error:", e);
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: selectedOrder.order_number || selectedOrder.orderId,
          orderStatus: newOrderStatus,
          paymentStatus: newPaymentStatus,
          note: internalNote.trim() || `Status updated to ${newOrderStatus} via Executive Admin Panel`
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data.order);
        setInternalNote("");
        showToast(`Order ${selectedOrder.order_number || selectedOrder.orderId} updated to ${newOrderStatus}!`, "success");
        fetchAllData();
      } else {
        showToast("Failed to update order status", "error");
      }
    } catch (e) {
      console.error("Status update error:", e);
      showToast("Network error updating order status", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleOpenCustomer = async (custId: string) => {
    setCustomerDrawerOpen(true);
    const existing = customers.find((c) => c.id === custId);
    if (existing) {
      setSelectedCustomer(existing);
    } else {
      setSelectedCustomer(null);
    }
    try {
      const res = await fetch(`/api/admin/customers?id=${encodeURIComponent(custId)}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCustomer(data.customer);
      }
    } catch (e) {
      console.error("Customer fetch error:", e);
    }
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    const stock = Math.max(0, newStock);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, stock_quantity: stock })
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            String(p.id) === String(productId)
              ? { ...p, stock_quantity: stock, status: stock > 0 ? (p.status === "inactive" ? "inactive" : "active") : "out_of_stock" }
              : p
          )
        );
        showToast(`Stock updated to ${stock} units`, "success");
      } else {
        showToast("Failed to update stock", "error");
      }
    } catch (e) {
      console.error("Stock update error:", e);
      showToast("Network error updating stock", "error");
    }
  };

  const handlePriceUpdate = async (productId: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice <= 0) {
      showToast("Please enter a valid price greater than 0", "error");
      return;
    }
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, price: newPrice })
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (String(p.id) === String(productId) ? { ...p, price: newPrice } : p))
        );
        showToast(`Price updated to ₹${newPrice.toLocaleString("en-IN")}`, "success");
      } else {
        showToast("Failed to save price update", "error");
      }
    } catch (e) {
      console.error("Price update error:", e);
      showToast("Network error updating price", "error");
    }
  };

  const handleToggleProductStatus = async (product: ProductRecord) => {
    const nextStatus = product.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, status: nextStatus })
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (String(p.id) === String(product.id) ? { ...p, status: nextStatus as any } : p))
        );
        showToast(`Frame marked as ${nextStatus.toUpperCase()}`, "info");
      } else {
        showToast("Failed to update product status", "error");
      }
    } catch (e) {
      console.error("Status toggle error:", e);
      showToast("Network error updating status", "error");
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to deactivate "${productName}" from the catalog?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/inventory?id=${encodeURIComponent(productId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (String(p.id) === String(productId) ? { ...p, status: "inactive" as const } : p))
        );
        showToast(`"${productName}" deactivated from catalog`, "info");
      } else {
        showToast("Failed to deactivate product", "error");
      }
    } catch (e) {
      console.error("Delete product error:", e);
      showToast("Network error deleting product", "error");
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProdForm)
      });
      if (res.ok) {
        const data = await res.json();
        setProducts((prev) => [data.product, ...prev]);
        setShowAddModal(false);
        showToast(`"${data.product.name}" added to catalog!`, "success");
        setNewProdForm({
          name: "", category: "Eyeglasses", price: 1999, original_price: 2999,
          sku: "", stock_quantity: 20, image_url: "/logo.png",
          description: "Atelier Handcrafted Luxury Titanium Frame."
        });
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to create frame", "error");
      }
    } catch (e) {
      console.error("Add product error:", e);
      showToast("Network error creating frame", "error");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleUpdateAptStatus = async (appointmentId: string, status: string) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, status })
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.appointmentId === appointmentId ? { ...a, status: status as any } : a))
        );
        showToast(`Appointment ${appointmentId} → ${status}`, "success");
      } else {
        showToast("Failed to update appointment status", "error");
      }
    } catch (e) {
      console.error("Apt update error:", e);
      showToast("Network error updating appointment", "error");
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = [
      "Order Number", "Customer Name", "Phone", "City", "State",
      "Items Count", "Subtotal", "Total Amount", "Payment Method",
      "Payment Status", "Order Status", "Date Placed"
    ];
    const rows = filteredOrders.map((o) => [
      `"${o.order_number || o.orderId}"`,
      `"${o.customer?.full_name || o.customer?.name || ""}"`,
      `"${o.customer?.phone || ""}"`,
      `"${o.customer?.city || ""}"`,
      `"${o.customer?.state || ""}"`,
      o.items?.length || 0,
      o.subtotal || o.total_amount,
      o.total_amount || o.totalAmount,
      `"${o.payment_method || o.paymentMethod}"`,
      `"${o.payment_status || o.paymentStatus}"`,
      `"${o.order_status || o.orderStatus}"`,
      `"${new Date(o.created_at || o.createdAt || Date.now()).toLocaleString("en-IN")}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ALIGSWARE_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const num = (o.order_number || o.orderId || "").toLowerCase();
        const name = (o.customer?.full_name || o.customer?.name || "").toLowerCase();
        const phone = (o.customer?.phone || "");
        const query = orderSearch.toLowerCase().trim();
        const matchesSearch = !query || num.includes(query) || name.includes(query) || phone.includes(query);

        const curStatus = (o.order_status || o.orderStatus || "").toLowerCase();
        const matchesStatus = orderStatusFilter === "all" || curStatus === orderStatusFilter.toLowerCase();

        const curPay = (o.payment_status || o.paymentStatus || "").toLowerCase();
        const matchesPay = paymentStatusFilter === "all" || curPay === paymentStatusFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesPay;
      })
      .sort((a, b) => {
        const tA = new Date(a.created_at || a.createdAt || Date.now()).getTime();
        const tB = new Date(b.created_at || b.createdAt || Date.now()).getTime();
        return orderSort === "oldest" ? tA - tB : tB - tA;
      });
  }, [orders, orderSearch, orderStatusFilter, paymentStatusFilter, orderSort]);

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, orderPage]);

  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;

  const availableCategories = useMemo(() => {
    const catSet = new Set<string>();
    products.forEach((p) => {
      if (p.category) catSet.add(p.category.trim());
    });
    ["clip-on", "eyeglasses", "sunglasses", "computer-glasses", "reading-glasses"].forEach((c) => catSet.add(c));
    return ["All", ...Array.from(catSet).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const normalize = (str: string) => (str || "").toLowerCase().replace(/[-_ ]/g, "");
      const matchesCat =
        invCategory === "All" ||
        normalize(p.category) === normalize(invCategory);

      const query = invSearch.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        String(p.price).includes(query);

      return matchesCat && matchesSearch;
    });
  }, [products, invCategory, invSearch]);

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.city && c.city.toLowerCase().includes(q))
    );
  }, [customers, customerSearch]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070709] text-[#F5EFE6] flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#B88A32]/30 selection:text-white">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#B88A32]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-[#D4AF62]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#121218]/90 backdrop-blur-xl border border-[#B88A32]/30 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B88A32] to-[#7A5A1A] p-0.5 mx-auto mb-4 shadow-lg shadow-[#B88A32]/25 flex items-center justify-center">
              <div className="w-full h-full bg-[#121218] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#B88A32]" />
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B88A32]/30 bg-[#B88A32]/10 text-[10px] font-mono tracking-widest text-[#B88A32] uppercase mb-2">
              Executive Access
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
              ALIG'S WARE Atelier
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              E-Commerce Management & Order Registry
            </p>
          </div>

          <div className="flex border-b border-white/10 mb-6 text-xs font-mono">
            <button
              onClick={() => { setAuthMode("pin"); setAuthError(""); }}
              className={`flex-1 pb-2.5 font-semibold transition-all ${
                authMode === "pin" ? "text-[#B88A32] border-b-2 border-[#B88A32]" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Security Passcode
            </button>
            <button
              onClick={() => { setAuthMode("password"); setAuthError(""); }}
              className={`flex-1 pb-2.5 font-semibold transition-all ${
                authMode === "password" ? "text-[#B88A32] border-b-2 border-[#B88A32]" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Executive Credentials
            </button>
          </div>

          {authMode === "pin" ? (
            <form onSubmit={(e) => handleAdminLogin(e, "admin", pinInput)} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Security Passcode
                </label>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter Passcode"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-white/[0.04] border border-[#B88A32]/30 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white placeholder-neutral-600 focus:outline-none focus:border-[#B88A32] transition-all font-mono"
                />
              </div>

              {authError && <p className="text-xs text-red-400 text-center font-mono">{authError}</p>}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#B88A32] hover:bg-[#A07828] text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-[#B88A32]/25 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" /> {authLoading ? "Verifying..." : "Enter Command Center"}
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => handleAdminLogin(e, usernameInput, passwordInput)} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Admin Username
                </label>
                <input
                  type="text"
                  placeholder="admin"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-white/[0.04] border border-[#B88A32]/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#B88A32] transition-all font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-white/[0.04] border border-[#B88A32]/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#B88A32] transition-all font-mono"
                />
              </div>

              {authError && <p className="text-xs text-red-400 text-center font-mono">{authError}</p>}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#B88A32] hover:bg-[#A07828] text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-[#B88A32]/25 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {authLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Authenticate Session
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-[#B88A32] transition-colors inline-flex items-center gap-1.5 font-mono"
            >
              &larr; Return to Public Boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-[#F5EFE6] selection:bg-[#B88A32]/30 selection:text-white pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0E0E14]/90 backdrop-blur-md border-b border-[#B88A32]/20 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B88A32] to-[#7A5A1A] p-0.5 flex items-center justify-center shadow-md shadow-[#B88A32]/20">
              <div className="w-full h-full bg-[#0E0E14] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#B88A32]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-white text-base tracking-wide">
                  ALIG'S WARE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B88A32]/20 border border-[#B88A32]/30 text-[#B88A32] font-semibold">
                  E-Commerce OS
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5">
                <Database className="w-3 h-3 text-emerald-400" />
                Persistent Ledger Active &bull; Dr. Sheeraz Ahmad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => fetchAllData()}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-neutral-300 flex items-center gap-1.5 transition-all"
              title="Refresh all data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#B88A32]" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-neutral-300 flex items-center gap-1.5 transition-all"
              title="Change master admin password"
            >
              <Key className="w-3.5 h-3.5 text-[#B88A32]" />
              <span>Security</span>
            </button>

            <Link
              href="/track-order"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-[#B88A32]/10 hover:bg-[#B88A32]/20 border border-[#B88A32]/30 text-xs font-mono text-[#B88A32] flex items-center gap-1.5 transition-all"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Portal</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-4 pt-2 border-t border-white/10 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "overview"
                ? "bg-[#B88A32] text-white font-semibold shadow-md shadow-[#B88A32]/20"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Overview & KPIs
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "orders"
                ? "bg-[#B88A32] text-white font-semibold shadow-md shadow-[#B88A32]/20"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Package className="w-4 h-4" /> Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "customers"
                ? "bg-[#B88A32] text-white font-semibold shadow-md shadow-[#B88A32]/20"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Users className="w-4 h-4" /> Customers ({customers.length})
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "inventory"
                ? "bg-[#B88A32] text-white font-semibold shadow-md shadow-[#B88A32]/20"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Layers className="w-4 h-4" /> Inventory ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "appointments"
                ? "bg-[#B88A32] text-white font-semibold shadow-md shadow-[#B88A32]/20"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Calendar className="w-4 h-4" /> Appointments ({appointments.length})
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#B88A32]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Total Gross Revenue
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#B88A32]/15 text-[#B88A32] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">
                  ₹{(analytics?.totalRevenue || 0).toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
                  <span className="text-emerald-400 font-semibold">
                    ₹{(analytics?.todayRevenue || 0).toLocaleString("en-IN")}
                  </span>{" "}
                  today &bull; ₹{(analytics?.monthRevenue || 0).toLocaleString("en-IN")} this mo.
                </div>
              </div>

              <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Order Volume
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">
                  {analytics?.totalOrders || orders.length}
                </div>
                <div className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
                  <span className="text-emerald-400 font-semibold">
                    +{analytics?.todayOrders || 0}
                  </span>{" "}
                  new today &bull; {analytics?.deliveredOrders || 0} delivered
                </div>
              </div>

              <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Average Order Value (AOV)
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">
                  ₹{(analytics?.aov || analytics?.averageOrderValue || 0).toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-neutral-400 font-mono">
                  {analytics?.totalUnitsSold || 0} total eyewear frames dispatched
                </div>
              </div>

              <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Low Stock Alert
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">
                  {analytics?.lowStockCount || 0}
                </div>
                <div className="text-xs text-neutral-400 font-mono">
                  {products.filter((p) => p.stock_quantity <= 5).length} items require replenishment
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#121218] border border-[#B88A32]/20 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">
                      7-Day Revenue & Orders Velocity
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      Daily order confirmations recorded in persistent ledger
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#B88A32] bg-[#B88A32]/10 border border-[#B88A32]/30 px-3 py-1 rounded-full">
                    Live Velocity
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-3 h-48 items-end pt-4 pb-2 border-b border-white/10">
                  {(analytics?.ordersPerDay || []).map((day, idx) => {
                    const maxRevenue = Math.max(1, ...(analytics?.ordersPerDay.map((d) => d.revenue) || [1]));
                    const heightPercent = Math.min(100, Math.max(12, (day.revenue / maxRevenue) * 100));

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="text-[10px] font-mono text-[#B88A32] opacity-0 group-hover:opacity-100 transition-opacity">
                          ₹{day.revenue}
                        </div>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full max-w-[36px] bg-gradient-to-t from-[#B88A32]/40 to-[#B88A32] rounded-t-lg transition-all group-hover:brightness-125 relative"
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white text-[9px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">
                            {day.orders} ord
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-400">
                          {day.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white mb-1">
                    Pipeline Distribution
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mb-4">
                    Current distribution across order lifecycle
                  </p>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.03]">
                      <span className="text-amber-300 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400" /> Pending / Confirmed
                      </span>
                      <span className="font-bold text-white">
                        {(analytics?.pendingOrders || 0) + (orders.filter((o) => (o.order_status || o.orderStatus) === "Confirmed").length)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.03]">
                      <span className="text-blue-400 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400" /> Processing in Atelier
                      </span>
                      <span className="font-bold text-white">
                        {analytics?.processingOrders || 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.03]">
                      <span className="text-indigo-400 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-400" /> Shipped / Out for Delivery
                      </span>
                      <span className="font-bold text-white">
                        {analytics?.shippedOrders || 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.03]">
                      <span className="text-emerald-400 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" /> Delivered Safely
                      </span>
                      <span className="font-bold text-white">
                        {analytics?.deliveredOrders || 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.03]">
                      <span className="text-red-400 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400" /> Cancelled
                      </span>
                      <span className="font-bold text-white">
                        {analytics?.cancelledOrders || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("orders")}
                  className="w-full mt-4 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-neutral-300 py-2.5 rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition-all"
                >
                  <span>Manage All Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl p-6 shadow-xl">
              <h3 className="font-serif font-bold text-lg text-white mb-1">
                Top Bestselling Luxury Frames
              </h3>
              <p className="text-xs text-neutral-400 font-mono mb-4">
                Highest grossing frames ranked by units sold and revenue
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(analytics?.bestSellers || []).map((bs, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.03] border border-[#B88A32]/15 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#B88A32]/20 text-[#B88A32] text-xs font-mono font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <p className="text-sm font-semibold text-white truncate max-w-[200px]">
                          {bs.name}
                        </p>
                      </div>
                      <p className="text-xs font-mono text-neutral-400 mt-1 pl-7">
                        {bs.units} units sold
                      </p>
                    </div>
                    <span className="text-sm font-mono font-bold text-[#B88A32]">
                      ₹{bs.revenue.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Order #, Customer, or Phone..."
                    value={orderSearch}
                    onChange={(e) => { setOrderSearch(e.target.value); setOrderPage(1); }}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#B88A32] transition-all"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => { setOrderStatusFilter(e.target.value); setOrderPage(1); }}
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-[#B88A32]"
                >
                  <option value="all">All Order Statuses</option>
                  {ORDER_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>

                <select
                  value={paymentStatusFilter}
                  onChange={(e) => { setPaymentStatusFilter(e.target.value); setOrderPage(1); }}
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-[#B88A32]"
                >
                  <option value="all">All Payment Statuses</option>
                  {PAYMENT_STATUSES.map((pst) => <option key={pst} value={pst}>{pst}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOrderSort(orderSort === "newest" ? "oldest" : "newest")}
                  className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Sort: {orderSort === "newest" ? "Newest First" : "Oldest First"}</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 rounded-xl bg-[#B88A32] hover:bg-[#A07828] text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-[#B88A32]/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white/[0.03] border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Order Number</th>
                      <th className="py-3.5 px-4 font-semibold">Client</th>
                      <th className="py-3.5 px-4 font-semibold">Items</th>
                      <th className="py-3.5 px-4 font-semibold">Total</th>
                      <th className="py-3.5 px-4 font-semibold">Payment</th>
                      <th className="py-3.5 px-4 font-semibold">Order Status</th>
                      <th className="py-3.5 px-4 font-semibold">Date</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-200">
                    {paginatedOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-neutral-500">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((o) => {
                        const orderNum = o.order_number || o.orderId || "";
                        const customerName = o.customer?.full_name || o.customer?.name || "Client";
                        const orderStatus = o.order_status || o.orderStatus || "Pending";
                        const payStatus = o.payment_status || o.paymentStatus || "Pending";
                        const payMethod = o.payment_method || o.paymentMethod || "COD";
                        const total = o.total_amount || o.totalAmount || 0;

                        return (
                          <tr
                            key={orderNum}
                            className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                            onClick={() => handleOpenOrder(orderNum)}
                          >
                            <td className="py-4 px-4 font-bold text-[#B88A32]">
                              {orderNum}
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-white">{customerName}</div>
                              <div className="text-[11px] text-neutral-400 font-mono">+91 {o.customer?.phone}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-neutral-300">
                                {o.items?.length || 1} frame(s)
                              </span>
                            </td>
                            <td className="py-4 px-4 font-bold text-white font-mono">₹{Number(total).toLocaleString("en-IN")}</td>
                            <td className="py-4 px-4">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${
                                payStatus.toLowerCase() === "paid"
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                              }`}>
                                {payMethod.toUpperCase()} &bull; {payStatus}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${
                                orderStatus.toLowerCase() === "delivered"
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                  : orderStatus.toLowerCase() === "cancelled"
                                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                                  : "bg-[#B88A32]/10 border-[#B88A32]/30 text-[#B88A32]"
                              }`}>
                                {orderStatus}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-[11px] text-neutral-400 whitespace-nowrap">
                              {new Date(o.created_at || o.createdAt || Date.now()).toLocaleDateString("en-IN", {
                                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                              })}
                            </td>
                            <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleOpenOrder(orderNum)}
                                className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-[#B88A32] hover:text-white text-neutral-300 text-[11px] font-mono transition-all inline-flex items-center gap-1"
                              >
                                <span>Inspect</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-white/10 flex justify-between items-center text-xs font-mono text-neutral-400">
                <span>
                  Showing {Math.min(filteredOrders.length, (orderPage - 1) * ordersPerPage + 1)} to{" "}
                  {Math.min(filteredOrders.length, orderPage * ordersPerPage)} of {filteredOrders.length} orders
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                    disabled={orderPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] disabled:opacity-40 transition-all"
                  >
                    Previous
                  </button>
                  <span className="px-2 font-bold text-white">{orderPage} / {totalOrderPages}</span>
                  <button
                    onClick={() => setOrderPage((p) => Math.min(totalOrderPages, p + 1))}
                    disabled={orderPage >= totalOrderPages}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] disabled:opacity-40 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="space-y-6">
            <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl p-4 sm:p-5 shadow-lg flex justify-between items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer by name, phone, or city..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#B88A32] transition-all"
                />
              </div>
              <span className="text-xs font-mono text-[#B88A32]">
                {filteredCustomers.length} registered clientele records
              </span>
            </div>

            <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white/[0.03] border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Client Name</th>
                      <th className="py-3.5 px-4 font-semibold">Contact</th>
                      <th className="py-3.5 px-4 font-semibold">Location</th>
                      <th className="py-3.5 px-4 font-semibold">Orders Count</th>
                      <th className="py-3.5 px-4 font-semibold">Lifetime Spend</th>
                      <th className="py-3.5 px-4 font-semibold">Last Active</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-200">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-neutral-500">
                          No customer profiles recorded yet.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c) => (
                        <tr
                          key={c.id}
                          className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                          onClick={() => handleOpenCustomer(c.id)}
                        >
                          <td className="py-4 px-4 font-semibold text-white">{c.fullName}</td>
                          <td className="py-4 px-4">
                            <div>+91 {c.phone}</div>
                            {c.email && <div className="text-[11px] text-neutral-400">{c.email}</div>}
                          </td>
                          <td className="py-4 px-4 text-neutral-300">
                            {c.city}, {c.state} ({c.pincode})
                          </td>
                          <td className="py-4 px-4 font-bold text-[#B88A32]">
                            {c.orderCount ?? (c as any).totalOrders ?? 0} order(s)
                          </td>
                          <td className="py-4 px-4 font-bold text-white font-mono">
                            ₹{c.totalSpent.toLocaleString("en-IN")}
                          </td>
                          <td className="py-4 px-4 text-[11px] text-neutral-400">
                            {new Date(c.lastOrderDate).toLocaleDateString("en-IN", {
                              month: "short", day: "numeric", year: "numeric"
                            })}
                          </td>
                          <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleOpenCustomer(c.id)}
                              className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-[#B88A32] hover:text-white text-neutral-300 text-[11px] font-mono transition-all inline-flex items-center gap-1"
                            >
                              <span>Inspect History</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by frame name, SKU, or category..."
                    value={invSearch}
                    onChange={(e) => setInvSearch(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#B88A32] transition-all"
                  />
                </div>

                <select
                  value={invCategory}
                  onChange={(e) => setInvCategory(e.target.value)}
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-[#B88A32]"
                >
                  {availableCategories.map((cat) => {
                    const label =
                      cat === "All"
                        ? "All Categories"
                        : cat
                            .split(/[-_]/)
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ");
                    return (
                      <option key={cat} value={cat}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-[#B88A32] hover:bg-[#A07828] text-white font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-[#B88A32]/20 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Luxury Frame</span>
              </button>
            </div>

            <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white/[0.03] border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Frame Name</th>
                      <th className="py-3.5 px-4 font-semibold">Category</th>
                      <th className="py-3.5 px-4 font-semibold">SKU</th>
                      <th className="py-3.5 px-4 font-semibold">Price (₹)</th>
                      <th className="py-3.5 px-4 font-semibold">Stock Quantity</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-200">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">{p.name}</div>
                          <div className="text-[10px] text-neutral-500 line-clamp-1">{p.description}</div>
                        </td>
                        <td className="py-4 px-4 text-neutral-300 uppercase tracking-wider text-[11px]">
                          {p.category}
                        </td>
                        <td className="py-4 px-4 text-[#B88A32] font-mono">{p.sku}</td>
                        <td className="py-4 px-4 font-mono font-bold text-white">
                          <input
                            type="number"
                            defaultValue={p.price}
                            key={`price-${p.id}-${p.price}`}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") e.currentTarget.blur();
                            }}
                            onBlur={(e) => {
                              const val = Number(e.target.value);
                              if (!isNaN(val) && val !== p.price) {
                                handlePriceUpdate(p.id, val);
                              }
                            }}
                            className="w-20 bg-white/[0.05] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#B88A32]"
                          />
                        </td>
                        <td className="py-4 px-4 font-mono font-bold">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStockUpdate(p.id, p.stock_quantity - 1)}
                              className="w-6 h-6 rounded bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-neutral-300 font-bold hover:text-white"
                              title="Decrease stock"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              defaultValue={p.stock_quantity}
                              key={`stock-${p.id}-${p.stock_quantity}`}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") e.currentTarget.blur();
                              }}
                              onBlur={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val) && val !== p.stock_quantity) {
                                  handleStockUpdate(p.id, Math.max(0, val));
                                }
                              }}
                              className={`w-14 text-center bg-white/[0.04] border rounded px-1 py-0.5 text-xs font-mono font-bold focus:outline-none focus:border-[#B88A32] ${
                                p.stock_quantity <= 5
                                  ? "border-red-500/40 text-red-400 bg-red-500/10"
                                  : "border-white/10 text-white"
                              }`}
                            />
                            <button
                              onClick={() => handleStockUpdate(p.id, p.stock_quantity + 1)}
                              className="w-6 h-6 rounded bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-neutral-300 font-bold hover:text-white"
                              title="Increase stock"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleProductStatus(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border transition-all ${
                              p.status === "active"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : p.status === "out_of_stock"
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                : "bg-neutral-500/10 border-neutral-500/30 text-neutral-400"
                            }`}
                          >
                            {p.status}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleProductStatus(p)}
                              className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-neutral-300"
                            >
                              {p.status === "active" ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono transition-colors"
                              title="Deactivate Frame"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="space-y-6">
            <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl p-4 sm:p-5 shadow-lg flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Clinic Appointments Registry</h3>
                <p className="text-xs text-neutral-400 font-mono">Dr. Sheeraz Ahmad Vision Care Clinic Bookings</p>
              </div>
              <span className="text-xs font-mono text-[#B88A32]">{appointments.length} appointments booked</span>
            </div>

            <div className="bg-[#121218] border border-[#B88A32]/20 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white/[0.03] border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Patient Name</th>
                      <th className="py-3.5 px-4 font-semibold">Phone</th>
                      <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                      <th className="py-3.5 px-4 font-semibold">Clinical Concern</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-200">
                    {appointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-neutral-500">
                          No clinic appointments booked yet.
                        </td>
                      </tr>
                    ) : (
                      appointments.map((a) => (
                        <tr key={a.appointmentId} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-4 font-semibold text-white">{a.name}</td>
                          <td className="py-4 px-4">+91 {a.phone}</td>
                          <td className="py-4 px-4 text-[#B88A32] font-semibold">
                            {a.preferredDate} &bull; {a.preferredTime}
                          </td>
                          <td className="py-4 px-4 text-neutral-300 max-w-xs truncate">
                            {a.concern || "Routine Eye Examination"}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                              a.status === "confirmed"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : a.status === "completed"
                                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                : a.status === "cancelled"
                                ? "bg-red-500/10 border-red-500/30 text-red-400"
                                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={a.status}
                                onChange={(e) => handleUpdateAptStatus(a.appointmentId, e.target.value)}
                                className="bg-white/[0.05] border border-white/10 rounded px-2 py-1 text-xs text-neutral-300 focus:outline-none focus:border-[#B88A32]"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>

                              <a
                                href={`https://wa.me/91${a.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                  `Hello ${a.name}, this is Dr. Sheeraz Ahmad's Clinic confirming your appointment on ${a.preferredDate} at ${a.preferredTime}.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 transition-colors"
                                title="Send WhatsApp Reminder"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>

                              {a.attachmentUrl && (
                                <a
                                  href={a.attachmentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-[#B88A32]/20 text-[#B88A32] hover:bg-[#B88A32]/30 transition-colors"
                                  title={`View Attached Prescription: ${a.attachmentName || "File"}`}
                                >
                                  <Paperclip className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Order Details Drawer */}
      <AnimatePresence>
        {orderDrawerOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-[#121218] border border-[#B88A32]/30 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex justify-between items-start pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono text-[#8B7355] uppercase tracking-wider block">
                    ORDER RECORD
                  </span>
                  <h3 className="text-xl font-mono font-bold text-[#B88A32]">
                    {selectedOrder.order_number}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    Placed on {new Date(selectedOrder.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  onClick={() => setOrderDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Update Form */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#B88A32]/20 space-y-3">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Pencil className="w-3.5 h-3.5 text-[#B88A32]" /> Update Fulfillment & Payment
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                      Order Status
                    </label>
                    <select
                      value={newOrderStatus}
                      onChange={(e) => setNewOrderStatus(e.target.value)}
                      className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#B88A32]"
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                      Payment Status
                    </label>
                    <select
                      value={newPaymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value)}
                      className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#B88A32]"
                    >
                      {PAYMENT_STATUSES.map((pst) => (
                        <option key={pst} value={pst}>{pst}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Internal Note / Audit Reason
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dispatched with BlueDart AWB #98765432"
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#B88A32]"
                  />
                </div>

                <button
                  onClick={handleUpdateOrderStatus}
                  disabled={updatingStatus}
                  className="w-full bg-[#B88A32] hover:bg-[#A07828] text-white py-2.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {updatingStatus ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" /> Save Status & Append to Audit Log
                    </>
                  )}
                </button>
              </div>

              {/* Client & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                    Customer Profile
                  </span>
                  <p className="font-bold text-white text-sm">
                    {selectedOrder.customer?.full_name}
                  </p>
                  <p className="text-neutral-400 mt-1">Phone: +91 {selectedOrder.customer?.phone}</p>
                  {selectedOrder.customer?.email && (
                    <p className="text-neutral-400">Email: {selectedOrder.customer?.email}</p>
                  )}
                  <a
                    href={`https://wa.me/91${(selectedOrder.customer?.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello ${selectedOrder.customer?.full_name || selectedOrder.customer?.name || "Customer"}, this is ALIG'S WARE regarding your order ${selectedOrder.order_number}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Direct WhatsApp
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                    Delivery Address
                  </span>
                  <p className="text-neutral-300 leading-relaxed">
                    {selectedOrder.customer?.address}
                    <br />
                    {selectedOrder.customer?.city}, {selectedOrder.customer?.state} -{" "}
                    {selectedOrder.customer?.pincode}
                  </p>
                  {selectedOrder.customer_notes && (
                    <p className="text-amber-300 mt-2 text-[11px] bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                      Note: {selectedOrder.customer_notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Optical Prescription File Attachment */}
              {selectedOrder.prescription_url && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-[#B88A32]/30 space-y-2">
                  <span className="text-[10px] text-[#B88A32] uppercase tracking-wider font-mono font-bold flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5" /> Attached Optical Prescription (InsForge Storage)
                  </span>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-semibold text-white truncate">
                        {selectedOrder.prescription_name || "Prescription File"}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-mono">
                        Customer uploaded document for custom lens crafting
                      </p>
                    </div>
                    <a
                      href={selectedOrder.prescription_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#B88A32] hover:bg-[#A07828] text-white text-xs font-mono font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View File</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Items Table Snapshot */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                  Order Items Snapshot (Immutable Prices)
                </span>
                <div className="rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5 text-xs font-mono">
                  {selectedOrder.items?.map((it: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white/[0.02] flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-white">{it.product_name_snapshot || it.name}</p>
                        <p className="text-neutral-400 text-[11px]">
                          Qty: {it.quantity} &bull; Unit Snapshot: ₹{it.unit_price || it.price}
                        </p>
                      </div>
                      <span className="font-bold text-[#B88A32]">
                        ₹{it.total_price || it.unit_price * it.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="p-3 bg-white/[0.04] flex justify-between items-center font-bold text-sm">
                    <span>Total Amount</span>
                    <span className="text-[#B88A32]">₹{Number(selectedOrder.total_amount).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Status History Audit Trail */}
              {selectedOrder.history && selectedOrder.history.length > 0 && (
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                    Official Audit Trail Timeline
                  </span>
                  <div className="space-y-2 text-xs font-mono">
                    {selectedOrder.history.map((h: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex justify-between items-center"
                      >
                        <div>
                          <span className="text-[#B88A32] font-bold uppercase">{h.new_status || h.status}</span>
                          <span className="text-neutral-300 ml-2">&mdash; {h.note}</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">
                          {new Date(h.changed_at).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customer Profile Drawer */}
      <AnimatePresence>
        {customerDrawerOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-[#121218] border border-[#B88A32]/30 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex justify-between items-start pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono text-[#8B7355] uppercase tracking-wider block">
                    CLIENT DOSSIER
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {selectedCustomer.full_name || selectedCustomer.fullName}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    +91 {selectedCustomer.phone} &bull; {selectedCustomer.email || "No Email"}
                  </p>
                  <a
                    href={`https://wa.me/91${(selectedCustomer.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello ${selectedCustomer.full_name || selectedCustomer.fullName || "Valued Client"}, this is ALIG'S WARE Atelier Concierge.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Direct WhatsApp Client
                  </a>
                </div>
                <button
                  onClick={() => setCustomerDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-neutral-400 block text-[10px] uppercase">Lifetime Spend</span>
                  <span className="text-xl font-bold text-[#B88A32]">
                    ₹{(selectedCustomer.totalSpent || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-neutral-400 block text-[10px] uppercase">Total Orders</span>
                  <span className="text-xl font-bold text-white">
                    {selectedCustomer.totalOrders || selectedCustomer.orderCount || 0}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                  Order History (Click to Inspect)
                </span>
                <div className="space-y-3 font-mono text-xs">
                  {selectedCustomer.orders?.map((co: any) => (
                    <div
                      key={co.order_number}
                      onClick={() => {
                        setCustomerDrawerOpen(false);
                        handleOpenOrder(co.order_number);
                      }}
                      className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-[#B88A32]/40 flex justify-between items-center cursor-pointer transition-all group"
                      title="Inspect this order in fulfillment drawer"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-[#B88A32] group-hover:underline">{co.order_number}</p>
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#B88A32] transition-colors" />
                        </div>
                        <p className="text-neutral-400 text-[11px] mt-0.5">
                          {co.items?.length || 1} frame(s) &bull; {new Date(co.created_at).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white block">₹{Number(co.total_amount).toLocaleString("en-IN")}</span>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">{co.order_status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#121218] border border-[#B88A32]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h3 className="font-serif font-bold text-lg text-white">
                  Add New Bespoke Eyewear Frame
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs font-mono">
                <div>
                  <label className="text-[10px] uppercase text-neutral-400 block mb-1">Frame Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Versailles Gold Aviator"
                    value={newProdForm.name}
                    onChange={(e) => setNewProdForm({ ...newProdForm, name: e.target.value })}
                    className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B88A32]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-neutral-400 block mb-1">Category</label>
                    <select
                      value={newProdForm.category}
                      onChange={(e) => setNewProdForm({ ...newProdForm, category: e.target.value })}
                      className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B88A32]"
                    >
                      {availableCategories.filter((c) => c !== "All").map((c) => {
                        const label = c
                          .split(/[-_]/)
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ");
                        return (
                          <option key={c} value={c}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-neutral-400 block mb-1">SKU</label>
                    <input
                      type="text"
                      placeholder="ALG-VRS-01"
                      value={newProdForm.sku}
                      onChange={(e) => setNewProdForm({ ...newProdForm, sku: e.target.value })}
                      className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B88A32]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-neutral-400 block mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newProdForm.price}
                      onChange={(e) => setNewProdForm({ ...newProdForm, price: Number(e.target.value) })}
                      className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B88A32]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-neutral-400 block mb-1">Original (₹)</label>
                    <input
                      type="number"
                      value={newProdForm.original_price}
                      onChange={(e) => setNewProdForm({ ...newProdForm, original_price: Number(e.target.value) })}
                      className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B88A32]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-neutral-400 block mb-1">Stock Qty</label>
                    <input
                      type="number"
                      value={newProdForm.stock_quantity}
                      onChange={(e) => setNewProdForm({ ...newProdForm, stock_quantity: Number(e.target.value) })}
                      className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B88A32]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-neutral-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newProdForm.description}
                    onChange={(e) => setNewProdForm({ ...newProdForm, description: e.target.value })}
                    className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B88A32] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProduct}
                  className="w-full bg-[#B88A32] hover:bg-[#A07828] text-white py-3 rounded-xl font-semibold transition-all shadow-md shadow-[#B88A32]/20 flex items-center justify-center gap-2 mt-2"
                >
                  {savingProduct ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save to Persistent Catalog"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Security Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#121218] border border-[#B88A32]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#B88A32]" /> Change Admin Master Password
                </h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3 text-xs font-mono">
                <div>
                  <label className="text-[10px] uppercase text-neutral-400 block mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B88A32]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-neutral-400 block mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B88A32]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-neutral-400 block mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B88A32]"
                  />
                </div>

                {pwMsg && (
                  <p className={`text-xs text-center font-mono ${
                    pwMsg.type === "success" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {pwMsg.text}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#B88A32] hover:bg-[#A07828] text-white py-3 rounded-xl font-semibold transition-all shadow-md shadow-[#B88A32]/20 flex items-center justify-center gap-2 mt-2"
                >
                  Update Master Password
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Executive Luxury Toast Notification Pill */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 font-mono text-xs max-w-md ${
              toast.type === "success"
                ? "bg-[#121218]/95 border-emerald-500/40 text-emerald-300 shadow-emerald-500/10"
                : toast.type === "error"
                ? "bg-[#121218]/95 border-red-500/40 text-red-300 shadow-red-500/10"
                : "bg-[#121218]/95 border-[#B88A32]/40 text-[#B88A32] shadow-[#B88A32]/10"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                toast.type === "success"
                  ? "bg-emerald-400 animate-pulse"
                  : toast.type === "error"
                  ? "bg-red-400"
                  : "bg-[#B88A32]"
              }`}
            />
            <span className="flex-1 font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 opacity-60 hover:opacity-100 transition-opacity p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
