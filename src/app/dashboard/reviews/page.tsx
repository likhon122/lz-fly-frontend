/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import {
  useGetMyPurchasesQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetDesignReviewsQuery,
} from "@/services/api";
import { Star, Edit, Trash2, Plus, ArrowRight, ExternalLink, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ToastProvider";
import { useConfirm } from "@/components/ConfirmProvider";

function DesignReviewCard({
  design,
  currentUserId,
  onEditReview,
  onDeleteReview,
  onWriteReview,
}: {
  design: any;
  currentUserId: string;
  onEditReview: (review: any, designId: string) => void;
  onDeleteReview: (reviewId: string) => void;
  onWriteReview: (designId: string) => void;
}) {
  const { data: designReviewData } = useGetDesignReviewsQuery({
    designId: design._id,
    page: 1,
    limit: 100,
  });

  const statistics = designReviewData?.data?.statistics;
  const allReviews = designReviewData?.data?.reviews || [];
  const existingReview = allReviews.find(
    (r: any) => r.reviewer?._id === currentUserId || r.reviewer === currentUserId
  );

  const previewUrl =
    (design as any)?.previewImageUrls?.[0] || design.previewImageUrl;

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden hover:border-foreground/40 transition-colors">
      {/* Header with thumbnail & title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-border">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative w-16 h-16 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={design.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-bold">
                LZ
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Link href={`/designs/${design._id}`}>
              <h3 className="text-base font-bold text-foreground hover:underline truncate">
                {design.title}
              </h3>
            </Link>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span>
                ${(design.discountedPrice != null
                  ? design.discountedPrice
                  : design.basePrice ?? design.price ?? 0
                ).toFixed(2)}
              </span>
              {statistics && statistics.totalReviews > 0 && (
                <span>
                  • {statistics.averageRating?.toFixed(1)} ★ ({statistics.totalReviews} total)
                </span>
              )}
            </div>
          </div>
        </div>

        {existingReview ? (
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => onEditReview(existingReview, design._id)}
              className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
              title="Edit review"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDeleteReview(existingReview._id)}
              className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 dark:bg-red-950/30 dark:border-red-900/40 dark:text-red-400"
              title="Delete review"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        ) : (
          <Button
            onClick={() => onWriteReview(design._id)}
            className="bg-primary text-primary-foreground font-bold rounded-lg text-sm px-4 py-2 hover:bg-primary/90 transition-colors flex items-center gap-1.5 self-end sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Write Review</span>
          </Button>
        )}
      </div>

      {/* Your review display */}
      {existingReview && (
        <div className="p-6 bg-muted/20 border-b border-border">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex px-2.5 py-0.5 rounded text-xs font-semibold bg-primary text-primary-foreground uppercase tracking-wider">
                Your Feedback
              </span>
              <div className="flex items-center ml-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < existingReview.rating
                        ? "text-amber-500 fill-amber-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-foreground ml-1">
                {existingReview.rating}/5
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(existingReview.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            {existingReview.comment}
          </p>
        </div>
      )}
    </div>
  );
}

export default function MyReviewsPage() {
  const { data: purchasesData } = useGetMyPurchasesQuery({
    limit: 100,
    status: "completed",
  });

  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const toast = useToast();
  const confirmDialog = useConfirm();

  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [formData, setFormData] = useState({
    designId: "",
    rating: 5,
    comment: "",
  });

  const purchases = useMemo(() => purchasesData?.data || [], [purchasesData]);
  const currentUserId = purchases[0]?.user || "";

  const purchasedDesigns = useMemo(() => {
    const designs: any[] = [];
    const designIds = new Set<string>();

    purchases.forEach((p: any) => {
      if (
        p.purchaseType === "individual" &&
        p.design &&
        !designIds.has(p.design._id)
      ) {
        designs.push(p.design);
        designIds.add(p.design._id);
      }
    });

    return designs;
  }, [purchases]);

  const handleEditReview = (review: any, designId: string) => {
    setEditingReview(review);
    setFormData({
      designId: designId,
      rating: review.rating,
      comment: review.comment,
    });
    setShowModal(true);
  };

  const handleWriteReview = (designId: string) => {
    setFormData({
      designId: designId,
      rating: 5,
      comment: "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters long");
      return;
    }

    try {
      if (editingReview) {
        await updateReview({ id: editingReview._id, ...formData }).unwrap();
        toast.success("Review updated successfully");
      } else {
        await createReview(formData).unwrap();
        toast.success("Review published successfully");
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit review");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirmDialog.confirm(
      "Are you sure you want to delete this review?",
      { title: "Delete Review", confirmLabel: "Delete", cancelLabel: "Cancel" }
    );
    if (!ok) return;

    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete review");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReview(null);
    setFormData({
      designId: "",
      rating: 5,
      comment: "",
    });
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
          <span className="text-foreground">Reviews</span>
        </div>
      </nav>

      {/* Header Section (Matching Categories Style) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2.5">
            Feedback & Ratings
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            My Reviews
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
            Manage your feedback, review ratings, and testimonials for purchased assets.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/designs">
            <Button
              variant="outline"
              className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-4 py-2.5 transition-colors"
            >
              Browse Catalog
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-border">
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {purchasedDesigns.length}
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Purchased Designs
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-primary">
            Community
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Public Feedback
          </div>
        </div>
        <div className="border-r border-border/50 pr-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Verified
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Buyer Trust
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
            5 ★
          </div>
          <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
            Rating System
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-5">
        {purchasedDesigns.map((design: any) => (
          <DesignReviewCard
            key={design._id}
            design={design}
            currentUserId={currentUserId}
            onEditReview={handleEditReview}
            onDeleteReview={handleDelete}
            onWriteReview={handleWriteReview}
          />
        ))}

        {purchasedDesigns.length === 0 && (
          <div className="p-14 text-center rounded-xl border border-border bg-card">
            <MessageSquare className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
            <h3 className="text-base font-bold text-foreground">
              No purchased designs available for review
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Once you purchase individual creative assets, you can rate and review them here.
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
      </div>

      {/* Review Modal (0 Gradient, 0 Shadow, 0 Blur, Clean Border Dialog) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="border border-border bg-card rounded-xl max-w-md w-full p-7">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {editingReview ? "Edit Your Review" : "Write Asset Review"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          rating <= formData.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-foreground ml-2">
                    {formData.rating} out of 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Review Comment (minimum 10 characters)
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  minLength={10}
                  maxLength={1000}
                  className="w-full p-3.5 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Share details of your experience using this design asset..."
                />
                <div className="text-xs text-muted-foreground mt-1 text-right">
                  {formData.comment.length} / 1000
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="border-border text-foreground text-sm font-semibold px-4 py-2 hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground text-sm font-bold px-5 py-2 hover:bg-primary/90"
                >
                  {editingReview ? "Save Changes" : "Publish Review"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
