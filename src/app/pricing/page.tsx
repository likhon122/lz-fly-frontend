"use client";

import React, { useState } from "react";
import {
  useGetActivePricingPlansQuery,
  useGetSubscriptionStatusQuery,
} from "@/services/api";
import {
  Check,
  X,
  Sparkles,
  Crown,
  Zap,
  Star,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import PurchaseModal from "@/components/PurchaseModal";
import { useAppSelector } from "@/store/hooks";
import { useToast } from "@/components/ToastProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PricingPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  finalPrice: number;
  currencyDisplay: string;
  currencyCode: string;
  features: string[];
  duration: string;
  maxDesigns: number;
  maxDownloads: number;
  priority: number;
  isActive: boolean;
  discountPercentage?: number;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PricingPage() {
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] =
    useState<PricingPlan | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const {
    data: pricingData,
    isLoading,
    error,
  } = useGetActivePricingPlansQuery();

  const { data: subscriptionData } = useGetSubscriptionStatusQuery(undefined, {
    skip: !user,
  });

  const pricingPlans = pricingData?.data || [];
  const toast = useToast();
  const hasActiveSubscription =
    subscriptionData?.data?.hasActiveSubscription || false;
  const currentSubscription = subscriptionData?.data?.subscription;
  const downloadStats = subscriptionData?.data?.downloadStats;

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

  const handlePurchaseClick = (plan: PricingPlan) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (hasActiveSubscription) {
      toast.info(
        "You already have an active subscription. Manage your plan from your dashboard."
      );
      return;
    }

    setSelectedPlanForPurchase(plan);
    setPurchaseModalOpen(true);
  };

  const getFinalPrice = (plan: PricingPlan) => {
    return plan.finalPrice || plan.price;
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const getPlanIcon = (plan: PricingPlan) => {
    const name = plan.name.toLowerCase();
    if (name.includes("premium") || name.includes("pro")) {
      return <Crown className="w-5 h-5 text-primary" />;
    } else if (name.includes("basic") || name.includes("starter")) {
      return <Sparkles className="w-5 h-5 text-primary" />;
    } else if (name.includes("enterprise") || name.includes("ultimate")) {
      return <Zap className="w-5 h-5 text-primary" />;
    }
    return <Star className="w-5 h-5 text-primary" />;
  };

  const faqs = [
    {
      q: "Can I change or cancel my plan anytime?",
      a: "Yes, you can upgrade, downgrade, or cancel your subscription anytime directly from your member dashboard.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support all major credit and debit cards, Google Pay, and Stripe with bank-level 256-bit encryption.",
    },
    {
      q: "Do downloaded assets include commercial rights?",
      a: "Yes, all design downloads include complete commercial licenses for unlimited personal and client projects.",
    },
    {
      q: "What happens when my subscription period ends?",
      a: "Any designs you downloaded remain yours to use forever under the perpetual commercial license.",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Loading pricing plans...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="p-8 text-center rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 max-w-md w-full">
          <X className="w-8 h-8 text-red-600 mx-auto mb-3" />
          <h2 className="text-base font-bold text-red-900 dark:text-red-400">
            Error Loading Pricing Plans
          </h2>
          <p className="text-sm text-red-700 dark:text-red-400/80 mt-1">
            Unable to connect to pricing service. Please refresh or try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm font-semibold">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-foreground">Pricing Plans</span>
          </div>
        </nav>

        {/* Page Header (Matching Categories Page Style) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
              Membership & Subscriptions
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Simple, Transparent Pricing
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Unlock unlimited access to high-resolution vector assets, production
              UI kits, and design templates with simple monthly or annual plans.
            </p>
          </div>
          <Link href="/designs">
            <Button
              variant="outline"
              className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-5 py-2.5 transition-colors"
            >
              Browse Asset Catalog
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Minimalist Metrics Strip (0 gradients, 0 box shadow, 0 blur) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-b border-border">
          <div className="border-r border-border/50 pr-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
              {pricingPlans.length}
            </div>
            <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
              Curated Plans
            </div>
          </div>
          <div className="border-r border-border/50 pr-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary">
              100%
            </div>
            <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
              Commercial License
            </div>
          </div>
          <div className="border-r border-border/50 pr-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Instant
            </div>
            <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
              ZIP File Delivery
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
              24/7
            </div>
            <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
              Priority Support
            </div>
          </div>
        </div>

        {/* Active Subscription Box */}
        {user && hasActiveSubscription && currentSubscription && (
          <div className="my-8 rounded-xl border-2 border-primary/40 bg-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg border border-border bg-muted/40 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold text-foreground">
                      Current Subscription: {currentSubscription.pricingPlan?.name}
                    </h3>
                    <span className="inline-flex px-2.5 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800 uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1" suppressHydrationWarning>
                    Valid until {formatDate(currentSubscription.subscriptionEndDate)} ({calculateDaysRemaining(currentSubscription.subscriptionEndDate)} days remaining)
                  </p>
                </div>
              </div>
              <Link href="/dashboard">
                <Button className="bg-primary text-primary-foreground font-semibold rounded-lg text-sm px-5 py-2.5 hover:bg-primary/90 transition-colors">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold">Downloads Left</span>
                <p className="text-base font-bold text-foreground mt-1">
                  {downloadStats?.remainingDownloads === -1 ? "Unlimited" : downloadStats?.remainingDownloads ?? 0}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold">Downloaded</span>
                <p className="text-base font-bold text-foreground mt-1">
                  {downloadStats?.totalDownloaded ?? 0} files
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold">Plan Term</span>
                <p className="text-base font-bold text-foreground capitalize mt-1">
                  {currentSubscription.pricingPlan?.duration || "Monthly"}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold">Amount</span>
                <p className="text-base font-bold text-foreground mt-1">
                  ${currentSubscription.amount?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="py-12">
          {pricingPlans.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-border bg-card">
              <Sparkles className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
              <h3 className="text-base font-bold text-foreground">No Plans Available</h3>
              <p className="text-sm text-muted-foreground mt-1">
                New subscription options are being configured. Please check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricingPlans.map((plan: PricingPlan) => {
                const finalPrice = getFinalPrice(plan);
                const isPopular = plan.priority === 1;
                const isCurrentPlan =
                  hasActiveSubscription &&
                  currentSubscription?.pricingPlan?._id === plan._id;

                return (
                  <div
                    key={plan._id}
                    className={`rounded-xl bg-card border flex flex-col justify-between transition-colors ${
                      isPopular
                        ? "border-2 border-primary"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <div className="p-6 sm:p-7">
                      {/* Plan Header */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-lg border border-border bg-muted/40 flex items-center justify-center">
                            {getPlanIcon(plan)}
                          </div>
                          <h3 className="text-xl font-bold text-foreground capitalize">
                            {plan.name}
                          </h3>
                        </div>
                        {isCurrentPlan ? (
                          <span className="px-2.5 py-1 rounded text-xs font-semibold bg-primary text-primary-foreground uppercase tracking-wider">
                            Current
                          </span>
                        ) : isPopular ? (
                          <span className="px-2.5 py-1 rounded text-xs font-semibold bg-muted text-foreground border border-border uppercase tracking-wider">
                            Popular
                          </span>
                        ) : plan.discountPercentage && plan.discountPercentage > 0 ? (
                          <span className="px-2.5 py-1 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:border-red-900 dark:text-red-400">
                            -{plan.discountPercentage}%
                          </span>
                        ) : null}
                      </div>

                      <p className="text-sm text-muted-foreground min-h-[36px] leading-relaxed mb-6">
                        {plan.description}
                      </p>

                      {/* Price Section */}
                      <div className="py-5 border-y border-border mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl sm:text-5xl font-extrabold text-foreground">
                            {plan.currencyDisplay || "$"}
                            {formatPrice(finalPrice)}
                          </span>
                          <span className="text-sm text-muted-foreground font-semibold">
                            / {plan.duration}
                          </span>
                        </div>
                        {plan.discountPercentage && plan.discountPercentage > 0 && (
                          <p className="text-sm text-muted-foreground line-through mt-1">
                            Regular: {plan.currencyDisplay || "$"}
                            {formatPrice(plan.price)}
                          </p>
                        )}
                      </div>

                      {/* Included Features */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                          Includes:
                        </div>
                        <div className="flex items-start gap-2.5 text-sm text-foreground">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>
                            {plan.maxDownloads === -1
                              ? "Unlimited asset downloads"
                              : typeof plan.maxDownloads === "number"
                              ? `${plan.maxDownloads.toLocaleString()} asset downloads/month`
                              : "Standard asset downloads"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5 text-sm text-foreground">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>
                            {plan.maxDesigns === -1
                              ? "Full access to all catalog designs"
                              : typeof plan.maxDesigns === "number"
                              ? `Access to ${plan.maxDesigns.toLocaleString()} designs`
                              : "Curated design catalog access"}
                          </span>
                        </div>
                        {plan.features?.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 text-sm text-foreground"
                          >
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Footer */}
                    <div className="p-6 sm:p-7 pt-0">
                      <Button
                        onClick={() => handlePurchaseClick(plan)}
                        disabled={isCurrentPlan}
                        className={`w-full font-bold rounded-lg text-sm py-3 transition-colors ${
                          isCurrentPlan
                            ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                            : isPopular
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "border border-border bg-card text-foreground hover:bg-muted"
                        }`}
                      >
                        {isCurrentPlan ? "Currently Active" : `Select ${plan.name}`}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Minimalist FAQ Section */}
        <div className="py-12 border-t border-border">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
              Common Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-1.5">
                      {faq.q}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise / Need Help Box */}
        <div className="mt-8 p-6 sm:p-8 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Need custom volume or enterprise licensing?
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Contact our solutions team for multi-seat licensing, dedicated asset requests,
              and corporate invoicing.
            </p>
          </div>
          <Link href="/contact" className="shrink-0">
            <Button
              variant="outline"
              className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-5 py-2.5 transition-colors"
            >
              Contact Sales
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Purchase Modal */}
      {selectedPlanForPurchase && (
        <PurchaseModal
          isOpen={purchaseModalOpen}
          onClose={() => {
            setPurchaseModalOpen(false);
            setSelectedPlanForPurchase(null);
          }}
          plan={selectedPlanForPurchase}
          purchaseType="subscription"
        />
      )}
    </div>
  );
}
