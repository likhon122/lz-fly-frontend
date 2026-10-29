"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, AlertCircle, Loader2, ArrowLeft, RefreshCw, LifeBuoy } from "lucide-react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const paymentIntentId = searchParams.get("payment_intent");

  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh] flex items-center justify-center bg-background">
      <div className="max-w-xl w-full bg-card rounded-xl border border-border p-6 sm:p-8">
        <div className="text-center">
          <div className="w-14 h-14 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
            <XCircle className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Payment Incomplete
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            We could not complete your transaction. No charges have been made.
          </p>

          <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-5 text-left">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-700 dark:text-red-400">Transaction Status:</p>
                <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">
                  {error || "Your payment could not be processed. Please verify your card details and try again."}
                </p>
                {paymentIntentId && (
                  <p className="text-[11px] text-muted-foreground font-mono mt-2">
                    Ref: {paymentIntentId}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6 text-left">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Common solutions
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>Check your card balance or daily limit</li>
              <li>Confirm expiration date and CVC security code</li>
              <li>Ensure 3D Secure verification was approved in banking app</li>
              <li>Try an alternate card or payment method</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              href="/pricing"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors text-center flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Link>
            <Link
              href="/contact"
              className="border border-border bg-card hover:bg-muted text-foreground px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors text-center flex items-center justify-center gap-2"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Contact Support</span>
            </Link>
            <Link
              href="/dashboard"
              className="border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors text-center flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 min-h-[80vh] flex items-center justify-center bg-background">
          <div className="max-w-xl w-full bg-card rounded-xl border border-border p-8 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-semibold text-muted-foreground">Loading payment details...</p>
          </div>
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
