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
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Package,
  Heart,
  ExternalLink,
  ShieldCheck,
  FileDown,
  Layers,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: purchases } = useGetMyPurchasesQuery({ limit: 5 });
  const { data: downloads } = useGetMyDownloadsQuery({ page: 1, limit: 5 });
  const { data: subscriptionStatus } = useGetSubscriptionStatusQuery();

  const hasActiveSubscription =
    subscriptionStatus?.data?.hasActiveSubscription || false;
  const subscription = subscriptionStatus?.data?.subscription;
  const downloadStats = subscriptionStatus?.data?.downloadStats;

  const subscriptionPlanName = subscription?.pricingPlan?.name || "No Active Plan";
  const remainingDownloads = downloadStats?.remainingDownloads ?? 0;
  const totalDownloads = downloads?.pagination?.totalItems ?? 0;
  const totalPurchases = purchases?.pagination?.totalItems ?? 0;

  const formatDate = (dateString: string) => {
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

  const calculateDaysRemaining = (endDate: string) => {
    try {
      const end = new Date(endDate);
      const now = new Date();
      const diffTime = end.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 0;
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
          <span className="text-muted-foreground">Dashboard</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground">Overview</span>
        </div>
      </nav>

      {/* Page Header (Matching Categories Page Style) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2.5">
            Member Overview
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Welcome back, {user?.name || "Member"}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
            Manage your purchases, download allocations, subscription status, and
            saved design assets.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/designs">
            <Button
              variant="outline"
              className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-4 py-2.5 transition-colors"
            >
              Browse Catalog
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          {!hasActiveSubscription && (
            <Link href="/pricing">
              <Button className="bg-primary text-primary-foreground font-semibold rounded-lg text-sm px-4 py-2.5 hover:bg-primary/90 transition-colors">
                View Plans
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Minimalist Metrics Strip (0 gradients, 0 box shadow, 0 blur) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-border">
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {totalPurchases}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Total Orders
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-primary">
            {totalDownloads}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Assets Downloaded
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {remainingDownloads === -1 ? "Unlimited" : remainingDownloads}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Downloads Left
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground truncate">
            {hasActiveSubscription ? "Active" : "Standard"}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            {subscriptionPlanName}
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards (0 Shadow, 0 Gradient, 0 Blur) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/purchases"
          className="p-5 rounded-xl border border-border bg-card hover:border-foreground/40 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg border border-border bg-muted/40 flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-foreground">My Purchases</div>
              <div className="text-xs text-muted-foreground mt-0.5">Order receipts & licenses</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>

        <Link
          href="/dashboard/available-downloads"
          className="p-5 rounded-xl border border-border bg-card hover:border-foreground/40 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg border border-border bg-muted/40 flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-foreground">Available Files</div>
              <div className="text-xs text-muted-foreground mt-0.5">Direct downloads</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>

        <Link
          href="/dashboard/liked-designs"
          className="p-5 rounded-xl border border-border bg-card hover:border-foreground/40 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg border border-border bg-muted/40 flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-foreground">Liked Designs</div>
              <div className="text-xs text-muted-foreground mt-0.5">Saved bookmarks</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>

        <Link
          href="/dashboard/payment-history"
          className="p-5 rounded-xl border border-border bg-card hover:border-foreground/40 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg border border-border bg-muted/40 flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-foreground">Payment History</div>
              <div className="text-xs text-muted-foreground mt-0.5">Invoices & billing</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>
      </div>

      {/* Active Subscription Box or Upgrade Banner */}
      {hasActiveSubscription && subscription ? (
        <div className="rounded-xl border border-border bg-card p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg border border-border bg-muted/40 flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold text-foreground">
                    {subscription.pricingPlan?.name} Subscription
                  </h3>
                  <span className="inline-flex px-2.5 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800 uppercase tracking-wider">
                    {subscription.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Plan includes {subscription.pricingPlan?.maxDownloads === -1 ? "Unlimited" : subscription.pricingPlan?.maxDownloads} downloads per {subscription.pricingPlan?.duration || "term"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-foreground">
                ${subscription.amount?.toFixed(2)}
                <span className="text-xs text-muted-foreground font-normal ml-1 uppercase">
                  {subscription.currency}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {calculateDaysRemaining(subscription.subscriptionEndDate)} days remaining
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
            <div>
              <div className="text-xs text-muted-foreground font-semibold uppercase">Start Date</div>
              <div className="text-sm sm:text-base font-bold text-foreground mt-1">
                {formatDate(subscription.subscriptionStartDate)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-semibold uppercase">Expiration Date</div>
              <div className="text-sm sm:text-base font-bold text-foreground mt-1">
                {formatDate(subscription.subscriptionEndDate)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-semibold uppercase">Payment Method</div>
              <div className="text-sm sm:text-base font-bold text-foreground capitalize mt-1">
                {subscription.paymentMethod?.replace("_", " ") || "Card"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg border border-border bg-muted/40 flex items-center justify-center text-foreground shrink-0 mt-0.5">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-foreground">
                Upgrade to Premium Access
              </div>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
                Subscribe to a flexible plan for immediate access to high-resolution
                design bundles, templates, and unlimited downloads.
              </p>
            </div>
          </div>
          <Link href="/pricing" className="shrink-0">
            <Button className="bg-primary text-primary-foreground font-bold rounded-lg text-sm px-5 py-2.5 hover:bg-primary/90 transition-colors">
              Explore Plans
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* 2-Column Section: Recent Purchases & Recent Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchases */}
        <div className="border border-border rounded-xl bg-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Recent Orders</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Latest transactions and licenses</p>
            </div>
            <Link
              href="/dashboard/purchases"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {purchases?.data && purchases.data.length > 0 ? (
            <div className="divide-y divide-border">
              {purchases.data.slice(0, 4).map((p: any) => (
                <div key={p._id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground truncate">
                      {p.purchaseType === "subscription"
                        ? p.pricingPlan?.name || "Subscription Plan"
                        : p.design?.title || "Individual Design"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(p.createdAt)} • {p.purchaseType}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">
                      ${p.amount?.toFixed(2)}
                    </p>
                    <span className="inline-block text-xs font-semibold text-muted-foreground capitalize mt-0.5">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No recent purchases recorded yet.
            </div>
          )}
        </div>

        {/* Recent Downloads */}
        <div className="border border-border rounded-xl bg-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Recent Downloads</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Recently downloaded creative assets</p>
            </div>
            <Link
              href="/dashboard/downloads-history"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {downloads?.data && downloads.data.length > 0 ? (
            <div className="divide-y divide-border">
              {downloads.data.slice(0, 4).map((d: any) => (
                <div key={d._id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground truncate">
                      {d.design?.title || "Design Asset"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(d.downloadDate || d.createdAt)}
                    </p>
                  </div>
                  {d.design?._id && (
                    <Link
                      href={`/designs/${d.design._id}`}
                      className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label="View design"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No downloads recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Account Credentials Strip */}
      <div className="border border-border rounded-xl bg-card p-6">
        <h2 className="text-base font-bold text-foreground pb-4 border-b border-border mb-4">
          Account Credentials & Role
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Display Name
            </div>
            <div className="text-sm sm:text-base font-bold text-foreground mt-1 truncate">
              {user?.name || "Member"}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Primary Email
            </div>
            <div className="text-sm sm:text-base font-bold text-foreground mt-1 truncate">
              {user?.email || "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Account Role
            </div>
            <div className="text-sm sm:text-base font-bold text-foreground mt-1 capitalize">
              {user?.role || "Customer"}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Auth Method
            </div>
            <div className="text-sm sm:text-base font-bold text-foreground mt-1 capitalize">
              {user?.authProvider || "Local Credentials"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
