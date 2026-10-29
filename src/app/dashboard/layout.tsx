"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  User,
  ShoppingBag,
  Download,
  Star,
  LogOut,
  Menu,
  X,
  CreditCard,
  Heart,
  Clock,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { useLogoutMutation } from "@/services/api";
import { logout as logoutAction } from "@/store/features/authSlice";
import { signOut } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await signOut({ redirect: false }).catch(() => {});
      dispatch(logoutAction());
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "My Profile", href: "/dashboard", icon: User },
    { name: "My Purchases", href: "/dashboard/purchases", icon: ShoppingBag },
    { name: "My Payments", href: "/dashboard/payment-history", icon: CreditCard },
    { name: "Available Downloads", href: "/dashboard/available-downloads", icon: Download },
    { name: "Download History", href: "/dashboard/downloads-history", icon: Clock },
    { name: "Liked Designs", href: "/dashboard/liked-designs", icon: Heart },
    { name: "My Reviews", href: "/dashboard/reviews", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Clean, Ultra-Professional, 0 Gradient, 0 Shadow, 0 Blur) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded flex items-center justify-center font-bold text-sm tracking-tight">
              LZ
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-foreground tracking-tight leading-none">
                Dashboard
              </span>
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">
                Member Hub
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout (Bottom) */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 mb-2.5">
            <div className="w-9 h-9 rounded bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold uppercase shrink-0">
              {user.name ? user.name.charAt(0) : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">
                {user.name || "Member"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-border bg-card text-foreground hover:bg-muted/70 text-xs sm:text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 text-xs sm:text-sm font-semibold transition-colors dark:bg-red-950/30 dark:border-red-900/40 dark:text-red-400"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md border border-border text-foreground hover:bg-muted transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground font-semibold">
              <Link href="/" className="hover:text-foreground transition-colors">
                Marketplace
              </Link>
              <span>/</span>
              <span className="text-foreground">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold capitalize">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>{user.role || "Customer"}</span>
            </div>
            <Link
              href="/designs"
              className="px-4 py-2 rounded-md border border-border bg-card hover:bg-muted text-foreground text-xs sm:text-sm font-semibold transition-colors hidden md:inline-flex"
            >
              Explore Assets
            </Link>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
