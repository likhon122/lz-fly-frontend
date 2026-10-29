/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import {
  useGetReviewsQuery,
  useDeleteReviewMutation,
  useGetReviewAnalyticsQuery,
} from "@/services/api";
import {
  Star,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  Users,
  MessageSquare,
  Award,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";
import { useConfirm } from "@/components/ConfirmProvider";

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"createdAt" | "rating" | "helpful">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      sortBy,
      sortOrder,
      ...(search && { search }),
      ...(ratingFilter && { rating: ratingFilter }),
    }),
    [page, limit, sortBy, sortOrder, search, ratingFilter]
  );

  const { data, isLoading, refetch } = useGetReviewsQuery(queryParams);
  const { data: analyticsData } = useGetReviewAnalyticsQuery({
    period: analyticsPeriod,
  });
  const [deleteReview] = useDeleteReviewMutation();

  const toast = useToast();
  const { confirm } = useConfirm();

  const reviews = data?.data || [];
  const pagination = data?.pagination || {};
  const analytics = analyticsData?.data || {};

  const handleDelete = async (id: string) => {
    const confirmed = await confirm(
      "Are you sure you want to delete this review? This action cannot be undone.",
      { title: "Delete review" }
    );
    if (!confirmed) return;

    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete review");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ratingDistribution = analytics.ratingDistribution || {};
  const overviewStats = analytics.overview || {
    totalReviews: 0,
    averageRating: 0,
    helpfulReviews: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Review Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and monitor all customer reviews and ratings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={analyticsPeriod}
              onChange={(e) => setAnalyticsPeriod(e.target.value as any)}
              className="px-3.5 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Reviews
            </span>
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {overviewStats?.totalReviews ?? 0}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Total customer feedback</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Average Rating
            </span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {overviewStats.averageRating?.toFixed(1) || "0.0"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Overall customer score</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Helpful Reviews
            </span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {overviewStats?.helpfulReviews ?? 0}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Marked as helpful</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Rating Distribution
              </span>
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = Number(ratingDistribution[rating]) || 0;
                return (
                  <div
                    key={rating}
                    className="flex flex-col items-center flex-1 bg-muted/40 p-1.5 rounded-lg border border-border"
                  >
                    <span className="text-xs font-bold text-foreground">{count}</span>
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 my-0.5" />
                    <span className="text-[10px] text-muted-foreground">{rating}★</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reviews by comment, title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2 rounded-lg border-border text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Rating
              </label>
              <select
                value={ratingFilter}
                onChange={(e) => {
                  setRatingFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="createdAt">Date Created</option>
                <option value="rating">Rating</option>
                <option value="helpful">Helpfulness</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 border border-border rounded-xl bg-card">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-foreground mb-1">
            No reviews found
          </h3>
          <p className="text-sm text-muted-foreground">
            {search || ratingFilter
              ? "Try adjusting your filters"
              : "Reviews will appear here once customers start submitting them"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div
              key={review._id}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Design Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <Link
                            href={`/designs/${review.design?._id}`}
                            className="text-base font-bold text-foreground hover:text-primary transition-colors"
                          >
                            {review.design?.title || "Unknown Design"}
                          </Link>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < review.rating
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-xs font-semibold text-foreground">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 flex-wrap">
                          <span>
                            By:{" "}
                            <strong className="text-foreground">
                              {review.reviewer?.name || "Anonymous"}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                          {review.isHelpful && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-600 font-medium">
                                Marked Helpful
                              </span>
                            </>
                          )}
                        </div>

                        {review.title && (
                          <h4 className="font-semibold text-sm text-foreground mb-1.5">
                            {review.title}
                          </h4>
                        )}

                        <p className="text-sm text-foreground leading-relaxed mb-3">
                          {review.comment}
                        </p>

                        {review.updatedAt !== review.createdAt && (
                          <p className="text-xs text-muted-foreground italic">
                            Edited on{" "}
                            {new Date(review.updatedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/designs/${review.design?._id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5 rounded-lg border-border text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDelete(review._id)}
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg border-border text-xs"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{(page - 1) * limit + 1}</strong> to{" "}
              <strong>
                {Math.min(page * limit, pagination.totalItems || 0)}
              </strong>{" "}
              of <strong>{pagination.totalItems || 0}</strong> reviews
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={!pagination.hasPrevPage}
                variant="outline"
                size="sm"
                className="rounded-lg border-border text-xs"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        page === pageNum
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={!pagination.hasNextPage}
                variant="outline"
                size="sm"
                className="rounded-lg border-border text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Top Reviewed Designs */}
      {analytics.topReviewedDesigns &&
        analytics.topReviewedDesigns.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Top Reviewed Designs
            </h2>
            <div className="space-y-2.5">
              {analytics.topReviewedDesigns
                .slice(0, 5)
                .map((design: any, index: number) => (
                  <div
                    key={design._id}
                    className="flex items-center justify-between p-3.5 bg-muted/30 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">
                          {design.designTitle}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {design.reviewCount} reviews • {design.averageRating}{" "}
                          avg rating
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(design.averageRating)
                              ? "text-amber-500 fill-amber-500"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
    </div>
  );
}
