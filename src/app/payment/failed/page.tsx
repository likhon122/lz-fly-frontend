"use client";

/**
 * Payment Failed Page
 *
 * NOTE: Currently not actively used in the payment flow.
 * The app uses modal-based error handling via PurchaseModal.
 *
 * This page can be used for:
 * - External Stripe redirect failures
 * - Webhook failure notifications
 * - Direct error links in emails
 *
 * To activate: Update PaymentForm return_url to redirect here on errors,
 * or use as webhook failure landing page.
 */

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, AlertTriangle, Loader2 } from "lucide-react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const paymentIntentId = searchParams.get("payment_intent");

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen bg-background">
      <div className="max-w-2xl mx-auto bg-card rounded-3xl shadow-2xl border-2 border-border p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>

          <h1 className="text-3xl font-black text-foreground mb-3">
            Payment Failed
          </h1>

          <div className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-destructive mr-3 shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-destructive font-black mb-1">Error Details:</p>
                <p className="text-destructive/90 text-sm font-medium">
                  {error ||
                    "Your payment could not be processed. Please try again."}
                </p>
                {paymentIntentId && (
                  <p className="text-destructive/80 text-xs mt-2 font-medium">
                    Payment Intent: {paymentIntentId}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-4 mb-6">
            <h3 className="font-black text-foreground mb-2">
              Common Reasons for Payment Failure:
            </h3>
            <ul className="text-sm text-muted-foreground font-medium text-left space-y-1">
              <li>• Insufficient funds in your account</li>
              <li>• Card expired or incorrect details</li>
              <li>• Payment declined by your bank</li>
              <li>• Network or connection issues</li>
              <li>• 3D Secure authentication failed</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/pricing"
              className="bg-primary hover:bg-primary/90 text-secondary px-8 py-3 rounded-2xl font-black transition-all hover:scale-105 shadow-2xl"
            >
              Try Again
            </Link>
            <Link
              href="/contact"
              className="bg-muted hover:bg-muted/80 text-foreground px-8 py-3 rounded-2xl font-black transition-all hover:scale-105 border-2 border-border"
            >
              Contact Support
            </Link>
            <Link
              href="/dashboard"
              className="bg-card hover:bg-muted text-foreground px-8 py-3 rounded-2xl font-black transition-all hover:scale-105 border-2 border-border"
            >
              Go to Dashboard
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground font-medium">
              Need help? Our support team is available 24/7
            </p>
            <p className="text-sm text-muted-foreground/80 mt-1 font-medium">
              Email:{" "}
              <a
                href="mailto:support@example.com"
                className="text-primary hover:underline font-black"
              >
                support@example.com
              </a>
            </p>
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
      <PaymentFailedContent />
    </Suspense>
  );
}
