"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRegisterMutation } from "@/services/api";
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
  User,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  AlertCircle,
  Check,
} from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface ApiError {
  field: string;
  message: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/\d/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (formData.name.trim().length < 2 || formData.name.length > 50) {
      newErrors.name = "Name must be between 2 and 50 characters";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasLowercase = /[a-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);

    if (!hasUppercase || !hasLowercase || !hasNumber) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and numbers";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await register(formData).unwrap();

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
            errorData.data?.message || "Registration failed. Please try again.",
        });
      }
    }
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Moderate";
    if (passwordStrength < 80) return "Good";
    return "Strong";
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-foreground hover:text-primary transition-colors"
            >
              Sign In
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
                New Membership
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Create Account
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Join our curated platform to download production-grade designs and manage licenses.
              </p>
            </div>

            {/* General Error Banner */}
            {errors.general && (
              <div className="mb-5 p-4 rounded-lg border border-destructive/40 bg-muted/40 flex items-start gap-3 text-sm text-destructive">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="font-semibold">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                      errors.name
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary"
                    }`}
                    placeholder="Jane Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-destructive font-semibold">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Address */}
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
                    placeholder="jane@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-destructive font-semibold">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password and Confirm Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                        errors.password
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      }`}
                      placeholder="Min. 6 chars"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                        errors.confirmPassword
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      }`}
                      placeholder="Repeat password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Errors */}
              {(errors.password || errors.confirmPassword) && (
                <div className="space-y-1">
                  {errors.password && (
                    <p className="text-xs text-destructive font-semibold">
                      {errors.password}
                    </p>
                  )}
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive font-semibold">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="p-3 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Password strength:</span>
                    <span className="font-bold text-foreground">
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength < 40
                          ? "bg-destructive"
                          : passwordStrength < 70
                          ? "bg-orange-500"
                          : "bg-primary"
                      }`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-0 mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    Commercial License Agreement
                  </Link>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-secondary hover:bg-primary/90 font-bold rounded-lg text-sm sm:text-base py-3 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Complete Registration</span>
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

          {/* Right Column: Platform Overview & Standards */}
          <div className="hidden lg:flex lg:col-span-5 bg-muted/30 border-l border-border p-8 flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Creator Ecosystem
              </div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight mb-3">
                Built for High-Growth Product Teams
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Instant access to production-ready design systems, vector libraries, and developer-aligned component specs.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded border border-border bg-card flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      Unlimited Vault Storage
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Permanent access to downloaded files and version updates.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded border border-border bg-card flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      Full Commercial Rights
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Use in unlimited client engagements and commercial products.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded border border-border bg-card flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      Standardized Formats
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Organized tokens, Figma files, and CSS definitions.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/60">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-base font-extrabold text-foreground">
                    500+
                  </div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">
                    Assets
                  </div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-primary">
                    10K+
                  </div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">
                    Creators
                  </div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-foreground">
                    100%
                  </div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">
                    Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs sm:text-sm text-muted-foreground">
        © {new Date().getFullYear()} LZ Fly. All rights reserved. Zero-clutter, crisp UI architecture.
      </div>
    </div>
  );
}
