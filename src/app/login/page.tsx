"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLoginMutation } from "@/services/api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/features/authSlice";
import { Button } from "@/components/ui/button";
import OAuthButtons from "@/components/OAuthButtons";

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
    password: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await login(formData).unwrap();

      console.log(response);

      if (response.success) {
        // Set user data and token in Redux store
        dispatch(
          setCredentials({
            user: response.data.user,
            token: response.data.token // ✅ Include the token
          })
        );

        // Redirect based on user role
        const userRole = response.data.user.role;
        console.log(userRole);
        if (userRole === "super_admin" || userRole === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error: unknown) {
      console.error("Login error:", error);

      const errorData = error as {
        data?: { errors?: ApiError[]; message?: string };
      };

      if (errorData.data?.errors) {
        // Handle validation errors
        const fieldErrors: FormErrors = {};
        errorData.data.errors.forEach((err: ApiError) => {
          fieldErrors[err.field as keyof FormErrors] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        // Handle general errors
        setErrors({
          general: errorData.data?.message || "Login failed. Please try again."
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle Pattern Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(39,165,46,0.1)_1.5px,transparent_1.5px),linear-gradient(to_right,rgba(39,165,46,0.1)_1.5px,transparent_1.5px)] bg-[size:48px_48px]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/">
          <Button
            variant="outline"
            className="backdrop-blur-sm bg-card border-2 border-border hover:border-primary shadow-xl hover:shadow-primary/20 transition-all rounded-2xl font-black"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl">
          {/* Main Card with Split Layout */}
          <div className="backdrop-blur-sm bg-card rounded-3xl shadow-2xl border-2 border-border overflow-hidden">
            <div className="grid lg:grid-cols-2 min-h-[650px]">
              {/* Left Side - Form */}
              <div className="p-8 sm:p-12 flex flex-col justify-center order-2 lg:order-1">
                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-muted-foreground font-medium">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="font-black text-primary hover:underline transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* General Error */}
                  {errors.general && (
                    <div className="bg-destructive/10 border-2 border-destructive/30 text-destructive px-4 py-3 rounded-2xl flex items-start gap-3">
                      <svg
                        className="w-5 h-5 shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-black">{errors.general}</span>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-black text-foreground mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border-2 ${
                          errors.email
                            ? "border-destructive focus:border-destructive"
                            : "border-border focus:border-primary"
                        } rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all text-foreground placeholder-muted-foreground font-medium bg-background`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-destructive flex items-center gap-1 font-black">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-black text-foreground mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-12 py-3 border-2 ${
                          errors.password
                            ? "border-destructive focus:border-destructive"
                            : "border-border focus:border-primary"
                        } rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all text-foreground placeholder-muted-foreground font-medium bg-background`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-primary transition-colors"
                      >
                        {showPassword ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-destructive flex items-center gap-1 font-black">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 text-primary focus:ring-primary/20 border-border rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="text-sm text-foreground font-bold"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-black text-primary hover:underline transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 text-lg font-black bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-primary/20 transform hover:scale-105 transition-all rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-secondary"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      <>
                        Sign In
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                      </>
                    )}
                  </Button>

                  {/* OAuth Buttons */}
                  <OAuthButtons />
                </form>
              </div>

              {/* Right Side - Branding */}
              <div className="hidden lg:flex relative bg-primary p-12 items-center justify-center overflow-hidden order-1 lg:order-2">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 text-secondary max-w-md">
                  {/* Logo/Icon */}
                  <div className="w-20 h-20 rounded-2xl bg-secondary/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
                    <svg
                      className="w-12 h-12 text-secondary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>

                  <h1 className="text-4xl font-black mb-4 leading-tight">
                    Continue Your Creative Journey
                  </h1>
                  <p className="text-lg text-secondary/90 mb-8 leading-relaxed font-medium">
                    Access your dashboard, manage your designs, and connect with
                    the creative community.
                  </p>

                  {/* Features List */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-secondary/20 backdrop-blur-sm flex items-center justify-center">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-black mb-1">
                          Your Personal Dashboard
                        </h3>
                        <p className="text-sm text-secondary/80 font-medium">
                          Track your downloads and favorites
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-secondary/20 backdrop-blur-sm flex items-center justify-center">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-black mb-1">Saved Collections</h3>
                        <p className="text-sm text-secondary/80 font-medium">
                          Organize your favorite designs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-secondary/20 backdrop-blur-sm flex items-center justify-center">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-black mb-1">Premium Access</h3>
                        <p className="text-sm text-secondary/80 font-medium">
                          Unlock exclusive content
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="mt-12 pt-8 border-t border-secondary/20">
                    <div className="flex items-center gap-2 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-secondary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-secondary/90 italic mb-3 font-medium">
                      This platform has transformed how I work with design
                      templates. Absolutely love it!
                    </p>
                    <p className="text-sm text-secondary/70 font-black">
                      - Sarah Johnson, Designer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View - Show Quick Stats */}
          <div className="lg:hidden mt-6 backdrop-blur-sm bg-card rounded-3xl p-8 border-2 border-border text-center shadow-2xl">
            <p className="text-sm text-muted-foreground mb-6 font-black">
              Trusted by thousands of designers
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-black text-primary mb-2">
                  1000+
                </div>
                <div className="text-xs text-muted-foreground font-bold">Designs</div>
              </div>
              <div>
                <div className="text-3xl font-black text-primary mb-2">
                  50+
                </div>
                <div className="text-xs text-muted-foreground font-bold">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-black text-primary mb-2">
                  24/7
                </div>
                <div className="text-xs text-muted-foreground font-bold">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
