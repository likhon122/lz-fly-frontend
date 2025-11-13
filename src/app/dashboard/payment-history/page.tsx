"use client";

import React, { useState } from "react";
import { useGetUserPaymentsQuery } from "@/services/api";
import {
  Loader2,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
  ChevronRight,
  Download,
} from "lucide-react";
import Link from "next/link";

export default function PaymentHistoryPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useGetUserPaymentsQuery({
    page,
    limit,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case "failed":
      case "canceled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "refunded":
        return <RefreshCcw className="w-5 h-5 text-muted-foreground" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      succeeded: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      canceled: "bg-muted text-gray-800 border-border",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      refunded: "bg-purple-100 text-purple-800 border-purple-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          styles[status as keyof typeof styles] || styles.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-800 font-semibold mb-2">
            Failed to load payment history
          </p>
          <button
            onClick={() => refetch()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const payments = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Payment History
        </h1>
        <p className="text-muted-foreground">
          View all your transactions and payment details
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Payments</p>
              <p className="text-2xl font-bold text-foreground">
                {payments.length}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Successful</p>
              <p className="text-2xl font-bold text-primary">
                {payments.filter((p: any) => p.status === "succeeded").length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {payments.filter((p: any) => p.status === "pending").length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {
                  payments.filter(
                    (p: any) => p.status === "failed" || p.status === "canceled"
                  ).length
                }
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium mb-2">
            No payment history yet
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Your payment transactions will appear here
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View Pricing Plans
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment: any) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-foreground">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {payment.designId?.previewImageUrls?.[0] && (
                          <img
                            src={payment.designId.previewImageUrls[0]}
                            alt={payment.designId.title}
                            className="w-10 h-10 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {payment.designId?.title ||
                              payment.courseId?.title ||
                              payment.pricingPlanId?.name ||
                              "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {payment.productType}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-foreground">
                        {payment.currency} {payment.amount.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.status === "succeeded" && payment.purchaseId && (
                        <Link
                          href={`/dashboard/purchases`}
                          className="text-primary hover:text-blue-800 font-medium flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          View Purchase
                        </Link>
                      )}
                      {payment.status === "failed" && (
                        <button className="text-red-600 hover:text-red-800 font-medium">
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {data.pagination.currentPage} of{" "}
                {data.pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-muted hover:bg-gray-200 disabled:bg-muted/50 disabled:text-muted-foreground text-foreground rounded-lg font-medium transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.pagination.totalPages}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted/50 disabled:text-muted-foreground text-white rounded-lg font-medium transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
