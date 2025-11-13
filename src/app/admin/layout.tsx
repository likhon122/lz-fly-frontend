"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  LayoutDashboard,
  Package,
  Tags,
  CreditCard,
  ShoppingCart,
  Star,
  Download,
  LogOut,
  Menu,
  X,
  Users
} from "lucide-react";
import { useLogoutMutation } from "@/services/api";
import { logout as logoutAction } from "@/store/features/authSlice";

export default function AdminLayout({
  children
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

  // If user is null or not admin/super_admin, AuthWrapper will redirect - just show loading
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Designs", href: "/admin/designs", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Pricing Plans", href: "/admin/pricing-plans", icon: CreditCard },
    { name: "Purchases", href: "/admin/purchases", icon: ShoppingCart },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Downloads", href: "/admin/downloads", icon: Download }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Ultra-Modern Sidebar with Glassmorphism */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-card via-card to-card/95 dark:from-[#0f0f0f] dark:via-[#0f0f0f] dark:to-[#0a0a0a] backdrop-blur-xl shadow-2xl border-r-2 border-border/50 transform transition-all duration-500 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full relative">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
          
          {/* Logo - Ultra Modern */}
          <div className="relative flex items-center justify-between h-20 px-6 border-b-2 border-border/50 bg-gradient-to-r from-card to-card/80 dark:from-[#0a0a0a] dark:to-[#141414]">
            <Link href="/admin" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/50 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                <LayoutDashboard className="w-6 h-6 text-secondary" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl"></div>
              </div>
              <div>
                <span className="text-2xl font-black gradient-text">Admin</span>
                <p className="text-xs text-muted-foreground font-bold">Control Panel</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation - Ultra Modern */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center px-4 py-4 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/90 text-secondary shadow-lg shadow-primary/30"
                      : "text-foreground hover:bg-muted/50 hover:scale-[1.02]"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-secondary rounded-r-full"></div>
                  )}
                  
                  {/* Icon Container */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 ${
                      isActive
                        ? "bg-secondary/20"
                        : "bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isActive ? "text-secondary" : "text-primary"
                      }`}
                    />
                  </div>
                  
                  {/* Label */}
                  <span className={`font-black text-base ${isActive ? "text-secondary" : "group-hover:text-primary"} transition-colors`}>
                    {item.name}
                  </span>
                  
                  {/* Hover Effect */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section - Ultra Modern */}
          <div className="relative border-t-2 border-border/50 p-5 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 dark:to-[#0a0a0a]">
            <div className="flex items-center mb-4">
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-secondary font-black text-xl shadow-lg">
                {user.name?.charAt(0).toUpperCase()}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-black text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground font-medium truncate">{user.email}</p>
                <span className="inline-block mt-1.5 px-3 py-1 text-xs font-black text-primary bg-primary/10 border border-primary/20 rounded-full capitalize">
                  {user.role === "super_admin" ? "Super Admin" : "Admin"}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="group w-full flex items-center justify-center px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition-all duration-300 disabled:opacity-50 font-black hover:scale-[1.02] shadow-sm hover:shadow-md"
            >
              <LogOut className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              <span>
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Ultra-Modern Main Content Area */}
      <div className="lg:pl-72">
        {/* Top Header with Glassmorphism */}
        <header className="bg-card/80 dark:bg-[#0a0a0a]/95 backdrop-blur-xl shadow-lg border-b-2 border-border/50 sticky top-0 z-30">
          <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 text-foreground hover:bg-muted rounded-xl transition-all hover:scale-105"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="group flex items-center gap-2 px-4 py-2 text-sm font-black text-muted-foreground hover:text-primary bg-muted/50 hover:bg-muted rounded-xl transition-all hover:scale-105"
              >
                <span>← Back to Site</span>
              </Link>
            </div>
            
            {/* User Welcome Badge */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border-2 border-primary/20">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-secondary font-black text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Welcome back</p>
                  <p className="text-sm font-black text-foreground">{user.name}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content with Pattern Background */}
        <main className="relative min-h-screen p-6">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
          {children}
        </main>
      </div>
    </div>
  );
}
