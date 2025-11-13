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
  TrendingUp,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Review Management
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage and monitor all customer reviews
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={analyticsPeriod}
            onChange={(e) => setAnalyticsPeriod(e.target.value as any)}
            className="px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:p-5">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-5 text-white shadow-xl dark:shadow-primary/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-card/20 rounded-xl backdrop-blur-sm">
              <MessageSquare className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {overviewStats.totalReviews}
          </h3>
          <p className="text-blue-100 text-sm">Total Reviews</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 sm:p-5 text-white shadow-xl dark:shadow-primary/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-card/20 rounded-xl backdrop-blur-sm">
              <Star className="w-6 h-6" />
            </div>
            <Award className="w-5 h-5 opacity-75" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {overviewStats.averageRating?.toFixed(1) || "0.0"}
          </h3>
          <p className="text-yellow-100 text-sm">Average Rating</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-5 text-white shadow-xl dark:shadow-primary/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-card/20 rounded-xl backdrop-blur-sm">
              <Users className="w-6 h-6" />
            </div>
            <Eye className="w-5 h-5 opacity-75" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {overviewStats.helpfulReviews}
          </h3>
          <p className="text-green-100 text-sm">Helpful Reviews</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-5 text-white shadow-xl dark:shadow-primary/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-card/20 rounded-xl backdrop-blur-sm">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = Number(ratingDistribution[rating]) || 0;
              return (
                <div key={rating} className="flex flex-col items-center flex-1">
                  <div className="text-xs font-bold">{count}</div>
                  <Star className="w-3 h-3 fill-white" />
                  <div className="text-xs opacity-75">{rating}</div>
                </div>
              );
            })}
          </div>
          <p className="text-purple-100 text-sm mt-3">Rating Distribution</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reviews by comment, title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rating
              </label>
              <select
                value={ratingFilter}
                onChange={(e) => {
                  setRatingFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
              <label className="block text-sm font-medium text-foreground mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="createdAt">Date Created</option>
                <option value="rating">Rating</option>
                <option value="helpful">Helpfulness</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-card rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No reviews found
          </h3>
          <p className="text-muted-foreground">
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
              className="bg-card rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Design Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link
                            href={`/designs/${review.design?._id}`}
                            className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                          >
                            {review.design?.title || "Unknown Design"}
                          </Link>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-sm font-semibold text-foreground">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <span>
                            By:{" "}
                            <strong>
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
                              <span className="text-primary font-medium">
                                Marked Helpful
                              </span>
                            </>
                          )}
                        </div>

                        {review.title && (
                          <h4 className="font-bold text-foreground mb-2">
                            {review.title}
                          </h4>
                        )}

                        <p className="text-foreground leading-relaxed mb-3">
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
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/designs/${review.design?._id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Design
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDelete(review._id)}
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:bg-red-500/10 dark:bg-red-500/15"
                    >
                      <Trash2 className="w-4 h-4" />
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
        <div className="bg-card rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between">
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
                      className={`px-3 py-1 rounded-xl text-sm font-medium transition-colors ${
                        page === pageNum
                          ? "bg-primary text-white"
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
          <div className="bg-card rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Top Reviewed Designs
            </h2>
            <div className="space-y-3">
              {analytics.topReviewedDesigns
                .slice(0, 5)
                .map((design: any, index: number) => (
                  <div
                    key={design._id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {design.designTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {design.reviewCount} reviews • {design.averageRating}{" "}
                          avg rating
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(design.averageRating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
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


