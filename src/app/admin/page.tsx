/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetPurchaseAnalyticsQuery,
  useGetReviewAnalyticsQuery,
  useGetDownloadAnalyticsQuery,
  useGetAllPurchasesQuery,
  useGetDesignsQuery,
  useGetPricingPlansQuery,
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
  const { data: plansData } = useGetPricingPlansQuery({ limit: 5 });


  // console.log(reviewAnalytics);
  // console.log(downloadAnalytics);
  // console.log(designsData);
  // console.log(plansData);
  console.log(reviewAnalytics);

  



  const stats = [
    {
      name: "Total Revenue",
      value: `$${purchaseAnalytics?.data?.overview.totalRevenue?.toFixed(2) || "0.00"}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "from-primary to-primary",
    },
    {
      name: "Total Purchases",
      value: purchaseAnalytics?.data?.overview.totalPurchases || "0",
      change: "+8.3%",
      icon: ShoppingCart,
      color: "from-primary to-primary",
    },
    {
      name: "Active Designs",
      value: designsData?.pagination?.totalItems || "0",
      change: "+3.2%",
      icon: Package,
      color: "from-primary to-primary",
    },
    {
      name: "Total Downloads",
      value: downloadAnalytics?.data?.overview.totalDownloads || "0",
      change: "+15.8%",
      icon: Download,
      color: "from-primary to-primary",
    },
  ];

  return (
    <div className="space-y-6 ">
      {/* Ultra-Modern Page Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-6 shadow-2xl dark:shadow-primary/20">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-secondary drop-shadow-lg">
                Dashboard Overview
              </h1>
              <p className="mt-2 text-base text-secondary/90 font-medium">
                Welcome back! Here&apos;s what&apos;s happening with your
                platform.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="bg-secondary/20 backdrop-blur-xl px-5 py-2.5 rounded-2xl border-2 border-secondary/30">
                <p className="text-xs text-secondary/80 font-bold">Today</p>
                <p className="text-lg font-black text-secondary">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-Modern Stats Grid with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="group relative bg-gradient-to-br from-card to-card/50 dark:from-[#141414] dark:to-[#0a0a0a] rounded-3xl shadow-2xl border-2 border-border p-5 hover:shadow-primary/20 hover:scale-105 transition-all duration-500 hover:border-primary/50 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Animated Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-black text-foreground group-hover:text-primary transition-colors duration-300">
                    {stat.value}
                  </p>
                  <div className="mt-2 flex items-center text-xs">
                    <div className="flex items-center bg-primary/10 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3 text-primary mr-1" />
                      <span className="text-primary font-black">
                        {stat.change}
                      </span>
                    </div>
                    <span className="text-muted-foreground ml-2 font-medium">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/50 group-hover:scale-110 transition-all duration-500">
                  <Icon className="w-7 h-7 text-secondary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ultra-Modern Charts Row with Enhanced Design */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Purchases - Enhanced */}
        <div className="group relative bg-gradient-to-br from-card to-card/50 dark:from-[#141414] dark:to-[#0a0a0a] rounded-3xl shadow-2xl border-2 border-border p-6 hover:shadow-primary/20 transition-all duration-500 overflow-hidden">
          {/* Decorative Element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">
                  Recent Purchases
                </h2>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Latest transactions
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-secondary" />
              </div>
            </div>
            {purchaseLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {purchasesData?.data
                  ?.slice(0, 5)
                  .map((purchase: any, index: number) => (
                    <div
                      key={purchase._id}
                      className="group/item flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-muted/50 to-transparent hover:from-primary/10 hover:to-primary/5 border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover/item:from-primary/30 group-hover/item:to-primary/10 transition-all">
                          <ShoppingCart className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-black text-sm text-foreground group-hover/item:text-primary transition-colors">
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
                                year: "numeric"
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-base text-foreground">
                          {purchase.currencyDisplay}
                          {purchase.amount?.toFixed(2)}
                        </p>
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-black rounded-full ${
                            purchase.status === "completed"
                              ? "bg-primary/20 text-primary border-2 border-primary/30"
                              : purchase.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                              : "bg-muted text-foreground border-2 border-border"
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </div>
                    </div>
                  )) || (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium text-sm">
                      No purchases yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Review Stats - Ultra Enhanced */}
        <div className="group relative bg-gradient-to-br from-card to-card/50 dark:from-[#141414] dark:to-[#0a0a0a] rounded-3xl shadow-2xl border-2 border-border p-6 hover:shadow-primary/20 transition-all duration-500 overflow-hidden">
          {/* Decorative Element */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-all duration-500"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">
                  Review Statistics
                </h2>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Customer feedback
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
            {reviewLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10 border-2 border-yellow-200 dark:border-yellow-500/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 blur-xl"></div>
                  <div className="relative">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                      Average Rating
                    </p>
                    <p className="text-4xl font-black text-foreground mt-2">
                      {reviewAnalytics?.data?.overview.averageRating?.toFixed(
                        1
                      ) || "0.0"}
                    </p>
                  </div>
                  <div className="relative flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i <
                          Math.floor(
                            reviewAnalytics?.data?.overview.averageRating || 0
                          )
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="group/stat p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 hover:scale-105 transition-all duration-300">
                    <Users className="w-7 h-7 text-primary mb-2" />
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                      Total Reviews
                    </p>
                    <p className="text-2xl font-black text-foreground mt-1">
                      {reviewAnalytics?.data?.overview.totalReviews || "0"}
                    </p>
                  </div>
                  <div className="group/stat p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 hover:scale-105 transition-all duration-300">
                    <TrendingUp className="w-7 h-7 text-primary mb-2" />
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                      Helpful Reviews
                    </p>
                    <p className="text-2xl font-black text-foreground mt-1">
                      {reviewAnalytics?.data?.overview?.helpfulReviews || "0"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ultra-Modern Quick Actions */}
      <div className="relative bg-gradient-to-br from-card to-card/50 dark:from-[#141414] dark:to-[#0a0a0a] rounded-3xl shadow-2xl border-2 border-border p-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]"></div>

        <div className="relative">
          <div className="mb-5">
            <h2 className="text-xl font-black text-foreground">
              Quick Actions
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Manage your platform efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              href="/admin/designs"
              className="group relative flex items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-secondary hover:shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
                  <Package className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <span className="font-black text-base">Add New Design</span>
                  <p className="text-xs text-secondary/80 font-medium">
                    Upload design files
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/admin/pricing-plans"
              className="group relative flex items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-secondary hover:shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <span className="font-black text-base">Pricing Plan</span>
                  <p className="text-xs text-secondary/80 font-medium">
                    Create subscription
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/admin/categories"
              className="group relative flex items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-secondary hover:shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <span className="font-black text-base">Add Category</span>
                  <p className="text-xs text-secondary/80 font-medium">
                    Organize designs
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
