"use client";

import { useState, useMemo } from "react";
import { useGetMyDownloadsQuery } from "@/services/api";
import {
  Calendar,
  Package,
  RefreshCw,
  Clock,
  Filter,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Download,
  FileDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function DownloadsHistoryPage() {
  const [page, setPage] = useState(1);
  const limit = 12;
  const [sortBy, setSortBy] = useState<"downloadDate" | "createdAt">(
    "downloadDate"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [downloadType, setDownloadType] = useState<
    "all" | "individual_purchase" | "subscription"
  >("all");

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      sortBy,
      sortOrder,
      ...(downloadType !== "all" && { downloadType }),
    }),
    [page, limit, sortBy, sortOrder, downloadType]
  );

  const { data, isLoading, refetch } = useGetMyDownloadsQuery(queryParams);

  const downloads = data?.data || [];
  const pagination = data?.pagination;

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
          <span className="text-foreground">Download History</span>
        </div>
      </nav>

      {/* Header Section (Matching Categories Style) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2.5">
            Activity Log
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Download History
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
            Audit trail of all asset downloads, historical timestamps, and license allocations.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-muted text-sm font-semibold text-foreground transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <Link href="/dashboard/available-downloads">
            <Button
              variant="outline"
              className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-4 py-2.5 transition-colors"
            >
              Available Downloads
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-border">
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {pagination?.totalItems || downloads.length}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Total Downloads
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-primary">
            {downloads.filter((d: any) => d.downloadType === "subscription").length}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Subscription Usage
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {downloads.filter((d: any) => d.downloadType === "individual_purchase").length}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Direct Purchases
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Original
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Asset Integrity
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-5 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">Filter Records:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={downloadType}
            onChange={(e) => setDownloadType(e.target.value as any)}
            className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
          >
            <option value="all">All License Types</option>
            <option value="individual_purchase">Individual Purchase</option>
            <option value="subscription">Subscription Quota</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          {downloadType !== "all" && (
            <button
              onClick={() => setDownloadType("all")}
              className="text-sm text-primary font-bold hover:underline ml-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* History List */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
            Loading download history...
          </p>
        </div>
      ) : downloads.length > 0 ? (
        <div className="space-y-4">
          {downloads.map((item: any) => {
            const previewUrl =
              item.design?.previewImageUrls?.[0] || item.design?.previewImageUrl;

            return (
              <div
                key={item._id}
                className="p-5 rounded-xl border border-border bg-card hover:border-foreground/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-14 h-14 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt={item.design?.title || "Design"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <FileDown className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-foreground truncate">
                      {item.design?.title || "Design Asset"}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                      by {item.design?.designerName || "Designer"} • Downloaded {formatDate(item.downloadDate || item.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                  <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-muted text-foreground border border-border uppercase tracking-wider">
                    {item.downloadType === "subscription" ? "Subscription" : "Direct Purchase"}
                  </span>
                  {item.design?._id && (
                    <Link
                      href={`/designs/${item.design._id}`}
                      className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label="View Asset"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-14 text-center rounded-xl border border-border bg-card">
          <Clock className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
          <h3 className="text-base font-bold text-foreground">
            No download activity recorded
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            You haven&apos;t downloaded any design assets yet. Downloaded files will be logged here.
          </p>
          <div className="mt-5">
            <Link href="/dashboard/available-downloads">
              <Button className="bg-primary text-primary-foreground font-semibold rounded-lg text-sm px-5 py-2.5 hover:bg-primary/90 transition-colors">
                Available Downloads
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-5 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} entries)
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
