/**
 * Stripe Configuration Validation
 * Ensures all required Stripe environment variables are present
 */

let cachedPublishableKey: string | null = null;

export function validateStripeConfig() {
  if (cachedPublishableKey) {
    return cachedPublishableKey;
  }

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      "❌ STRIPE CONFIGURATION ERROR: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in environment variables. " +
        "Please add it to your .env.local file."
    );
  }

  if (!publishableKey.startsWith("pk_")) {
    throw new Error(
      "❌ STRIPE CONFIGURATION ERROR: Invalid Stripe publishable key format. " +
        "Key should start with 'pk_test_' (test mode) or 'pk_live_' (production)."
    );
  }

  // Warn if using test key in production
  if (
    process.env.NODE_ENV === "production" &&
    publishableKey.startsWith("pk_test_")
  ) {
    console.warn(
      "⚠️ WARNING: You are using a Stripe TEST key in PRODUCTION environment. " +
        "Please use your LIVE key (pk_live_...) for production deployments."
    );
  }

  cachedPublishableKey = publishableKey;
  return publishableKey;
}

export function getStripeConfig() {
  return {
    publishableKey: validateStripeConfig(),
    locale: "en" as const,
    maxNetworkRetries: 3
  };
}

// Optional: Export this only if you want immediate validation
// Otherwise, use getStripeConfig() function
export const STRIPE_CONFIG = {
  get publishableKey() {
    return validateStripeConfig();
  },
  locale: "en" as const,
  maxNetworkRetries: 3
};
