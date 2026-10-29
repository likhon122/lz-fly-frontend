"use client";

import React, { useState } from "react";
import { useGetMyLikesQuery } from "@/services/api";
import { LikeButton } from "@/components/LikeButton";
import Link from "next/link";
import Image from "next/image";
import { Heart, Loader2, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LikedDesignsPage() {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error } = useGetMyLikesQuery({ page, limit });

  const likedDesigns = data?.data || [];
  const pagination = data?.pagination;

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
          <span className="text-foreground">Liked Designs</span>
        </div>
      </nav>

      {/* Header Section (Matching Categories Style) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2.5">
            Saved Bookmarks
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            My Liked Designs
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
            Your personal collection of bookmarked creative assets, templates, and UI components.
          </p>
        </div>
        <Link href="/designs">
          <Button
            variant="outline"
            className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-4 py-2.5 transition-colors"
          >
            Explore More Designs
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-border">
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {pagination?.totalItems || likedDesigns.length}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Bookmarked Assets
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-primary">
            Instant
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            One-Click Access
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Synced
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Cloud Saved
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Original
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Verified Files
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
            Loading saved bookmarks...
          </p>
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/40">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            Failed to load bookmarks. Please try again later.
          </p>
        </div>
      ) : likedDesigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {likedDesigns.map((item: any) => {
            const design = item.design;
            if (!design) return null;
            const previewUrl =
              design.previewImageUrls?.[0] || design.previewImageUrl;

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

                  {/* Like Button on Thumbnail */}
                  <div className="absolute top-3 right-3">
                    <LikeButton
                      designId={design._id}
                      initialLikesCount={design.likesCount || 0}
                      variant="icon"
                      size="sm"
                    />
                  </div>

                  {/* Category Pill */}
                  {design.category?.name && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded text-xs font-semibold bg-background/90 text-foreground border border-border uppercase tracking-wider">
                        {design.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground truncate">
                      {design.title}
                    </h3>
                    <p className="text-sm font-bold text-foreground mt-1">
                      ${(design.discountedPrice ?? design.basePrice ?? design.price ?? 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
                    <Link
                      href={`/designs/${design._id}`}
                      className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5"
                    >
                      <span>View Asset</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-14 text-center rounded-xl border border-border bg-card">
          <Heart className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
          <h3 className="text-base font-bold text-foreground">No liked designs yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Click the heart icon on any template or design while browsing to save it to your bookmarks.
          </p>
          <div className="mt-5">
            <Link href="/designs">
              <Button className="bg-primary text-primary-foreground font-semibold rounded-lg text-sm px-5 py-2.5 hover:bg-primary/90 transition-colors">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-5 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} bookmarks)
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
