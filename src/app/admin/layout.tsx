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
import { signOut } from "next-auth/react";
import LZLoader from "@/components/LZLoader";

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

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear OAuth session if exists
      await signOut({ redirect: false }).catch(() => {});

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
    return <LZLoader label="Authenticating Admin" />;
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

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo */}
          <div className="relative flex items-center justify-between h-20 px-6 border-b border-border bg-card">
            <Link href="/admin" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-foreground tracking-tight">LZ Fly</span>
                <span className="text-xs font-bold text-primary px-2 py-0.5 rounded border border-primary/20 bg-primary/10">Admin</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-foreground hover:bg-muted/70 font-semibold"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 transition-all ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-foreground group-hover:text-primary"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="relative border-t border-border p-5 bg-card">
            <div className="flex items-center mb-4">
              <div className="relative w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-lg">
                {user.name?.charAt(0).toUpperCase()}
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card"></div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground font-medium truncate">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded capitalize">
                  {user.role === "super_admin" ? "Super Admin" : "Admin"}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center px-4 py-2 text-destructive border border-border hover:bg-muted rounded-lg transition-colors font-semibold text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="bg-card border-b border-border sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-foreground hover:bg-muted border border-border rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted border border-border rounded-lg transition-colors"
              >
                <span>← Back to Site</span>
              </Link>
            </div>
            
            {/* User Welcome Badge */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-muted/40 rounded-lg border border-border">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{user.name}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative min-h-[calc(100vh-4rem)] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
