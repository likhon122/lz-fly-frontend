"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useGetAllPurchasesQuery,
  useUpdatePurchaseStatusMutation,
  useGetPurchaseAnalyticsQuery,
} from "@/services/api";
import {
  ShoppingCart,
  Filter,
  Eye,
  Search,
  TrendingUp,
  Users,
  Calendar,
  CreditCard,
  Package,
  ArrowUpRight,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/components/ToastProvider";

type PurchaseStatus =
  | "pending"
  | "completed"
  | "expired"
  | "cancelled"
  | "refunded";
type PaymentMethod =
  | "credit_card"
  | "paypal"
  | "stripe"
  | "bank_transfer"
  | "free";
type SortField = "purchaseDate" | "createdAt" | "updatedAt";
type PurchaseType = "individual" | "subscription";

interface Purchase {
  _id: string;
  purchaseType: PurchaseType;
  user?: {
    name?: string;
    email?: string;
  };
  design?: {
    title?: string;
  };
  pricingPlan?: {
    name?: string;
    duration?: string;
  };
  currencyDisplay?: string;
  currencyCode?: string;
  amount: number;
  currency?: string;
  status: PurchaseStatus;
  paymentMethod?: PaymentMethod;
  purchaseDate?: string;
  createdAt: string;
  updatedAt?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  remainingDownloads?: number;
  activatedAt?: string;
  notes?: string;
  adminNotes?: string;
}

export default function PurchasesPage() {
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<PurchaseType | "">("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<
    PaymentMethod | ""
  >("");
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [minAmount, setMinAmount] = useState<number | undefined>();
  const [maxAmount, setMaxAmount] = useState<number | undefined>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // UI States
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [showAdminNotesModal, setShowAdminNotesModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedPurchaseForNotes, setSelectedPurchaseForNotes] =
    useState<Purchase | null>(null);
  const [pendingStatusChange, setPendingStatusChange] =
    useState<PurchaseStatus | null>(null);

  // API Queries - Memoize query parameters to ensure proper refetching
  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      status: statusFilter || undefined,
      purchaseType: typeFilter || undefined,
      paymentMethod: paymentMethodFilter || undefined,
      sortBy,
      sortOrder,
      minAmount,
      maxAmount,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [
      page,
      limit,
      search,
      statusFilter,
      typeFilter,
      paymentMethodFilter,
      sortBy,
      sortOrder,
      minAmount,
      maxAmount,
      startDate,
      endDate,
    ]
  );

  const { data, isLoading, refetch } = useGetAllPurchasesQuery(queryParams);
  const { data: analyticsData } = useGetPurchaseAnalyticsQuery({
    period: "monthly",
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdatePurchaseStatusMutation();

  const toast = useToast();

  const purchases: Purchase[] = useMemo(() => data?.data || [], [data?.data]);
  const analytics = analyticsData?.data?.overview;

  // Reset page to 1 when filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    search,
    statusFilter,
    typeFilter,
    paymentMethodFilter,
    sortBy,
    sortOrder,
    minAmount,
    maxAmount,
    startDate,
    endDate,
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!purchases.length) return null;

    const totalRevenue = purchases.reduce(
      (sum: number, p: Purchase) => sum + (p.amount || 0),
      0
    );
    const completed = purchases.filter(
      (p: Purchase) => p.status === "completed"
    ).length;
    const pending = purchases.filter(
      (p: Purchase) => p.status === "pending"
    ).length;
    const cancelled = purchases.filter(
      (p: Purchase) => p.status === "cancelled" || p.status === "refunded"
    ).length;

    return {
      totalRevenue,
      completed,
      pending,
      cancelled,
      conversionRate:
        purchases.length > 0
          ? ((completed / purchases.length) * 100).toFixed(1)
          : "0",
    };
  }, [purchases]);

  const handleStatusUpdate = async (
    id: string,
    status: PurchaseStatus,
    notes?: string
  ) => {
    try {
      await updateStatus({
        id,
        status,
        adminNotes: notes,
      }).unwrap();
      refetch();
      setShowAdminNotesModal(false);
      setSelectedPurchaseForNotes(null);
      setPendingStatusChange(null);
      setAdminNotes("");
      toast.success(`Status updated to ${status} successfully!`);
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to update status";
      toast.error(message || "Failed to update status");
    }
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");
    setPaymentMethodFilter("");
    setMinAmount(undefined);
    setMaxAmount(undefined);
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const getStatusIcon = (status: PurchaseStatus | string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
      case "refunded":
        return <XCircle className="w-4 h-4" />;
      case "expired":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: PurchaseStatus | string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
      case "cancelled":
      case "refunded":
        return "bg-red-500/10 text-red-600 border border-red-500/20";
      case "expired":
        return "bg-muted text-muted-foreground border border-border";
      default:
        return "bg-muted text-foreground border border-border";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Purchase Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and monitor all customer purchases and subscriptions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted text-foreground transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>{showFilters ? "Hide" : "Show"} Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Revenue */}
          <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Revenue
              </span>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {purchases[0]?.currencyDisplay ?? "৳"}
              {analytics?.totalRevenue != null ? analytics.totalRevenue.toFixed(2) : "0.00"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">All time earnings</p>
          </div>

          {/* Total Purchases */}
          <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Purchases
              </span>
              <ShoppingCart className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {analytics.totalPurchases || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Lifetime orders</p>
          </div>

          {/* Completed */}
          <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Completed
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {analytics.activePurchases || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Active purchases</p>
          </div>

          {/* Pending */}
          <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pending
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {analytics.pendingPurchases || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
          </div>

          {/* Average Order Value */}
          <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Avg Order Value
              </span>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {purchases[0]?.currencyDisplay ?? "৳"}
              {analytics?.averageOrderValue != null ? analytics.averageOrderValue.toFixed(2) : "0.00"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
          </div>
        </div>
      )}

      {/* Page Stats (from current filter) */}
      {stats && (
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {purchases[0]?.currencyDisplay ?? "৳"}
                {stats.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Page Revenue</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.completed}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {stats.pending}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Cancelled</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.conversionRate}%
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Conversion</p>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">
              Advanced Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Search Customer
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Name or email..."
                  className="w-full pl-9 pr-3.5 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as PurchaseStatus | "")
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Purchase Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as PurchaseType | "")
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">All Types</option>
                <option value="individual">Individual</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethodFilter}
                onChange={(e) =>
                  setPaymentMethodFilter(e.target.value as PaymentMethod | "")
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">All Methods</option>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="free">Free</option>
              </select>
            </div>

            {/* Min Amount */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Min Amount
              </label>
              <input
                type="number"
                value={minAmount || ""}
                onChange={(e) =>
                  setMinAmount(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                placeholder="0.00"
                className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
              />
            </div>

            {/* Max Amount */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Max Amount
              </label>
              <input
                type="number"
                value={maxAmount || ""}
                onChange={(e) =>
                  setMaxAmount(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                placeholder="999.99"
                className="w-full px-3.5 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Purchases Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-3"></div>
            <p className="text-sm text-muted-foreground">Loading purchases...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Date</span>
                      {sortBy === "createdAt" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ))}
                    </div>
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {purchases.map((purchase: Purchase) => (
                  <tr
                    key={purchase._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs font-bold text-foreground">
                        #{purchase._id.slice(-8).toUpperCase()}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                          purchase.purchaseType === "subscription"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-muted text-foreground border border-border"
                        }`}
                      >
                        {purchase.purchaseType === "subscription" ? (
                          <RefreshCw className="w-3 h-3" />
                        ) : (
                          <Package className="w-3 h-3" />
                        )}
                        <span className="capitalize">{purchase.purchaseType}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                          {purchase.user?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {purchase.user?.name || "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {purchase.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {purchase.design?.title ||
                            purchase.pricingPlan?.name ||
                            "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {purchase.purchaseType === "subscription"
                            ? `${purchase.pricingPlan?.duration || "N/A"}`
                            : "One-time purchase"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-bold text-foreground">
                        {purchase.currencyDisplay ?? "৳"}
                        {purchase.amount?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {purchase.currency?.toUpperCase() || "BDT"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground capitalize">
                          {purchase.paymentMethod?.replace("_", " ") || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={purchase.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as PurchaseStatus;
                          if (
                            newStatus === "completed" ||
                            newStatus === "refunded"
                          ) {
                            setSelectedPurchaseForNotes(purchase);
                            setPendingStatusChange(newStatus);
                            setShowAdminNotesModal(true);
                          } else {
                            handleStatusUpdate(purchase._id, newStatus);
                          }
                        }}
                        disabled={isUpdating}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer focus:outline-none transition-colors ${getStatusColor(
                          purchase.status
                        )} disabled:opacity-50`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-foreground">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(purchase.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedPurchase(purchase)}
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted transition-colors inline-flex items-center"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {purchases.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No purchases found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted text-sm font-medium text-foreground disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-muted-foreground font-medium">
            Page {page} of {data.pagination.pages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= data.pagination.pages}
            className="px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted text-sm font-medium text-foreground disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Enhanced Detail Modal */}
      {selectedPurchase && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPurchase(null)}
        >
          <div
            className="bg-card rounded-xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border p-4 sm:p-5 rounded-t-xl z-10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Purchase Details</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Order #{selectedPurchase._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold ${getStatusColor(
                  selectedPurchase.status
                )}`}
              >
                {getStatusIcon(selectedPurchase.status)}
                <span className="capitalize">{selectedPurchase.status}</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              {/* Customer Information */}
              <div className="bg-muted/30 rounded-xl p-4 sm:p-5 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">
                    Customer Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Name</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {selectedPurchase.user?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {selectedPurchase.user?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchase Information */}
              <div className="bg-muted/30 rounded-xl p-4 sm:p-5 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">
                    Purchase Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Purchase Type
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-0.5 capitalize">
                      {selectedPurchase.purchaseType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Item</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {selectedPurchase.design?.title ||
                        selectedPurchase.pricingPlan?.name ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">
                      {selectedPurchase.currencyDisplay}
                      {selectedPurchase.amount?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Currency
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {selectedPurchase.currency?.toUpperCase() || "USD"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Payment Method
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-0.5 capitalize">
                      {selectedPurchase.paymentMethod?.replace("_", " ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Purchase Date
                    </p>
                    <p className="text-sm text-foreground mt-0.5">
                      {new Date(
                        selectedPurchase.purchaseDate ||
                          selectedPurchase.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscription Details (if applicable) */}
              {selectedPurchase.purchaseType === "subscription" && (
                <div className="bg-muted/30 rounded-xl p-4 sm:p-5 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCw className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-semibold text-foreground">
                      Subscription Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Plan Name
                      </p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {selectedPurchase.pricingPlan?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Duration
                      </p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {selectedPurchase.pricingPlan?.duration || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Start Date
                      </p>
                      <p className="text-sm text-foreground mt-0.5">
                        {selectedPurchase.subscriptionStartDate
                          ? new Date(
                              selectedPurchase.subscriptionStartDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        End Date
                      </p>
                      <p className="text-sm text-foreground mt-0.5">
                        {selectedPurchase.subscriptionEndDate
                          ? new Date(
                              selectedPurchase.subscriptionEndDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Downloads Remaining
                      </p>
                      <p className="text-lg font-bold text-foreground mt-0.5">
                        {selectedPurchase.remainingDownloads ?? "Unlimited"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Activated At
                      </p>
                      <p className="text-sm text-foreground mt-0.5">
                        {selectedPurchase.activatedAt
                          ? new Date(
                              selectedPurchase.activatedAt
                            ).toLocaleString()
                          : "Not activated"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Address */}
              {selectedPurchase.billingAddress && (
                <div className="bg-muted/30 rounded-xl p-4 sm:p-5 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-semibold text-foreground">
                      Billing Address
                    </h3>
                  </div>
                  <div className="space-y-1 text-sm text-foreground">
                    <p>{selectedPurchase.billingAddress.street}</p>
                    <p>
                      {selectedPurchase.billingAddress.city},{" "}
                      {selectedPurchase.billingAddress.state}{" "}
                      {selectedPurchase.billingAddress.zipCode}
                    </p>
                    <p className="font-semibold">
                      {selectedPurchase.billingAddress.country}
                    </p>
                  </div>
                </div>
              )}

              {/* Notes Section */}
              <div className="bg-muted/30 rounded-xl p-4 sm:p-5 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-base font-semibold text-foreground">Notes</h3>
                </div>
                <div className="space-y-3">
                  {selectedPurchase.notes && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Customer Notes
                      </p>
                      <p className="text-sm text-foreground bg-card p-3 rounded-lg border border-border">
                        {selectedPurchase.notes}
                      </p>
                    </div>
                  )}
                  {selectedPurchase.adminNotes && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Admin Notes
                      </p>
                      <p className="text-sm text-foreground bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                        {selectedPurchase.adminNotes}
                      </p>
                    </div>
                  )}
                  {!selectedPurchase.notes && !selectedPurchase.adminNotes && (
                    <p className="text-sm text-muted-foreground italic">
                      No notes available
                    </p>
                  )}
                  <button
                    onClick={() => {
                      setSelectedPurchaseForNotes(selectedPurchase);
                      setPendingStatusChange(selectedPurchase.status);
                      setShowAdminNotesModal(true);
                      setSelectedPurchase(null);
                    }}
                    className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Add Admin Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-card p-4 sm:p-5 rounded-b-xl border-t border-border z-10">
              <button
                onClick={() => setSelectedPurchase(null)}
                className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Notes Modal */}
      {showAdminNotesModal &&
        selectedPurchaseForNotes &&
        pendingStatusChange && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowAdminNotesModal(false);
              setSelectedPurchaseForNotes(null);
              setPendingStatusChange(null);
              setAdminNotes("");
            }}
          >
            <div
              className="bg-card rounded-xl border border-border max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-muted/40 border-b border-border p-4 sm:p-5">
                <h2 className="text-lg font-bold text-foreground">
                  Update Purchase Status
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Order #{selectedPurchaseForNotes._id.slice(-8).toUpperCase()}{" "}
                  →{" "}
                  <span className="font-semibold text-foreground capitalize">
                    {pendingStatusChange}
                  </span>
                </p>
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-sm text-amber-700 dark:text-amber-400">
                  <p>
                    You are changing the status to{" "}
                    <strong className="capitalize">{pendingStatusChange}</strong>.
                    Please add any relevant notes below.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add any internal notes about this status change..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-3.5 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground focus:outline-none focus:border-primary resize-none placeholder:text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {adminNotes.length}/500 characters
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowAdminNotesModal(false);
                      setSelectedPurchaseForNotes(null);
                      setPendingStatusChange(null);
                      setAdminNotes("");
                    }}
                    className="flex-1 px-4 py-2 bg-background border border-border hover:bg-muted rounded-lg font-semibold text-sm text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (pendingStatusChange) {
                        handleStatusUpdate(
                          selectedPurchaseForNotes._id,
                          pendingStatusChange,
                          adminNotes || undefined
                        );
                        setPendingStatusChange(null);
                      }
                    }}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
