"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, CreditCard, ShieldCheck, AlertCircle } from "lucide-react";

interface PaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  amount: number;
  currency: string;
  itemName: string;
  returnUrl?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  onSuccess,
  onError,
  amount,
  currency,
  itemName,
  returnUrl,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError("Stripe has not loaded yet. Please try again.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl || `${window.location.origin}/payment/success`,
        },
        redirect: "if_required", // Only redirect if necessary
      });

      if (error) {
        const message =
          error.message || "An unexpected error occurred. Please try again.";
        setErrorMessage(message);
        onError(message);
      } else if (paymentIntent) {
        if (paymentIntent.status === "succeeded") {
          onSuccess(paymentIntent.id);
        } else if (paymentIntent.status === "requires_action") {
          setErrorMessage("Additional authentication required. Redirecting...");
        } else {
          onError(`Payment status: ${paymentIntent.status}`);
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Payment processing failed";
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Payment Amount Summary */}
      <div className="bg-muted/40 border border-border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">
              Total Amount
            </span>
          </div>
          <span className="text-xl font-extrabold text-foreground">
            {currency} {amount.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 truncate">{itemName}</p>
      </div>

      {/* Stripe Payment Element */}
      <div className="border border-border rounded-xl p-4 bg-card">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card"],
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3.5 flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-destructive">
              Payment Error
            </p>
            <p className="text-xs text-destructive/90 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Secured by Stripe • 256-bit encrypted transaction</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>
              Pay {currency} {amount.toFixed(2)}
            </span>
          </>
        )}
      </button>

      {/* Terms and Conditions */}
      <p className="text-[11px] text-muted-foreground text-center">
        By confirming your payment, you agree to our{" "}
        <a href="/terms" className="text-primary hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
};

export default PaymentForm;
