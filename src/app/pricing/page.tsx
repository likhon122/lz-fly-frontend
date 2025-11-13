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
  Loader2,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";
import PurchaseModal from "@/components/PurchaseModal";
import { useAppSelector } from "@/store/hooks";
import { useToast } from "@/components/ToastProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
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

  // Fetch subscription status
  const { data: subscriptionData, isLoading: subscriptionLoading } =
    useGetSubscriptionStatusQuery(undefined, {
      skip: !user, // Only fetch if user is logged in
    });

  const pricingPlans = pricingData?.data || [];
  const toast = useToast();
  const hasActiveSubscription =
    subscriptionData?.data?.hasActiveSubscription || false;
  const currentSubscription = subscriptionData?.data?.subscription;
  const downloadStats = subscriptionData?.data?.downloadStats;

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  const handlePurchaseClick = (plan: PricingPlan) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    // Check if user already has an active subscription
    if (hasActiveSubscription) {
      toast.info(
        "You already have an active subscription. Please cancel your current subscription before purchasing a new one."
      );
      return;
    }

    setSelectedPlanForPurchase(plan);
    setPurchaseModalOpen(true);
  };

  // Get the final price (use finalPrice from API if available, fallback to calculated)
  const getFinalPrice = (plan: PricingPlan) => {
    return plan.finalPrice || plan.price;
  };

  // Format price display
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  // Get plan icon based on name or priority
  const getPlanIcon = (plan: PricingPlan) => {
    const name = plan.name.toLowerCase();
    if (name.includes("premium") || name.includes("pro")) {
      return <Crown className="w-8 h-8" />;
    } else if (name.includes("basic") || name.includes("starter")) {
      return <Sparkles className="w-8 h-8" />;
    } else if (name.includes("enterprise") || name.includes("ultimate")) {
      return <Zap className="w-8 h-8" />;
    }
    return <Star className="w-8 h-8" />;
  };

  // Get plan color scheme based on priority
  const getPlanColors = (plan: PricingPlan) => {
    if (plan.priority <= 1) {
      return {
        gradient: "from-purple-600 via-pink-600 to-blue-600",
        button:
          "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
        border: "border-purple-500/50",
        text: "text-purple-400",
      };
    } else if (plan.priority === 2) {
      return {
        gradient: "from-blue-600 via-indigo-600 to-purple-600",
        button:
          "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
        border: "border-blue-500/50",
        text: "text-blue-400",
      };
    }
    return {
      gradient: "from-gray-600 via-slate-600 to-gray-600",
      button:
        "bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700",
      border: "border-gray-500/50",
      text: "text-gray-400",
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="animate-spin h-16 w-16 text-primary mx-auto mb-4" />
          <p className="text-foreground text-lg font-medium">
            Loading pricing plans...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            Error Loading Plans
          </h2>
          <p className="text-muted-foreground">
            Unable to load pricing plans. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 gradient-text">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 font-medium">
            Unlock premium designs and boost your creative projects with our
            flexible pricing plans
          </p>
          <div className="inline-flex items-center bg-primary/10 rounded-2xl px-6 py-3 border-2 border-primary/20">
            <Sparkles className="w-5 h-5 text-primary mr-2" />
            <p className="text-sm text-foreground font-black">
              All plans include 24/7 support
            </p>
          </div>
        </div>
      </div>

      {/* Current Subscription Section */}
      {user && hasActiveSubscription && currentSubscription && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="bg-card rounded-3xl p-8 border-2 border-primary shadow-2xl">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                  <Award className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-3xl font-black text-foreground">
                      Your Active Subscription
                    </h2>
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-base font-medium">
                    You&apos;re currently subscribed to a premium plan
                  </p>
                </div>
              </div>
              <Link href="/dashboard">
                <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-secondary rounded-xl transition-all font-black text-sm hover:scale-105 shadow-lg">
                  View Dashboard
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Plan Name */}
              <div className="bg-muted/50 rounded-2xl p-6 border-2 border-border">
                <div className="flex items-center space-x-2 mb-3">
                  <Crown className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground font-black">Plan</p>
                </div>
                <p className="text-2xl font-black text-foreground capitalize">
                  {currentSubscription.pricingPlan?.name}
                </p>
              </div>

              {/* Subscription Dates */}
              <div className="bg-muted/50 rounded-2xl p-6 border-2 border-border">
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground font-black">
                    Valid Until
                  </p>
                </div>
                <p className="text-xl font-black text-foreground">
                  {formatDate(currentSubscription.subscriptionEndDate)}
                </p>
                <p className="text-sm text-primary mt-2 font-black">
                  {calculateDaysRemaining(
                    currentSubscription.subscriptionEndDate
                  )}{" "}
                  days left
                </p>
              </div>

              {/* Downloads */}
              <div className="bg-muted/50 rounded-2xl p-6 border-2 border-border">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground font-black">Downloads</p>
                </div>
                <p className="text-2xl font-black text-foreground">
                  {downloadStats?.remainingDownloads === -1
                    ? "Unlimited"
                    : `${downloadStats?.remainingDownloads || 0} left`}
                </p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {downloadStats?.totalDownloaded || 0} used
                </p>
              </div>

              {/* Amount Paid */}
              <div className="bg-muted/50 rounded-2xl p-6 border-2 border-border">
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground font-black">
                    Amount Paid
                  </p>
                </div>
                <p className="text-2xl font-black text-foreground">
                  {currentSubscription.currencyDisplay}
                  {currentSubscription.amount?.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-2 uppercase font-medium">
                  {currentSubscription.currency}
                </p>
              </div>
            </div>

            {/* Progress Bar for Limited Downloads */}
            {downloadStats?.remainingDownloads !== -1 &&
              currentSubscription.pricingPlan?.maxDownloads && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-foreground font-black">
                      Download Usage
                    </span>
                    <span className="text-sm font-black text-primary">
                      {(
                        ((downloadStats?.totalDownloaded || 0) /
                          currentSubscription.pricingPlan.maxDownloads) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          ((downloadStats?.totalDownloaded || 0) /
                            currentSubscription.pricingPlan.maxDownloads) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

            {/* Features */}
            {currentSubscription.pricingPlan?.features &&
              currentSubscription.pricingPlan.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-black text-foreground mb-4">
                    Your Plan Features:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentSubscription.pricingPlan.features.map(
                      (feature: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-card rounded-2xl p-4 border-2 border-border"
                        >
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm text-foreground font-medium">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Admin Notes */}
            {currentSubscription.adminNotes && (
              <div className="mt-6 bg-primary/10 border-2 border-primary/20 rounded-2xl p-5">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-6 h-6 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-base font-black text-foreground mb-2">
                      Message from Admin
                    </h4>
                    <p className="text-sm text-muted-foreground font-medium">
                      {currentSubscription.adminNotes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {pricingPlans.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-black text-foreground mb-2">
              No Pricing Plans Available
            </h3>
            <p className="text-muted-foreground font-medium">
              Check back soon for our pricing options!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan: PricingPlan) => {
              const colors = getPlanColors(plan);
              const finalPrice = getFinalPrice(plan);
              const isPopular = plan.priority === 1;
              const isCurrentPlan =
                hasActiveSubscription &&
                currentSubscription?.pricingPlan?._id === plan._id;

              return (
                <div
                  key={plan._id}
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    selectedPlan === plan._id ? "scale-105" : "hover:scale-105"
                  } ${isCurrentPlan ? "opacity-75" : ""}`}
                  onClick={() =>
                    setSelectedPlan(selectedPlan === plan._id ? null : plan._id)
                  }
                >
                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-primary text-secondary px-6 py-2 rounded-2xl text-sm font-black shadow-2xl flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Current Plan</span>
                      </div>
                    </div>
                  )}

                  {/* Popular Badge */}
                  {isPopular && !isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-primary to-primary/80 text-secondary px-6 py-2 rounded-2xl text-sm font-black shadow-2xl">
                        ⭐ Most Popular
                      </div>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {plan.discountPercentage && plan.discountPercentage > 0 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-destructive text-white px-4 py-2 rounded-2xl text-xs font-black shadow-2xl">
                        -{plan.discountPercentage}%
                      </div>
                    </div>
                  )}

                  <div
                    className={`
                      relative h-full bg-card rounded-3xl p-8 border-2 transition-all duration-300 shadow-2xl
                      ${
                        isPopular
                          ? "border-primary ring-4 ring-primary/20"
                          : "border-border"
                      }
                      ${
                        selectedPlan === plan._id
                          ? "ring-4 ring-primary/30"
                          : ""
                      }
                      hover:border-primary hover:shadow-primary/20
                    `}
                  >
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                        <div className="text-primary text-2xl">{getPlanIcon(plan)}</div>
                      </div>
                      <h3 className="text-2xl font-black text-foreground mb-3 capitalize">
                        {plan.name}
                      </h3>
                      <p className="text-muted-foreground text-sm font-medium">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-8 pb-8 border-b-2 border-border">
                      <div className="flex items-baseline justify-center">
                        {plan.discountPercentage &&
                          plan.discountPercentage > 0 && (
                            <span className="text-xl text-muted-foreground/50 line-through mr-3 font-bold">
                              {plan.currencyDisplay} {formatPrice(plan.price)}
                            </span>
                          )}
                        <span className="text-5xl font-black text-primary">
                          {plan.currencyDisplay}
                          {formatPrice(finalPrice)}
                        </span>
                        <span className="text-muted-foreground ml-2 font-bold">
                          /{plan.duration}
                        </span>
                      </div>
                      {plan.discountPercentage &&
                        plan.discountPercentage > 0 && (
                          <div className="mt-3">
                            <span className="text-primary text-sm font-black bg-primary/10 px-4 py-2 rounded-xl">
                              Save {plan.currencyDisplay}
                              {formatPrice(plan.price - finalPrice)} (
                              {plan.discountPercentage}% off)
                            </span>
                          </div>
                        )}
                      {plan.validUntil && (
                        <p className="text-sm text-destructive mt-3 font-black bg-destructive/10 inline-block px-4 py-2 rounded-xl">
                          ⏰ Valid until{" "}
                          {new Date(plan.validUntil).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      <h4 className="text-base font-black text-foreground mb-4">
                        What&apos;s Included:
                      </h4>
                      <div className="space-y-3">
                        {/* Max Designs */}
                        <div className="flex items-start text-foreground">
                          <Check className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                          <span className="text-sm font-medium">
                            {plan.maxDesigns === -1
                              ? "Unlimited"
                              : plan?.maxDesigns?.toLocaleString()}{" "}
                            Designs Access
                          </span>
                        </div>

                        {/* Max Downloads */}
                        <div className="flex items-start text-foreground">
                          <Check className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                          <span className="text-sm font-medium">
                            {plan.maxDownloads === -1
                              ? "Unlimited"
                              : plan.maxDownloads.toLocaleString()}{" "}
                            Downloads/month
                          </span>
                        </div>

                        {/* Features */}
                        {plan.features &&
                          plan.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-start text-foreground"
                            >
                              <Check className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                              <span className="text-sm font-medium">{feature}</span>
                            </div>
                          ))}

                        {/* Plan Duration */}
                        <div className="flex items-start text-foreground">
                          <Check className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                          <span className="text-sm font-medium">
                            <strong>Duration:</strong> {plan.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchaseClick(plan);
                      }}
                      disabled={isCurrentPlan}
                      className={`
                        w-full py-4 px-6 rounded-2xl font-black transition-all duration-300 shadow-2xl
                        ${
                          isCurrentPlan
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-primary text-secondary hover:bg-primary/90 hover:scale-105"
                        } 
                        shadow-sm
                        flex items-center justify-center space-x-2
                      `}
                    >
                      {isCurrentPlan ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Active Plan</span>
                        </>
                      ) : (
                        <>
                          <span>Get {plan.name}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Additional Info */}
                    <div className="text-center mt-4 space-y-1">
                      {plan.discountPercentage &&
                        plan.discountPercentage > 0 && (
                          <p className="text-xs text-primary font-black">
                            🎉 Limited Time: {plan.discountPercentage}% Discount
                          </p>
                        )}
                      <p className="text-xs text-muted-foreground font-medium">
                        Created: {new Date(plan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-4xl font-black text-foreground mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-8 border-2 border-border shadow-2xl text-left hover:border-primary transition-all duration-300 hover:scale-105">
              <h3 className="text-lg font-black text-foreground mb-3">
                Can I change my plan later?
              </h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Yes, you can upgrade or downgrade your plan at any time from
                your account settings.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 border-2 border-border shadow-2xl text-left hover:border-primary transition-all duration-300 hover:scale-105">
              <h3 className="text-lg font-black text-foreground mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                We accept all major credit cards, PayPal, and Stripe for secure
                payments.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 border-2 border-border shadow-2xl text-left hover:border-primary transition-all duration-300 hover:scale-105">
              <h3 className="text-lg font-black text-foreground mb-3">
                Is there a money-back guarantee?
              </h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Yes, we offer a 30-day money-back guarantee for all our plans.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 border-2 border-border shadow-2xl text-left hover:border-primary transition-all duration-300 hover:scale-105">
              <h3 className="text-lg font-black text-foreground mb-3">
                Do you offer custom plans?
              </h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                For enterprise needs, we can create custom plans. Contact our
                sales team for more details.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <div className="bg-card border-2 border-border rounded-3xl p-10 shadow-2xl hover:border-primary transition-all duration-300">
            <h2 className="text-3xl font-black text-foreground mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-muted-foreground mb-8 text-base font-medium">
              Our team is here to help you find the perfect plan for your needs.
            </p>
            <button className="bg-primary text-secondary px-8 py-4 rounded-2xl font-black hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-2xl">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

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
};

export default PricingPage;
