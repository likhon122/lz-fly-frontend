"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

function getErrorMessage(error: string | null): string | null {
  if (!error) return null;
  switch (error) {
    case "Configuration":
      return "OAuth provider configuration is incomplete. Please ensure client IDs and secrets are configured in .env.local.";
    case "AccessDenied":
      return "Access was denied by the OAuth provider. You may have cancelled the sign-in.";
    case "Verification":
      return "The sign-in link has expired or has already been used. Please try again.";
    case "OAuthSignin":
      return "Error contacting the OAuth provider. Please check your network and provider credentials.";
    case "OAuthCallback":
      return "OAuth verification failed. Please ensure you open http://localhost:3000 (not 127.0.0.1) and try in an Incognito / Private window to clear any stale cookies.";
    case "Callback":
      return "Failed to synchronize your account with the backend. Please check that the backend server is running.";
    case "OAuthAccountNotLinked":
      return "An account with this email already exists with another provider. Please sign in using your original method.";
    default:
      return "An authentication error occurred. Please try again.";
  }
}

function OAuthErrorBanner({ localError }: { localError: string | null }) {
  const searchParams = useSearchParams();
  const urlError = searchParams?.get("error") || null;
  const message = localError || getErrorMessage(urlError);

  if (!message) return null;

  return (
    <div className="flex items-start gap-2.5 p-3.5 mb-4 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl">
      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
      <span className="leading-snug">{message}</span>
    </div>
  );
}

export default function OAuthButtons() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    // Prevent cross-origin localhost vs 127.0.0.1 cookie loss
    if (typeof window !== "undefined" && window.location.hostname === "127.0.0.1") {
      window.location.href = window.location.href.replace("127.0.0.1", "localhost");
      return;
    }

    if (provider === "google") {
      setIsGoogleLoading(true);
    } else {
      setIsGitHubLoading(true);
    }
    setError(null);

    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      console.error(`${provider} sign-in exception:`, err);
      setError(`Failed to initiate ${provider} sign-in`);
      setIsGoogleLoading(false);
      setIsGitHubLoading(false);
    }
  };

  const isBusy = isGoogleLoading || isGitHubLoading;

  return (
    <div className="space-y-3 w-full">
      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold text-muted-foreground">
          <span className="px-3 bg-background">Or continue with</span>
        </div>
      </div>

      {/* Error message */}
      <Suspense fallback={null}>
        <OAuthErrorBanner localError={error} />
      </Suspense>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleOAuthSignIn("google")}
          disabled={isBusy}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-muted/60 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span>{isGoogleLoading ? "Connecting..." : "Google"}</span>
        </button>

        {/* GitHub Button */}
        <button
          type="button"
          onClick={() => handleOAuthSignIn("github")}
          disabled={isBusy}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-muted/60 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isGitHubLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-foreground" />
          ) : (
            <svg
              className="w-4 h-4 shrink-0 fill-current text-foreground"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>{isGitHubLoading ? "Connecting..." : "GitHub"}</span>
        </button>
      </div>
    </div>
  );
}
