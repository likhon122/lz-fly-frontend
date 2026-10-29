"use client";

import React, { useState } from "react";
import { useGetUserPaymentsQuery } from "@/services/api";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Receipt,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentHistoryPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useGetUserPaymentsQuery({
    page,
    limit,
  });

  const payments = data?.data || [];
  const pagination = data?.pagination;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400 capitalize">
            <CheckCircle className="w-3.5 h-3.5" />
            Succeeded
          </span>
        );
      case "failed":
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400 capitalize">
            <XCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400 capitalize">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-muted text-foreground border border-border capitalize">
            <RefreshCcw className="w-3.5 h-3.5" />
            Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-muted text-muted-foreground border border-border capitalize">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav>
        <div className="flex items-center space-x-2 text-sm font-semibold">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground">Payments</span>
        </div>
      </nav>

      {/* Header Section (Matching Categories Style) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2.5">
            Billing & Invoices
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Payment History
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
            Track your billing transactions, payment references, and payment receipts.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-muted text-sm font-semibold text-foreground transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCcw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <Link href="/pricing">
            <Button
              variant="outline"
              className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-4 py-2.5 transition-colors"
            >
              Subscription Plans
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-border">
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {pagination?.totalItems || payments.length}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Total Invoices
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-primary">
            {payments.filter((p: any) => p.status === "succeeded").length}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Succeeded
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            USD
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Billing Currency
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            100%
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Encrypted Gateway
          </div>
        </div>
      </div>

      {/* Payment Records Content */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
            Loading billing records...
          </p>
        </div>
      ) : isError ? (
        <div className="p-8 text-center rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/40">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-base font-bold text-red-800 dark:text-red-400">
            Failed to load payment history
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 rounded-lg border border-red-300 bg-card text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      ) : payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment: any) => (
            <div
              key={payment._id}
              className="p-6 rounded-xl border border-border bg-card hover:border-foreground/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg border border-border bg-muted/40 flex items-center justify-center text-foreground shrink-0">
                    <Receipt className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      Transaction #{payment._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">
                      ${payment.amount?.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase">
                      {payment.currency || "USD"}
                    </div>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-5">
                  <span>
                    Method:{" "}
                    <strong className="text-foreground capitalize">
                      {payment.paymentMethod || "Card"}
                    </strong>
                  </span>
                  {payment.stripePaymentIntentId && (
                    <span className="truncate max-w-[240px]">
                      Ref: <span className="font-mono text-xs">{payment.stripePaymentIntentId.slice(-10)}</span>
                    </span>
                  )}
                </div>
                <div>
                  Status: <strong className="text-foreground capitalize">{payment.status}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-14 text-center rounded-xl border border-border bg-card">
          <CreditCard className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
          <h3 className="text-base font-bold text-foreground">No payment records found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Your billing history will appear here once you purchase templates or subscribe to a plan.
          </p>
          <div className="mt-5">
            <Link href="/pricing">
              <Button className="bg-primary text-primary-foreground font-semibold rounded-lg text-sm px-5 py-2.5 hover:bg-primary/90 transition-colors">
                Explore Plans
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-5 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} transactions)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-sm font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pagination.totalPages || isLoading}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-sm font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
