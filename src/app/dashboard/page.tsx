"use client";

import { useAppSelector } from "@/store/hooks";
import {
  useGetMyPurchasesQuery,
  useGetMyDownloadsQuery,
  useGetSubscriptionStatusQuery,
} from "@/services/api";
import {
  User,
  ShoppingBag,
  Download,
  TrendingUp,
  Sparkles,
  Package,
  Heart,
  Calendar,
  CreditCard,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Info,
  Award,
  FileDown,
  DollarSign,
  Image,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: purchases } = useGetMyPurchasesQuery({ limit: 5 });
  const { data: downloads } = useGetMyDownloadsQuery({ page: 1, limit: 5 });
  const { data: subscriptionStatus } = useGetSubscriptionStatusQuery();

  const hasActiveSubscription =
    subscriptionStatus?.data?.hasActiveSubscription || false;
  const subscription = subscriptionStatus?.data?.subscription;
  const downloadStats = subscriptionStatus?.data?.downloadStats;

  const subscriptionPlanName = subscription?.pricingPlan?.name || "None";
  const remainingDownloads = downloadStats?.remainingDownloads || 0;

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format date with time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate days remaining
  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const stats = [
    {
      name: "Total Purchases",
      value: purchases?.pagination?.totalItems || "0",
      icon: ShoppingBag,
      color: "from-blue-600 to-cyan-600",
    },
    {
      name: "Total Downloads",
      value: downloads?.pagination?.totalItems || "0",
      icon: Download,
      color: "from-purple-600 to-pink-600",
    },
    {
      name: "Subscription",
      value: hasActiveSubscription ? subscriptionPlanName : "No Plan",
      icon: TrendingUp,
      color: hasActiveSubscription
        ? "from-green-600 to-emerald-600"
        : "from-gray-500 to-gray-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="mt-2 text-blue-100">
              Manage your purchases, downloads, and reviews all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-card rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Info Card - Enhanced */}
      {hasActiveSubscription && subscription && (
        <div className="bg-card rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-card/20 backdrop-blur-sm flex items-center justify-center">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-2xl font-bold">Active Subscription</h3>
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p className="text-green-100 text-sm">
                    {subscription.status === "completed"
                      ? "Subscription is active and ready to use"
                      : "Subscription status: " + subscription.status}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  ${subscription.amount?.toFixed(2)}
                </p>
                <p className="text-green-100 text-sm uppercase">
                  {subscription.currency}
                </p>
              </div>
            </div>
          </div>

          {/* Plan Details Section */}
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Plan Details
                  </h4>
                  <div className="bg-card rounded-xl p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Plan Name</span>
                      <span className="font-semibold text-foreground capitalize">
                        {subscription.pricingPlan?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="font-semibold text-foreground">
                        {subscription.pricingPlan?.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Max Downloads
                      </span>
                      <span className="font-semibold text-foreground">
                        {subscription.pricingPlan?.maxDownloads === -1
                          ? "Unlimited"
                          : subscription.pricingPlan?.maxDownloads}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                {subscription.pricingPlan?.features &&
                  subscription.pricingPlan.features.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Plan Features
                      </h4>
                      <div className="bg-card rounded-xl p-4 space-y-2 shadow-sm">
                        {subscription.pricingPlan.features.map(
                          (feature: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm text-foreground">
                                {feature}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Download Stats & Timeline */}
              <div className="space-y-4">
                {/* Download Statistics */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Download Statistics
                  </h4>
                  <div className="bg-card rounded-xl p-4 space-y-4 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total Downloaded
                        </span>

                        <span className="text-2xl font-bold text-primary">
                          {downloadStats?.totalDownloaded || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Remaining</span>
                        <span className="text-2xl font-bold text-primary">
                          {downloadStats?.remainingDownloads === -1
                            ? "∞"
                            : downloadStats?.remainingDownloads || 0}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {downloadStats?.remainingDownloads !== -1 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            Usage Progress
                          </span>
                          <span className="text-xs font-semibold text-foreground">
                            {(
                              ((downloadStats?.totalDownloaded || 0) /
                                (subscription.pricingPlan?.maxDownloads || 1)) *
                              100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-green-600 h-2.5 rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                ((downloadStats?.totalDownloaded || 0) /
                                  (subscription.pricingPlan?.maxDownloads ||
                                    1)) *
                                  100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {downloadStats?.downloadLimitReached && (
                      <div className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-xs text-red-700">
                          Download limit reached
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Subscription Timeline
                  </h4>
                  <div className="bg-card rounded-xl p-4 space-y-3 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Purchase Date</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatDate(subscription.purchaseDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Start Date</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatDate(subscription.subscriptionStartDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">End Date</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatDate(subscription.subscriptionEndDate)}
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          {calculateDaysRemaining(
                            subscription.subscriptionEndDate
                          )}{" "}
                          days remaining
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Billing Information */}
          <div className="p-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Information */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Information
                </h4>
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Method</span>
                    <span className="font-semibold text-foreground capitalize">
                      {subscription.paymentMethod?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscription.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : subscription.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {subscription.status}
                    </span>
                  </div>
                  {subscription.activatedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Activated At
                      </span>
                      <span className="text-sm text-foreground">
                        {formatDate(subscription.activatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Billing Address
                </h4>
                <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                  <p className="text-sm text-foreground font-medium">
                    {subscription.billingAddress?.street}
                  </p>
                  <p className="text-sm text-foreground">
                    {subscription.billingAddress?.city},{" "}
                    {subscription.billingAddress?.state}
                  </p>
                  <p className="text-sm text-foreground">
                    {subscription.billingAddress?.zipCode}
                  </p>
                  <p className="text-sm text-foreground font-medium">
                    {subscription.billingAddress?.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {(subscription.notes || subscription.adminNotes) && (
              <div className="mt-6 space-y-3">
                {subscription.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-2">
                      <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="text-sm font-semibold text-blue-900 mb-1">
                          Your Notes
                        </h5>
                        <p className="text-sm text-blue-800">
                          {subscription.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {subscription.adminNotes && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-start space-x-2">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="text-sm font-semibold text-purple-900 mb-1">
                          Admin Message
                        </h5>
                        <p className="text-sm text-purple-800">
                          {subscription.adminNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="bg-muted/50 px-6 py-4 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Need help with your subscription?
              </p>
              <Link href="/contact">
                <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
                  Contact Support
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* No Subscription CTA */}
      {!hasActiveSubscription && (
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">
                Unlock Premium Features
              </h3>
              <p className="text-orange-100 mb-4">
                Subscribe now to get unlimited access to all premium designs and
                exclusive features.
              </p>
              <Link href="/pricing">
                <button className="inline-flex items-center px-6 py-3 bg-card text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all transform hover:scale-105">
                  View Pricing Plans
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/liked-designs">
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-2xl transform hover:scale-[1.02] transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center">
                <Heart className="w-7 h-7 fill-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">My Liked Designs</h3>
                <p className="text-sm text-red-100 mt-1">
                  View all your favorite designs
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/available-downloads">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-2xl transform hover:scale-[1.02] transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center">
                <Download className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Available Downloads</h3>
                <p className="text-sm text-blue-100 mt-1">
                  Access all designs you can download
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/designs">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-2xl transform hover:scale-[1.02] transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center">
                <Package className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Browse Designs</h3>
                <p className="text-sm text-green-100 mt-1">
                  Explore our collection of amazing designs
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Purchases */}
      <div className="bg-card rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Recent Purchases</h2>
          <Link
            href="/dashboard/purchases"
            className="text-sm text-primary hover:text-blue-700 font-medium flex items-center"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        {purchases?.data && purchases.data.length > 0 ? (
          <div className="space-y-4">
            {purchases.data
              .slice(0, 5)
              .map(
                (purchase: {
                  _id: string;
                  purchaseType: string;
                  pricingPlan?: { name: string };
                  design?: { title: string };
                  amount: number;
                  createdAt: string;
                  status: string;
                }) => (
                  <div
                    key={purchase._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {purchase.purchaseType === "subscription"
                          ? `${purchase.pricingPlan?.name || "Subscription"}`
                          : purchase.design?.title || "Individual Purchase"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        ${purchase.amount?.toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          purchase.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : purchase.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </div>
                  </div>
                )
              )}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No purchases yet. Start exploring our designs!
          </p>
        )}
      </div>

      {/* Recent Downloads - Enhanced */}
      <div className="bg-card rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <FileDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Recent Downloads
              </h2>
              <p className="text-sm text-muted-foreground">
                {downloads?.pagination?.totalItems || 0} total downloads
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/downloads-history"
            className="text-sm text-primary hover:text-blue-700 font-medium flex items-center"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {downloads?.data && downloads.data.length > 0 ? (
          <div className="space-y-4">
            {downloads.data.map(
              (download: {
                _id: string;
                design: {
                  _id: string;
                  title: string;
                  previewImageUrl: string;
                  designerName: string;
                  price: number;
                };
                downloadType: string;
                purchase?: {
                  _id: string;
                  purchaseType: string;
                  amount: number;
                };
                downloadDate: string;
                createdAt: string;
              }) => (
                <div
                  key={download._id}
                  className="group relative bg-gradient-to-r from-gray-50 to-blue-50/30 hover:from-blue-50 hover:to-purple-50/50 rounded-xl p-4 border border-border hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start space-x-4">
                    {/* Design Preview Image */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 border-2 border-white shadow-md">
                        {(download.design as any)?.previewImageUrls?.[0] ||
                        download.design.previewImageUrl ? (
                          <img
                            src={
                              (download.design as any)?.previewImageUrls?.[0] ||
                              download.design.previewImageUrl
                            }
                            alt={download.design.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                            <Image className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      {/* Download Type Badge */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <FileDown className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    {/* Download Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {download.design.title}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <span className="text-muted-foreground">by</span>
                            <span className="ml-1 font-medium">
                              {(download.design as any)?.designer?.name ||
                                download.design.designerName}
                            </span>
                          </p>
                        </div>
                        <Link
                          href={`/designs/${download.design._id}`}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <button className="p-2 rounded-lg bg-card hover:bg-blue-50 border border-border hover:border-blue-300 transition-all">
                            <ExternalLink className="w-4 h-4 text-primary" />
                          </button>
                        </Link>
                      </div>

                      {/* Download Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                        {/* Download Type */}
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
                            <Package className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Type</p>
                            <p className="text-sm font-medium text-foreground capitalize">
                              {download.downloadType.replace("_", " ")}
                            </p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Price</p>
                            <p className="text-sm font-medium text-foreground">
                              $
                              {((download.design as any).discountedPrice != null
                                ? (download.design as any).discountedPrice
                                : (download.design as any).basePrice ??
                                  download.design.price ??
                                  0
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Download Date */}
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Downloaded</p>
                            <p className="text-sm font-medium text-foreground">
                              {formatDateTime(download.downloadDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Purchase Info */}
                      {download.purchase && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Purchase Type:{" "}
                              <span className="font-medium text-foreground capitalize">
                                {download.purchase.purchaseType}
                              </span>
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Amount:{" "}
                              <span className="font-semibold text-primary">
                                ${download.purchase.amount?.toFixed(2)}
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <FileDown className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium mb-2">No downloads yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Start downloading designs to see them here
            </p>
            <Link href="/designs">
              <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
                Browse Designs
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </Link>
          </div>
        )}

        {/* Pagination Info */}
        {downloads?.data && downloads.data.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {downloads.data.length} of{" "}
                {downloads.pagination?.totalItems || 0} downloads
              </span>
              {downloads.pagination?.hasNextPage && (
                <Link
                  href="/dashboard/downloads-history"
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  Load More →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-card rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="mt-1 text-foreground">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="mt-1 text-foreground">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <p className="mt-1 text-foreground capitalize">{user?.role}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Member Since</p>
            <p className="mt-1 text-foreground">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
