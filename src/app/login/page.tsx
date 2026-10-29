"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLoginMutation } from "@/services/api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/features/authSlice";
import { Button } from "@/components/ui/button";
import OAuthButtons from "@/components/OAuthButtons";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface ApiError {
  field: string;
  message: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFillSuperAdmin = () => {
    setFormData({
      email: "superadmin@gmail.com",
      password: "SuperAdmin1234",
    });
    setErrors({});
  };

  const copyToClipboard = (text: string, field: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await login(formData).unwrap();

      if (response.success) {
        dispatch(
          setCredentials({
            user: response.data.user,
            token: response.data.token,
          }),
        );

        const userRole = response.data.user.role;
        if (userRole === "super_admin" || userRole === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error: unknown) {
      const errorData = error as {
        data?: { errors?: ApiError[]; message?: string };
      };

      if (errorData.data?.errors) {
        const fieldErrors: FormErrors = {};
        errorData.data.errors.forEach((err: ApiError) => {
          fieldErrors[err.field as keyof FormErrors] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({
          general:
            errorData.data?.message || "Login failed. Please verify credentials.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Breadcrumb / Return */}
        <div className="flex items-center justify-between pb-6 border-b border-border mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Storefront
          </Link>
          <div className="text-sm text-muted-foreground font-medium">
            New creator?{" "}
            <Link
              href="/register"
              className="font-bold text-foreground hover:text-primary transition-colors"
            >
              Register Account
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-12 my-auto">
        <div className="border border-border rounded-xl bg-card overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 p-6 sm:p-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
                Authentication
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Sign In
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Enter your credentials to access your user dashboard or admin control panel.
              </p>
            </div>

            {/* INTERVIEWER / REVIEWER DEMO CREDENTIALS CARD */}
            <div className="mb-6 rounded-lg border border-primary/30 bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Interviewer Demo Access
                  </span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-primary text-primary-foreground uppercase tracking-wider">
                  Super Admin
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Use these pre-configured credentials to evaluate the entire admin panel, revenue metrics, user management, and catalog controls:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded border border-border bg-card flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Admin Email</span>
                  <div className="flex items-center justify-between mt-1">
                    <code className="text-foreground font-mono font-semibold text-xs">superadmin@gmail.com</code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("superadmin@gmail.com", "email")}
                      className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                      title="Copy email"
                    >
                      {copiedField === "email" ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded border border-border bg-card flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Password</span>
                  <div className="flex items-center justify-between mt-1">
                    <code className="text-foreground font-mono font-semibold text-xs">SuperAdmin1234</code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("SuperAdmin1234", "password")}
                      className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                      title="Copy password"
                    >
                      {copiedField === "password" ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFillSuperAdmin}
                className="w-full py-2 px-3 text-xs font-bold rounded border border-border bg-card hover:bg-muted text-foreground transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>1-Click Auto-Fill Super Admin Credentials</span>
              </button>
            </div>

            {/* General Error Banner */}
            {errors.general && (
              <div className="mb-5 p-4 rounded-lg border border-destructive/40 bg-muted/40 flex items-start gap-3 text-sm text-destructive">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="font-semibold">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                      errors.email
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary"
                    }`}
                    placeholder="name@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-destructive font-semibold">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2.5 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                      errors.password
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary"
                    }`}
                    placeholder="Account password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-destructive font-semibold">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-0"
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm text-muted-foreground font-medium cursor-pointer"
                >
                  Keep session authenticated
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-secondary hover:bg-primary/90 font-bold rounded-lg text-sm sm:text-base py-3 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Sign In & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>

              {/* OAuth Providers */}
              <div className="pt-4 border-t border-border">
                <OAuthButtons />
              </div>
            </form>
          </div>

          {/* Right Column: Platform Overview & Admin Feature Highlights */}
          <div className="hidden lg:flex lg:col-span-5 bg-muted/30 border-l border-border p-8 flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Platform Standard
              </div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight mb-3">
                Secure & Verified Access
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Connect seamlessly with cryptographic session verification, automated token rotation, and single-click OAuth integrations.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded border border-border bg-card flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      Super Admin Authority
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Full access to pricing, purchases, user roles, downloads, and payments.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded border border-border bg-card flex items-center justify-center shrink-0 mt-0.5">
                    <Layers className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      Live Telemetry & Auditing
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Real-time download stats, Stripe transactions, and review queues.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded border border-border bg-card flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      Instant Redirection
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Signing in with Super Admin automatically redirects to <code className="text-foreground font-mono">/admin</code>.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/60">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-base font-extrabold text-foreground">
                    100%
                  </div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">
                    Admin Access
                  </div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-primary">
                    Live
                  </div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">
                    Telemetry
                  </div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-foreground">
                    RBAC
                  </div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">
                    Enabled
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs sm:text-sm text-muted-foreground">
        © {new Date().getFullYear()} LZ Fly. All rights reserved. Crisp UI architectural standard.
      </div>
    </div>
  );
}
