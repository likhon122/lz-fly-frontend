"use client";

import React, { useEffect, useState } from "react";
import { useGetPaymentStatusQuery } from "@/services/api";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

interface PaymentStatusCheckerProps {
  paymentIntentId: string;
  onSuccess?: () => void;
  onFailure?: () => void;
}

interface PaymentData {
  _id: string;
  user: string;
  purchaseType: string;
  design?: string;
  amount: number;
  currencyDisplay: string;
  currency: string;
  paymentMethod: string;
  paymentDetails?: unknown;
  stripePaymentIntentId: string;
  status:
    | "pending"
    | "succeeded"
    | "failed"
    | "canceled"
    | "refunded"
    | "completed"
    | "active";
  purchaseDate?: string;
  activatedAt?: string;
  itemMaxDownloads?: number;
  itemDownloadsUsed?: number;
  errorMessage?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const PaymentStatusChecker: React.FC<PaymentStatusCheckerProps> = ({
  paymentIntentId,
  onSuccess,
  onFailure,
}) => {
  const [shouldFetch, setShouldFetch] = useState(true);

  const {
    data: paymentData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPaymentStatusQuery(paymentIntentId, {
    skip: !shouldFetch || !paymentIntentId,
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });

  useEffect(() => {
    if (!paymentData?.data) return;

    const status = paymentData.data.status;

    if (
      [
        "succeeded",
        "completed",
        "active",
        "failed",
        "canceled",
        "refunded",
      ].includes(status)
    ) {
      setShouldFetch(false);

      if (["succeeded", "completed", "active"].includes(status) && onSuccess) {
        onSuccess();
      } else if (["failed", "canceled"].includes(status) && onFailure) {
        onFailure();
      }
    }
  }, [paymentData, onSuccess, onFailure, refetch]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-3">
        <div className="w-12 h-12 rounded-lg border border-border bg-muted/40 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
        <p className="text-base font-semibold text-foreground">Verifying payment status...</p>
        <p className="text-xs text-muted-foreground">Confirming transaction with bank</p>
      </div>
    );
  }

  if (isError || !paymentData?.data) {
    const errorMessage =
      typeof error === "object" && error && "data" in error
        ? (error as any)?.data?.message
        : "We couldn't verify your payment status. Please contact support.";

    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-3">
        <div className="w-12 h-12 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 dark:text-red-400">
          <XCircle className="w-6 h-6" />
        </div>
        <p className="text-lg font-bold text-foreground">Unable to Verify Payment</p>
        <p className="text-sm text-muted-foreground text-center max-w-md">{errorMessage}</p>
      </div>
    );
  }

  const payment = paymentData.data as PaymentData;

  if (!payment || typeof payment !== "object") {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-3">
        <div className="w-12 h-12 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 dark:text-red-400">
          <XCircle className="w-6 h-6" />
        </div>
        <p className="text-lg font-bold text-foreground">Invalid Payment Data</p>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Unable to retrieve payment information. Please contact support.
        </p>
      </div>
    );
  }

  const status = payment.status;
  const amount = payment.amount;
  const currency = payment.currencyDisplay || payment.currency || "$";
  const purchaseId = payment._id;

  // Success State
  if (status === "succeeded" || status === "completed" || status === "active") {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
        <div className="w-14 h-14 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400">
          <CheckCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-bold text-foreground">Payment Successful</p>
          <p className="text-sm text-muted-foreground max-w-md">
            Your payment of{" "}
            <span className="font-semibold text-foreground">
              {currency}{typeof amount === "number" ? amount.toFixed(2) : amount}
            </span>{" "}
            has been confirmed and processed securely.
          </p>
        </div>
        {purchaseId && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-border bg-muted/40 text-xs text-muted-foreground font-mono">
            <span>Ref ID:</span>
            <span className="text-foreground font-semibold">{String(purchaseId)}</span>
          </div>
        )}
      </div>
    );
  }

  // Failed State
  if (status === "failed" || status === "canceled") {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
        <div className="w-14 h-14 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 dark:text-red-400">
          <XCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-bold text-foreground">Payment Failed</p>
          <p className="text-sm text-muted-foreground max-w-md">
            {payment.errorMessage || "Your payment could not be processed. Please check your card details and try again."}
          </p>
        </div>
      </div>
    );
  }

  // Pending State
  if (status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
        <div className="w-14 h-14 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Clock className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-bold text-foreground">Payment Pending</p>
          <p className="text-sm text-muted-foreground max-w-md">
            Your payment is currently being confirmed by your payment provider. This may take a moment.
          </p>
        </div>
      </div>
    );
  }

  // Refunded State
  if (status === "refunded") {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
        <div className="w-14 h-14 rounded-xl border border-border bg-muted/40 flex items-center justify-center text-muted-foreground">
          <CheckCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-bold text-foreground">Payment Refunded</p>
          <p className="text-sm text-muted-foreground max-w-md">
            This payment was refunded to your original payment method.
          </p>
        </div>
        {payment.refundedAt && (
          <p className="text-xs text-muted-foreground font-medium" suppressHydrationWarning>
            Refunded on {new Date(payment.refundedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  }

  // Default/Unknown State
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
      <div className="w-14 h-14 rounded-xl border border-border bg-muted/40 flex items-center justify-center text-muted-foreground">
        <Clock className="w-7 h-7" />
      </div>
      <p className="text-lg font-bold text-foreground">Processing Payment</p>
      <p className="text-sm text-muted-foreground max-w-md">
        Current status: <span className="font-semibold text-foreground capitalize">{String(status || "processing")}</span>
      </p>
    </div>
  );
};

export default PaymentStatusChecker;
