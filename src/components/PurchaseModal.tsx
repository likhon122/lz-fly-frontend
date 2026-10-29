"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShoppingBag,
  Shield,
  Lock,
  Download,
  ArrowRight,
  Layers,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useCreatePaymentIntentMutation, api } from "@/services/api";
import StripeProvider from "./StripeProvider";
import PaymentForm from "./PaymentForm";
import PaymentStatusChecker from "./PaymentStatusChecker";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";

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
}

interface Design {
  _id: string;
  title: string | undefined;
  description: string | undefined;
  currencyDisplay: string;
  currencyCode: string;
  price: number | undefined;
  basePrice?: number | undefined;
  previewImageUrl?: string;
  category: {
    _id: string | null;
    name: string | undefined;
  };
}

interface Course {
  _id: string;
  title: string;
  description?: string;
  currencyDisplay: string;
  currencyCode: string;
  price: number;
  basePrice?: number;
  previewImageUrl?: string;
}

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: PricingPlan;
  design?: Design;
  course?: Course;
  purchaseType: "subscription" | "individual";
  onPaymentSuccess?: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  plan,
  design,
  course,
  purchaseType,
  onPaymentSuccess,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [createPaymentIntent, { isLoading: isCreatingIntent }] =
    useCreatePaymentIntentMutation();

  const [step, setStep] = useState<
    "details" | "payment" | "processing" | "success" | "error"
  >("details");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Currency & price extraction
  const currencyDisplay =
    purchaseType === "subscription"
      ? plan?.currencyDisplay || "$"
      : purchaseType === "individual" && design
      ? design.currencyDisplay
      : course?.currencyDisplay || "$";

  const currencyCode =
    purchaseType === "subscription"
      ? plan?.currencyCode || "USD"
      : purchaseType === "individual" && design
      ? design.currencyCode
      : course?.currencyCode || "USD";

  const itemPrice =
    purchaseType === "subscription"
      ? plan?.finalPrice ?? plan?.price ?? 0
      : purchaseType === "individual" && design
      ? design.price ?? 0
      : course?.price ?? 0;

  const itemName =
    purchaseType === "subscription"
      ? plan?.name || "Subscription Plan"
      : purchaseType === "individual" && design
      ? design.title || "Design Asset"
      : course?.title || "Course Access";

  const itemDescription =
    purchaseType === "subscription"
      ? plan?.description || ""
      : purchaseType === "individual" && design
      ? design.description || ""
      : course?.description || "";

  const originalPrice =
    purchaseType === "subscription"
      ? plan?.price ?? 0
      : purchaseType === "individual" && design
      ? design.basePrice ?? design.price ?? 0
      : course?.basePrice ?? course?.price ?? 0;

  const hasDiscount =
    purchaseType === "subscription"
      ? Boolean(plan?.discountPercentage && plan.discountPercentage > 0)
      : originalPrice > itemPrice;

  const discountPercentage =
    purchaseType === "subscription" && plan?.discountPercentage
      ? plan.discountPercentage
      : hasDiscount && originalPrice > 0
      ? Math.round(((originalPrice - itemPrice) / originalPrice) * 100)
      : 0;

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("details");
      setClientSecret(null);
      setPaymentIntentId(null);
      setErrorMessage("");
      setIsRedirecting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInitiatePayment = async () => {
    try {
      setStep("processing");
      setErrorMessage("");

      const productType =
        purchaseType === "subscription"
          ? "subscription"
          : design
          ? "design"
          : "course";
      const productId =
        purchaseType === "subscription"
          ? plan?._id
          : design?._id || course?._id;

      if (!productId) {
        throw new Error("Product ID is missing");
      }

      const result = await createPaymentIntent({
        productType,
        productId,
        currency: currencyCode,
      }).unwrap();

      if (result.success && result.data) {
        setClientSecret(result.data.clientSecret);
        setPaymentIntentId(result.data.paymentIntentId);
        setStep("payment");
      } else {
        throw new Error(result.message || "Failed to create payment intent");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const message =
        err?.data?.message ||
        err?.message ||
        "Failed to initiate payment. Please try again.";
      setErrorMessage(message);
      setStep("error");
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    setPaymentIntentId(paymentId);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStep("success");
  };

  const handlePaymentConfirmed = () => {
    dispatch(api.util.invalidateTags(["Purchases", "Downloads", "Designs"]));

    if (onPaymentSuccess) {
      onPaymentSuccess();
    }

    setTimeout(() => {
      setIsRedirecting(true);
      onClose();
    }, 2500);
  };

  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
    setStep("error");
  };

  const formatPrice = (price: number) => price.toFixed(2);

  const resetAndClose = () => {
    setStep("details");
    setClientSecret(null);
    setPaymentIntentId(null);
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card text-card-foreground rounded-xl border border-border max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Progress Line */}
        <div className="h-1 bg-muted w-full">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width:
                step === "details"
                  ? "25%"
                  : step === "processing"
                  ? "50%"
                  : step === "payment"
                  ? "75%"
                  : "100%",
            }}
          />
        </div>

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-3">
            {step === "payment" && (
              <button
                type="button"
                onClick={() => setStep("details")}
                className="p-1.5 -ml-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                title="Back to order review"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-base font-bold text-foreground">
                {step === "details" && "Review Order"}
                {step === "processing" && "Preparing Payment..."}
                {step === "payment" && "Secure Checkout"}
                {step === "success" && "Order Confirmed"}
                {step === "error" && "Payment Incomplete"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[280px] sm:max-w-md">
                {itemName} • {currencyDisplay}
                {formatPrice(itemPrice)}
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* STEP: DETAILS (Review Order) */}
          {step === "details" && (
            <div className="space-y-5">
              {/* Item Card */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-start gap-3.5">
                  {purchaseType === "individual" && (design || course) ? (
                    (design?.previewImageUrl || course?.previewImageUrl) ? (
                      <img
                        src={design?.previewImageUrl || course?.previewImageUrl}
                        alt={itemName}
                        className="w-16 h-16 object-cover rounded-lg border border-border shrink-0 bg-muted"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg border border-border bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )
                  ) : (
                    <div className="w-16 h-16 rounded-lg border border-border bg-card flex items-center justify-center shrink-0 text-primary">
                      <Layers className="w-7 h-7" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-foreground line-clamp-1">
                          {itemName}
                        </h3>
                        {itemDescription && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {itemDescription}
                          </p>
                        )}
                      </div>
                      {hasDiscount && discountPercentage > 0 && (
                        <span className="shrink-0 px-2 py-0.5 rounded text-[11px] font-bold bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800">
                          {discountPercentage}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {purchaseType === "subscription" ? (
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                          {plan?.duration || "Monthly"} Plan
                        </span>
                      ) : design?.category?.name ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                          {design.category.name}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="border-t border-border mt-4 pt-3.5 space-y-2">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Base Price</span>
                    <span className={hasDiscount ? "line-through" : "text-foreground font-medium"}>
                      {currencyDisplay}{formatPrice(originalPrice)}
                    </span>
                  </div>

                  {hasDiscount && discountPercentage > 0 && (
                    <div className="flex justify-between items-center text-xs text-green-600 dark:text-green-400">
                      <span>Discount ({discountPercentage}%)</span>
                      <span className="font-semibold">
                        -{currencyDisplay}{formatPrice(originalPrice - itemPrice)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-border text-foreground">
                    <span className="text-sm font-bold">Total Due</span>
                    <span className="text-xl font-extrabold text-foreground tracking-tight">
                      {currencyDisplay}{formatPrice(itemPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="rounded-lg border border-border bg-card p-4 space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Order Inclusions
                </span>
                {purchaseType === "subscription" && plan?.features ? (
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-xs text-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-primary mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-2">
                    <li className="flex items-start text-xs text-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-primary mr-2 shrink-0 mt-0.5" />
                      <span>Instant digital download (ZIP archive)</span>
                    </li>
                    <li className="flex items-start text-xs text-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-primary mr-2 shrink-0 mt-0.5" />
                      <span>Commercial license included</span>
                    </li>
                    <li className="flex items-start text-xs text-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-primary mr-2 shrink-0 mt-0.5" />
                      <span>Lifetime access from your dashboard</span>
                    </li>
                  </ul>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2.5 py-2">
                <div className="p-2.5 rounded-lg border border-border bg-muted/20 text-center">
                  <Lock className="w-4 h-4 text-foreground mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-foreground">256-Bit SSL</p>
                  <p className="text-[10px] text-muted-foreground">Bank-Grade</p>
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-muted/20 text-center">
                  <Shield className="w-4 h-4 text-foreground mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-foreground">Stripe Secure</p>
                  <p className="text-[10px] text-muted-foreground">Encrypted</p>
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-muted/20 text-center">
                  <Download className="w-4 h-4 text-foreground mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-foreground">Instant Access</p>
                  <p className="text-[10px] text-muted-foreground">Auto-activated</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleInitiatePayment}
                  disabled={isCreatingIntent}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isCreatingIntent ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Setting up checkout...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Proceed to Payment ({currencyDisplay}{formatPrice(itemPrice)})</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-muted-foreground">
                  By completing this purchase you agree to the terms of service.
                </p>
              </div>
            </div>
          )}

          {/* STEP: PROCESSING */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3 text-center">
              <div className="w-12 h-12 rounded-lg border border-border bg-muted/40 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
              <p className="text-base font-bold text-foreground">
                Initializing Secure Checkout
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Establishing an encrypted session with Stripe payment gateway...
              </p>
            </div>
          )}

          {/* STEP: PAYMENT FORM */}
          {step === "payment" && clientSecret && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-border bg-muted/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Encrypted Payment Processing</span>
                </div>
                <div className="font-bold text-foreground">
                  {currencyDisplay}{formatPrice(itemPrice)}
                </div>
              </div>

              <StripeProvider clientSecret={clientSecret}>
                <PaymentForm
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  amount={itemPrice}
                  currency={currencyDisplay}
                  itemName={itemName}
                  returnUrl={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/payment/success?payment_intent=${paymentIntentId}`
                      : ""
                  }
                />
              </StripeProvider>
            </div>
          )}

          {/* STEP: SUCCESS */}
          {step === "success" && paymentIntentId && (
            <div className="space-y-5">
              <PaymentStatusChecker
                paymentIntentId={paymentIntentId}
                onSuccess={handlePaymentConfirmed}
              />

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isRedirecting}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isRedirecting ? "Updating..." : "Access Item"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push("/dashboard/purchases");
                  }}
                  className="flex-1 border border-border bg-card text-foreground hover:bg-muted py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>View Purchases</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP: ERROR */}
          {step === "error" && (
            <div className="space-y-5 py-4 text-center">
              <div className="w-12 h-12 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-foreground">Transaction Failed</p>
                <div className="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 text-xs text-red-700 dark:text-red-400 max-w-md mx-auto">
                  {errorMessage}
                </div>
              </div>

              <div className="flex gap-2.5 pt-2 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 rounded-lg font-semibold text-sm transition-colors"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="flex-1 border border-border bg-card text-foreground hover:bg-muted py-2.5 rounded-lg font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
