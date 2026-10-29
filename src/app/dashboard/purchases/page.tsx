"use client";

import { useState, useMemo, useEffect } from "react";
import { useGetMyPurchasesQuery } from "@/services/api";
import {
  ShoppingBag,
  Calendar,
  DollarSign,
  Package,
  RefreshCw,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type PurchaseStatus =
  | "pending"
  | "completed"
  | "expired"
  | "cancelled"
  | "refunded";

export default function MyPurchasesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | "">("");
  const [purchaseTypeFilter, setPurchaseTypeFilter] = useState<
    "individual" | "subscription" | ""
  >("");
  const [sortBy, setSortBy] = useState<
    "purchaseDate" | "createdAt" | "updatedAt"
  >("purchaseDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const queryParams = useMemo(
    () => ({
      page,
      limit: 10,
      status: statusFilter || undefined,
      purchaseType: purchaseTypeFilter || undefined,
      sortBy,
      sortOrder,
    }),
    [page, statusFilter, purchaseTypeFilter, sortBy, sortOrder]
  );

  const { data, isLoading, refetch } = useGetMyPurchasesQuery(queryParams);
  const purchases = data?.data || [];
  const pagination = data?.pagination;

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, purchaseTypeFilter, sortBy, sortOrder]);

  const clearFilters = () => {
    setStatusFilter("");
    setPurchaseTypeFilter("");
    setSortBy("purchaseDate");
    setSortOrder("desc");
    setPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400 capitalize">
            <CheckCircle className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400 capitalize">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case "cancelled":
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400 capitalize">
            <XCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-muted text-muted-foreground border border-border capitalize">
            <AlertCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav>
        <div className="flex items-center space-x-2 text-sm font-semibold">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground">Purchases</span>
        </div>
      </nav>

      {/* Header Section (Matching Categories Style) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2.5">
            Transaction Ledger
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Purchase History
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
            Review your individual design asset licenses, active subscriptions, and
            payment receipts.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-muted text-sm font-semibold text-foreground transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <Link href="/designs">
            <Button
              variant="outline"
              className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-4 py-2.5 transition-colors"
            >
              Browse Catalog
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-border">
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {pagination?.totalItems || purchases.length}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Total Orders
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-primary">
            {purchases.filter((p: any) => p.status === "completed").length}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Completed Orders
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {purchases.filter((p: any) => p.purchaseType === "subscription").length}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Subscriptions
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {purchases.filter((p: any) => p.purchaseType === "individual").length}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Single Licenses
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 rounded-xl border border-border bg-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">Filter Orders:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 md:max-w-2xl">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PurchaseStatus | "")}
            className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={purchaseTypeFilter}
            onChange={(e) =>
              setPurchaseTypeFilter(e.target.value as "individual" | "subscription" | "")
            }
            className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">All Types</option>
            <option value="individual">Single Asset</option>
            <option value="subscription">Subscription Plan</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "purchaseDate" | "createdAt" | "updatedAt")
            }
            className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
          >
            <option value="purchaseDate">Purchase Date</option>
            <option value="createdAt">Created Date</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {(statusFilter || purchaseTypeFilter || sortBy !== "purchaseDate" || sortOrder !== "desc") && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary font-bold hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
            Loading purchases...
          </p>
        </div>
      ) : purchases.length > 0 ? (
        <div className="space-y-4">
          {purchases.map((purchase: any) => (
            <div
              key={purchase._id}
              className="p-6 rounded-xl border border-border bg-card hover:border-foreground/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg border border-border bg-muted/40 flex items-center justify-center text-foreground shrink-0">
                    {purchase.purchaseType === "subscription" ? (
                      <Package className="w-5 h-5 text-primary" />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      {purchase.purchaseType === "subscription"
                        ? purchase.pricingPlan?.name || "Subscription Plan"
                        : purchase.design?.title || "Design Asset"}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      Order ID: #{purchase._id.slice(-8).toUpperCase()} • {formatDate(purchase.purchaseDate || purchase.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">
                      ${purchase.amount?.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase">
                      {purchase.currency || "USD"}
                    </div>
                  </div>
                  {getStatusBadge(purchase.status)}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-muted-foreground">
                  <span>Type: <strong className="text-foreground capitalize">{purchase.purchaseType}</strong></span>
                  {purchase.paymentMethod && (
                    <span>Payment: <strong className="text-foreground capitalize">{purchase.paymentMethod.replace("_", " ")}</strong></span>
                  )}
                  {purchase.subscriptionEndDate && (
                    <span>Expires: <strong className="text-foreground">{formatDate(purchase.subscriptionEndDate)}</strong></span>
                  )}
                </div>

                {purchase.design?._id && (
                  <Link
                    href={`/designs/${purchase.design._id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    <span>View Asset</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-14 text-center rounded-xl border border-border bg-card">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
          <h3 className="text-base font-bold text-foreground">No purchases found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            {statusFilter || purchaseTypeFilter
              ? "No purchases match your selected filters. Try clearing your search parameters."
              : "You haven't made any purchases yet. Explore our creative asset collection."}
          </p>
          <div className="mt-5">
            <Link href="/designs">
              <Button className="bg-primary text-primary-foreground font-semibold rounded-lg text-sm px-5 py-2.5 hover:bg-primary/90 transition-colors">
                Browse Assets
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Pagination (Clean Minimalist Style) */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-5 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} items)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage || isLoading}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-sm font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNextPage || isLoading}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-sm font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
