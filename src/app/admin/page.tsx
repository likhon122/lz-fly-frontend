/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetPurchaseAnalyticsQuery,
  useGetReviewAnalyticsQuery,
  useGetDownloadAnalyticsQuery,
  useGetAllPurchasesQuery,
  useGetDesignsQuery,
} from "@/services/api";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Star,
  Download,
  Users,
  Activity,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: purchaseAnalytics, isLoading: purchaseLoading } =
    useGetPurchaseAnalyticsQuery({ period: "monthly" });
  const { data: reviewAnalytics, isLoading: reviewLoading } =
    useGetReviewAnalyticsQuery({ period: "monthly" });
  const { data: downloadAnalytics, isLoading: downloadLoading } =
    useGetDownloadAnalyticsQuery({ period: "monthly" });
  const { data: purchasesData } = useGetAllPurchasesQuery({ limit: 5 });
  const { data: designsData } = useGetDesignsQuery({ limit: 5 });

  const stats = [
    {
      name: "Total Revenue",
      value: `$${purchaseAnalytics?.data?.overview.totalRevenue?.toFixed(2) || "0.00"}`,
      change: "+12.5%",
      icon: DollarSign,
    },
    {
      name: "Total Purchases",
      value: purchaseAnalytics?.data?.overview.totalPurchases || "0",
      change: "+8.3%",
      icon: ShoppingCart,
    },
    {
      name: "Active Designs",
      value: designsData?.pagination?.totalItems || "0",
      change: "+3.2%",
      icon: Package,
    },
    {
      name: "Total Downloads",
      value: downloadAnalytics?.data?.overview.totalDownloads || "0",
      change: "+15.8%",
      icon: Download,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted/40 border border-border rounded text-xs font-bold text-foreground uppercase tracking-wider mb-2">
            LZ Fly Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-medium">
            Real-time analytics, revenue, downloads, and catalog activity.
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 bg-muted/30 rounded-lg border border-border text-sm font-semibold text-foreground">
          <span className="text-muted-foreground">Today:</span>
          <span>
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-card rounded-xl border border-border p-5 hover:border-foreground/40 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {stat.name}
                </p>
                <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">
                  {stat.value}
                </p>
                <div className="mt-2 flex items-center text-xs">
                  <span className="inline-flex items-center text-primary font-bold">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground ml-2 font-medium">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-muted/40 border border-border flex items-center justify-center text-primary shrink-0">
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Purchases & Review Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchases */}
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-muted/40 border border-border flex items-center justify-center text-primary">
                  <Activity className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Recent Purchases
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    Latest customer transactions
                  </p>
                </div>
              </div>
              <Link
                href="/admin/purchases"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {purchaseLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-7 h-7 rounded-full border-2 border-border border-t-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-2.5">
                {purchasesData?.data
                  ?.slice(0, 5)
                  .map((purchase: any) => (
                    <div
                      key={purchase._id}
                      className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-background hover:border-foreground/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-muted/40 border border-border flex items-center justify-center text-primary shrink-0">
                          <ShoppingCart className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">
                            {purchase.purchaseType === "subscription"
                              ? "Subscription Plan"
                              : "Individual Design"}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">
                            {new Date(purchase.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-foreground">
                          {purchase.currencyDisplay}
                          {purchase.amount?.toFixed(2)}
                        </p>
                        <span
                          className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded border ${
                            purchase.status === "completed"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : purchase.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </div>
                    </div>
                  )) || (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-muted-foreground font-medium text-sm">
                      No purchases recorded yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Review Statistics */}
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-muted/40 border border-border flex items-center justify-center text-primary">
                  <Star className="w-4.5 h-4.5 fill-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Review Statistics
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    Customer ratings and quality feedback
                  </p>
                </div>
              </div>
              <Link
                href="/admin/reviews"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {reviewLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-7 h-7 rounded-full border-2 border-border border-t-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Average Rating
                    </p>
                    <p className="text-3xl font-extrabold text-foreground mt-1">
                      {reviewAnalytics?.data?.overview.averageRating?.toFixed(
                        1
                      ) || "0.0"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i <
                          Math.floor(
                            reviewAnalytics?.data?.overview.averageRating || 0
                          )
                            ? "text-primary fill-primary"
                            : "text-muted-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <Users className="w-5 h-5 text-primary mb-2" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Total Reviews
                    </p>
                    <p className="text-xl font-bold text-foreground mt-1">
                      {reviewAnalytics?.data?.overview.totalReviews || "0"}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <TrendingUp className="w-5 h-5 text-primary mb-2" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Helpful Ratings
                    </p>
                    <p className="text-xl font-bold text-foreground mt-1">
                      {reviewAnalytics?.data?.overview?.helpfulReviews || "0"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-foreground">
            Administrative Shortcuts
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Direct navigation to primary management modules
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/designs"
            className="group flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:border-foreground/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted/40 border border-border flex items-center justify-center text-primary shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">
                  Design Catalog
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  Manage & upload assets
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
          </Link>

          <Link
            href="/admin/pricing-plans"
            className="group flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:border-foreground/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted/40 border border-border flex items-center justify-center text-primary shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">
                  Pricing Plans
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  Configure subscriptions
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
          </Link>

          <Link
            href="/admin/categories"
            className="group flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:border-foreground/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted/40 border border-border flex items-center justify-center text-primary shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">
                  Category Directory
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  Disciplines & tags
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
