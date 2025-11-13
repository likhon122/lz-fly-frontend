"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PaymentStatusChecker from "@/components/PaymentStatusChecker";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentIntentId = searchParams.get("payment_intent");

  const handleSuccess = () => {
    // Additional success handling
    setTimeout(() => {
      router.push("/dashboard/purchases");
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen bg-background">
      <div className="max-w-2xl mx-auto bg-card rounded-3xl shadow-2xl border-2 border-border p-8">
        {paymentIntentId ? (
          <>
            <PaymentStatusChecker
              paymentIntentId={paymentIntentId}
              onSuccess={handleSuccess}
            />
            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <Link
                href="/dashboard/purchases"
                className="bg-primary hover:bg-primary/90 text-secondary px-6 py-3 rounded-2xl font-black transition-all hover:scale-105 shadow-xl"
              >
                View Purchases
              </Link>
              <Link
                href="/dashboard/available-downloads"
                className="bg-primary hover:bg-primary/90 text-secondary px-6 py-3 rounded-2xl font-black transition-all hover:scale-105 shadow-xl"
              >
                Download Files
              </Link>
              <Link
                href="/designs"
                className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-2xl font-black transition-all hover:scale-105 border-2 border-border"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-destructive text-xl font-black mb-4">
              No payment information found
            </p>
            <p className="text-muted-foreground mb-6 font-medium">
              The payment intent ID is missing from the URL.
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-primary hover:bg-primary/90 text-secondary px-6 py-3 rounded-2xl font-black transition-all hover:scale-105 shadow-xl"
            >
              Back to Pricing
            </Link>
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
        <div className="container mx-auto px-4 py-12 min-h-screen bg-background">
          <div className="max-w-2xl mx-auto bg-card rounded-3xl shadow-2xl border-2 border-border p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-foreground font-black">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
