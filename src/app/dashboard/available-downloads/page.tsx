"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useGetMyPurchasesQuery,
  useGetDesignsQuery,
  useDownloadDesignMutation,
} from "@/services/api";
import {
  Download,
  Calendar,
  Package,
  CheckCircle,
  Loader2,
  Search,
  X,
  RefreshCw,
  Clock,
  ExternalLink,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { Purchase, DesignForDownload } from "@/types/dashboard";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/button";

export default function AvailableDownloadsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "purchased" | "subscription">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const purchasesQueryParams = useMemo(
    () => ({
      page: 1,
      limit: 100,
    }),
    []
  );

  const { data: purchasesData, isLoading: purchasesLoading } =
    useGetMyPurchasesQuery(purchasesQueryParams);

  const designsQueryParams = useMemo(
    () => ({
      page,
      limit: 12,
      status: "Active" as const,
      ...(categoryFilter && { category: categoryFilter }),
      ...(searchQuery && { search: searchQuery }),
    }),
    [page, categoryFilter, searchQuery]
  );

  const {
    data: allDesignsData,
    isLoading: designsLoading,
    refetch,
  } = useGetDesignsQuery(designsQueryParams);

  const [downloadDesign, { isLoading: downloadLoading }] =
    useDownloadDesignMutation();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, searchQuery, filter]);

  const purchases = (purchasesData?.data || []) as Purchase[];
  const allDesigns = (allDesignsData?.data || []) as DesignForDownload[];

  const activeSubscription = purchases.find(
    (p: Purchase) =>
      p.purchaseType === "subscription" &&
      p.status === "completed" &&
      p.subscriptionEndDate &&
      new Date(p.subscriptionEndDate) > new Date()
  );

  const hasActiveSubscription = !!activeSubscription;

  const purchasedDesignIds = new Set(
    purchases
      .filter(
        (purchase: Purchase) =>
          purchase.purchaseType === "individual" &&
          purchase.status === "completed" &&
          Boolean(purchase.design?._id)
      )
      .map((purchase: Purchase) => purchase.design!._id)
  );

  const availableDesigns = useMemo(() => {
    let list: DesignForDownload[] = [];

    if (hasActiveSubscription) {
      list = allDesigns;
    } else {
      list = allDesigns.filter((design) => purchasedDesignIds.has(design._id));
    }

    if (filter === "purchased") {
      list = list.filter((design) => purchasedDesignIds.has(design._id));
    } else if (filter === "subscription" && hasActiveSubscription) {
      list = list.filter((design) => !purchasedDesignIds.has(design._id));
    }

    return list;
  }, [allDesigns, purchasedDesignIds, hasActiveSubscription, filter]);

  const handleDownload = async (designId: string) => {
    try {
      setDownloadingId(designId);
      const blob = await downloadDesign(designId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `design-${designId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Download started successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to initiate download");
    } finally {
      setDownloadingId(null);
    }
  };

  const isLoading = purchasesLoading || designsLoading;

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
          <span className="text-foreground">Available Downloads</span>
        </div>
      </nav>

      {/* Header Section (Matching Categories Style) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2.5">
            File Vault
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Available Downloads
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
            Instant download access to all individually purchased files and
            active subscription assets.
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
          {!hasActiveSubscription && (
            <Link href="/pricing">
              <Button className="bg-primary text-primary-foreground font-semibold rounded-lg text-sm px-4 py-2.5 hover:bg-primary/90 transition-colors">
                Unlock All via Subscription
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-border">
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {availableDesigns.length}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Ready to Download
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-primary">
            {purchasedDesignIds.size}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Single Licenses
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {hasActiveSubscription ? "Active" : "None"}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Subscription
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            ZIP / Source
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Production Ready
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-5 rounded-xl border border-border bg-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search available files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            All Access
          </button>
          <button
            onClick={() => setFilter("purchased")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              filter === "purchased"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            Direct Purchases ({purchasedDesignIds.size})
          </button>
          {hasActiveSubscription && (
            <button
              onClick={() => setFilter("subscription")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                filter === "subscription"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              Subscription Catalog
            </button>
          )}
        </div>
      </div>

      {/* Grid of Designs */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
            Loading downloadable assets...
          </p>
        </div>
      ) : availableDesigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableDesigns.map((design) => {
            const isPurchased = purchasedDesignIds.has(design._id);
            const isDownloading = downloadingId === design._id;
            const previewUrl =
              (design as any).previewImageUrls?.[0] || design.previewImageUrl;

            return (
              <div
                key={design._id}
                className="border border-border rounded-xl bg-card overflow-hidden flex flex-col hover:border-foreground/40 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] bg-muted border-b border-border overflow-hidden">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt={design.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Layers className="w-10 h-10" />
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    {isPurchased ? (
                      <span className="px-2.5 py-1 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:border-green-800 dark:text-green-400 uppercase tracking-wider">
                        Purchased
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded text-xs font-semibold bg-primary text-primary-foreground uppercase tracking-wider">
                        Subscription
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground truncate">
                      {design.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                      by {(design as any).designer?.name || (design as any).designerName || "LZ Designer"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
                    <Link
                      href={`/designs/${design._id}`}
                      className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      <span>Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <Button
                      onClick={() => handleDownload(design._id)}
                      disabled={isDownloading || downloadLoading}
                      className="bg-primary text-primary-foreground font-bold rounded-lg text-sm px-4 py-2 hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-14 text-center rounded-xl border border-border bg-card">
          <Download className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
          <h3 className="text-base font-bold text-foreground">
            No downloadable assets found
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            {hasActiveSubscription
              ? "No assets match your search query."
              : "You have not purchased any individual assets yet, and do not have an active subscription."}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link href="/designs">
              <Button
                variant="outline"
                className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-5 py-2.5 transition-colors"
              >
                Browse Designs
              </Button>
            </Link>
            {!hasActiveSubscription && (
              <Link href="/pricing">
                <Button className="bg-primary text-primary-foreground font-semibold rounded-lg text-sm px-5 py-2.5 hover:bg-primary/90 transition-colors">
                  View Subscriptions
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
