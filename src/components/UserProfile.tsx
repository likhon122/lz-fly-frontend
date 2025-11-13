"use client";

import React, { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { logout as logoutAction, User } from "../store/features/authSlice";
import {
  useLogoutMutation,
  useGetMyPurchasesQuery,
  useGetMyDownloadsQuery,
  useGetSubscriptionStatusQuery
} from "../services/api";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  User as UserIcon,
  ShoppingBag,
  Download,
  Star,
  LogOut,
  ChevronDown
} from "lucide-react";

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const { data: subscriptionData } = useGetSubscriptionStatusQuery();

  const handleLogout = async () => {
    try {
      // Logout from backend API
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear Redux state
      dispatch(logoutAction());

      // Clear NextAuth session (if OAuth login)
      await signOut({ redirect: false });

      // Clear ALL storage
      localStorage.clear();
      sessionStorage.clear();

      setIsDropdownOpen(false);

      // Force immediate redirect and reload
      window.location.replace("/login");
    }
  };

  const hasSubscription =
    subscriptionData?.data?.hasActiveSubscription || false;

  return (
    <div className="relative">
      {/* User Avatar/Button */}
      <Button
        variant="ghost"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-all"
        disabled={isLoading}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-secondary text-sm font-black shadow-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block text-sm font-bold text-foreground">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card/98 dark:bg-card/98 backdrop-blur-3xl rounded-2xl shadow-2xl border border-border z-50 overflow-hidden">
          {/* User Info */}
          <div className="p-5 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center text-secondary text-xl font-black shadow-lg ring-4 ring-primary/10">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-black text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate font-medium">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="px-3 py-1.5 text-xs font-black text-primary bg-primary/10 rounded-lg capitalize border border-primary/20">
                {user.role}
              </span>
              {hasSubscription && (
                <span className="px-3 py-1.5 text-xs font-black text-white bg-gradient-to-r from-primary to-primary/80 rounded-lg shadow-lg">
                  ⭐ Premium
                </span>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2 px-2">
            <Link
              href={
                user.role === "admin" || user.role === "super_admin"
                  ? "/admin"
                  : "/dashboard"
              }
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-foreground hover:bg-muted rounded-xl transition-all group"
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <UserIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="flex-1">
                {user.role === "admin" || user.role === "super_admin"
                  ? "Admin Panel"
                  : "Dashboard"}
              </span>
              <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 -rotate-90 transition-all" />
            </Link>
            <Link
              href="/dashboard/purchases"
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-foreground hover:bg-muted rounded-xl transition-all group"
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ShoppingBag className="w-4 h-4 text-primary" />
              </div>
              <span className="flex-1">My Purchases</span>
              <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 -rotate-90 transition-all" />
            </Link>
            <Link
              href="/dashboard/available-downloads"
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-foreground hover:bg-muted rounded-xl transition-all group"
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Download className="w-4 h-4 text-primary" />
              </div>
              <span className="flex-1">My Downloads</span>
              <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 -rotate-90 transition-all" />
            </Link>
            <Link
              href="/dashboard/reviews"
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-foreground hover:bg-muted rounded-xl transition-all group"
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <span className="flex-1">My Reviews</span>
              <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 -rotate-90 transition-all" />
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-border p-2">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all font-bold disabled:opacity-50 group"
            >
              <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-950/50 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="flex-1 text-left">
                {isLoading ? "Signing out..." : "Sign Out"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};
