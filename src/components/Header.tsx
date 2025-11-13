"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "../store/hooks";
import { UserProfile } from "./UserProfile";
import { AuthButtons } from "./AuthButtons";
import { CategoryDropdown } from "./CategoryDropdown";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 dark:bg-[#0a0a0a]/98 backdrop-blur-3xl border-b border-border shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-3xl font-black gradient-text hover:scale-105 transition-transform duration-300">
              DesignHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-5 py-2.5 text-sm font-black rounded-xl transition-all duration-200 ${
                isActiveLink("/")
                  ? "text-secondary bg-primary shadow-lg border border-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:shadow-primary/30 dark:border-primary/40"
                  : "text-foreground hover:bg-muted dark:hover:bg-muted/60"
              }`}
            >
              Home
            </Link>

            <CategoryDropdown />

            <Link
              href="/designs"
              className={`px-5 py-2.5 text-sm font-black rounded-xl transition-all duration-200 ${
                isActiveLink("/designs")
                  ? "text-secondary bg-primary shadow-lg border border-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:shadow-primary/30 dark:border-primary/40"
                  : "text-foreground hover:bg-muted dark:hover:bg-muted/60"
              }`}
            >
              Designs
            </Link>

            <Link
              href="/pricing"
              className={`px-5 py-2.5 text-sm font-black rounded-xl transition-all duration-200 ${
                isActiveLink("/pricing")
                  ? "text-secondary bg-primary shadow-lg border border-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:shadow-primary/30 dark:border-primary/40"
                  : "text-foreground hover:bg-muted dark:hover:bg-muted/60"
              }`}
            >
              Pricing
            </Link>

            <Link
              href="/about"
              className={`px-5 py-2.5 text-sm font-black rounded-xl transition-all duration-200 ${
                isActiveLink("/about")
                  ? "text-secondary bg-primary shadow-lg border border-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:shadow-primary/30 dark:border-primary/40"
                  : "text-foreground hover:bg-muted dark:hover:bg-muted/60"
              }`}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`px-5 py-2.5 text-sm font-black rounded-xl transition-all duration-200 ${
                isActiveLink("/contact")
                  ? "text-secondary bg-primary shadow-lg border border-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:shadow-primary/30 dark:border-primary/40"
                  : "text-foreground hover:bg-muted dark:hover:bg-muted/60"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            {/* Dashboard/Admin Link */}
            {user && (
              <Link
                href={
                  user.role === "admin" || user.role === "super_admin"
                    ? "/admin"
                    : "/dashboard"
                }
                className="hidden lg:block px-6 py-2.5 text-sm font-black text-secondary bg-primary hover:bg-primary/90 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
              >
                {user.role === "admin" || user.role === "super_admin"
                  ? "Admin"
                  : "Dashboard"}
              </Link>
            )}

            {/* Auth Section */}
            <div className="hidden lg:block">
              {user ? <UserProfile user={user} /> : <AuthButtons />}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 text-foreground hover:bg-muted rounded-xl transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/98 dark:bg-[#0a0a0a]/98 backdrop-blur-3xl animate-fade-in">
          <div className="px-4 py-5 space-y-2">
            <Link
              href="/"
              className={`block px-5 py-3 text-sm font-black rounded-xl transition-all ${
                isActiveLink("/")
                  ? "text-secondary bg-primary shadow-lg border border-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:shadow-primary/30 dark:border-primary/40"
                  : "text-foreground hover:bg-muted dark:hover:bg-muted/60"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/designs"
              className={`block px-5 py-3 text-sm font-black rounded-xl transition-all ${
                isActiveLink("/designs")
                  ? "text-secondary bg-primary shadow-lg border border-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:shadow-primary/30 dark:border-primary/40"
                  : "text-foreground hover:bg-muted dark:hover:bg-muted/60"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Designs
            </Link>

            <Link
              href="/pricing"
              className={`block px-5 py-3 text-sm font-black rounded-xl transition-all ${
                isActiveLink("/pricing")
                  ? "text-secondary bg-primary shadow-lg border border-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:shadow-primary/30 dark:border-primary/40"
                  : "text-foreground hover:bg-muted dark:hover:bg-muted/60"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>

            {user && (
              <Link
                href={
                  user.role === "admin" || user.role === "super_admin"
                    ? "/admin"
                    : "/dashboard"
                }
                className="block px-5 py-3 text-sm font-black text-secondary bg-primary hover:bg-primary/90 rounded-xl shadow-lg border border-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:hover:bg-primary/40 dark:shadow-primary/30 dark:border-primary/40"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {user.role === "admin" || user.role === "super_admin"
                  ? "Admin"
                  : "Dashboard"}
              </Link>
            )}

            <Link
              href="/about"
              className={`block px-5 py-3 text-sm font-black rounded-xl transition-all ${
                isActiveLink("/about")
                  ? "text-secondary bg-primary shadow-lg border border-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:shadow-primary/30 dark:border-primary/40"
                  : "text-foreground hover:bg-muted dark:hover:bg-muted/60"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`block px-5 py-3 text-sm font-black rounded-xl transition-all ${
                isActiveLink("/contact")
                  ? "text-secondary bg-primary shadow-lg border border-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:shadow-primary/30 dark:border-primary/40"
                  : "text-foreground hover:bg-muted dark:hover:bg-muted/60"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Theme Toggle */}
            <div className="pt-2">
              <div className="flex items-center justify-between px-5 py-3 bg-muted rounded-xl ">
                <span className="text-sm font-black text-foreground">
                  Theme
                </span>
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Auth Section */}
            <div className="pt-3 border-t border-border">
              {user ? (
                <div className="px-5 py-3 bg-muted rounded-xl">
                  <p className="text-sm font-black text-foreground">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-bold">
                    {user.email}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block px-5 py-3 text-sm font-black text-foreground hover:bg-muted rounded-xl text-center transition-all border border-border"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-5 py-3 text-sm font-black text-secondary bg-primary hover:bg-primary/90 rounded-xl text-center shadow-lg border border-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:hover:bg-primary/40 dark:shadow-primary/30 dark:border-primary/40"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
