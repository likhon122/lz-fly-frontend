"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "../store/hooks";
import { UserProfile } from "./UserProfile";
import { AuthButtons } from "./AuthButtons";
import { CategoryDropdown } from "./CategoryDropdown";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";

export const Header: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/designs", label: "Designs" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const linkClass = (href: string) =>
    `px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
      isActive(href)
        ? "text-primary bg-muted/60"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — LZ Fly Branding */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black text-xs tracking-tight transition-transform group-hover:scale-105">
              LZ
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-foreground tracking-tight">
                LZ Fly
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
          </Link>

          {/* Desktop Nav — center */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 3).map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
            <CategoryDropdown />
            {navLinks.slice(3).map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            {user && (
              <Link
                href={
                  user.role === "admin" || user.role === "super_admin"
                    ? "/admin"
                    : "/dashboard"
                }
                className="hidden lg:inline-flex items-center px-4 py-2 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              >
                {user.role === "admin" || user.role === "super_admin"
                  ? "Admin Panel"
                  : "Dashboard"}
              </Link>
            )}

            <div className="hidden lg:block">
              {user ? <UserProfile user={user} /> : <AuthButtons />}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-foreground/70 hover:text-foreground hover:bg-muted border border-border rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-1.5">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  isActive(l.href)
                    ? "text-primary bg-muted font-bold"
                    : "text-foreground hover:bg-muted/60"
                }`}
              >
                {l.label}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}

            <Link
              href="/categories"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-lg text-foreground hover:bg-muted/60 transition-colors"
            >
              Categories
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>

            {user && (
              <Link
                href={
                  user.role === "admin" || user.role === "super_admin"
                    ? "/admin"
                    : "/dashboard"
                }
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-sm font-bold text-primary-foreground bg-primary rounded-lg"
              >
                {user.role === "admin" || user.role === "super_admin"
                  ? "Admin Panel"
                  : "Dashboard"}
                <ChevronRight className="w-4 h-4 opacity-60" />
              </Link>
            )}

            <div className="flex items-center justify-between px-4 py-3 bg-muted/40 rounded-lg mt-2 border border-border">
              <span className="text-sm font-semibold text-foreground">
                Theme
              </span>
              <ThemeToggle />
            </div>

            <div className="pt-3 border-t border-border mt-3">
              {user ? (
                <div className="px-4 py-2">
                  <p className="text-sm font-bold text-foreground">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 text-sm font-bold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Register
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
