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
} from "lucide-react";
import { useLogoutMutation } from "@/services/api";
import { logout as logoutAction } from "@/store/features/authSlice";

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

  // AuthWrapper now handles all redirect logic - layouts just render!
  // No more timers, no more manual redirects, no more auth checks here

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear Redux state
      dispatch(logoutAction());

      // Clear ALL storage
      localStorage.clear();
      sessionStorage.clear();

      // Force immediate redirect and reload
      window.location.replace("/login");
    }
  };

  // If user is null, AuthWrapper will redirect - just show loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "My Profile", href: "/dashboard", icon: User },
    { name: "My Purchases", href: "/dashboard/purchases", icon: ShoppingBag },
    {
      name: "My Payments",
      href: "/dashboard/payment-history",
      icon: CreditCard,
    },
    {
      name: "Available Downloads",
      href: "/dashboard/available-downloads",
      icon: Download,
    },

    {
      name: "Download History",
      href: "/dashboard/downloads-history",
      icon: Download,
    },
    { name: "My Reviews", href: "/dashboard/reviews", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg"></div>
              <span className="text-lg font-bold text-foreground">Dashboard</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-foreground hover:bg-blue-50 hover:text-primary"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-border p-4 bg-muted/50">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded capitalize">
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 font-medium text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-card border-b border-border sticky top-0 z-30">
          <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome,{" "}
                <span className="font-semibold text-foreground">{user.name}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
