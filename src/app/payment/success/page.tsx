"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PaymentStatusChecker from "@/components/PaymentStatusChecker";
import Link from "next/link";
import { Loader2, ArrowRight, Download, ShoppingBag } from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentIntentId = searchParams.get("payment_intent");

  const handleSuccess = () => {
    setTimeout(() => {
      router.push("/dashboard/purchases");
    }, 4000);
  };

  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh] flex items-center justify-center bg-background">
      <div className="max-w-xl w-full bg-card rounded-xl border border-border p-6 sm:p-8">
        {paymentIntentId ? (
          <>
            <PaymentStatusChecker
              paymentIntentId={paymentIntentId}
              onSuccess={handleSuccess}
            />
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/purchases"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors text-center flex items-center justify-center gap-2"
              >
                <span>View Purchases</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/available-downloads"
                className="border border-border bg-card hover:bg-muted text-foreground px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors text-center flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Files</span>
              </Link>
              <Link
                href="/designs"
                className="border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors text-center flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse More</span>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-8 space-y-4">
            <p className="text-destructive text-lg font-bold">
              No Payment Session Found
            </p>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              The payment reference identifier was not provided in this URL request.
            </p>
            <div className="pt-2">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
              >
                Return to Pricing
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 min-h-[80vh] flex items-center justify-center bg-background">
          <div className="max-w-xl w-full bg-card rounded-xl border border-border p-8 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-semibold text-muted-foreground">Loading checkout status...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
