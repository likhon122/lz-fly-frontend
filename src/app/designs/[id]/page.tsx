"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  useGetDesignQuery,
  useDownloadDesignMutation,
  useGetDesignReviewsQuery,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Design } from "@/lib/allTypes";
import PurchaseModal from "@/components/PurchaseModal";
import { useAppSelector } from "@/store/hooks";
import {
  ShoppingCart,
  Download,
  CheckCircle,
  Loader2,
  Star,
  Calendar,
  Package,
  Tag,
  FileText,
  Wrench,
  Sparkles,
  MessageSquare,
  User,
} from "lucide-react";
import { useDesignDownloadAccess } from "@/hooks/useDesignDownloadAccess";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/services/api";
import { Edit, Trash2 } from "lucide-react";
import { LikeButton } from "@/components/LikeButton";
import { useToast } from "@/components/ToastProvider";
import { useConfirm } from "@/components/ConfirmProvider";
import ImageLightbox from "@/components/ImageLightbox";

export default function DesignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const designId = params.id as string;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const {
    data: designData,
    isLoading,
    error,
    refetch: refetchDesign,
  } = useGetDesignQuery(designId);

  // Support both shapes: API sometimes returns { data: { ... } } or the design object directly
  const design: Design | undefined = ((designData as any)?.data ??
    designData) as any;

  // Helpers - backend sends new fields; align safely with current TS Design type
  const mainCategory = (design as any)?.mainCategory;
  const subCategory = (design as any)?.subCategory;

  // images from backend (support array or single URL)
  const previewImages: string[] = useMemo(() => {
    const urls = (design as any)?.previewImageUrls;
    if (Array.isArray(urls) && urls.length) return urls as string[];
    const single = (design as any)?.previewImageUrl;
    return single ? [single] : [];
  }, [design]);

  // ensure we reset gallery index when design changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [design?._id]);

  // current hero image for gallery
  const heroImage = previewImages[currentImageIndex] || "";

  // build a consistent category link for breadcrumb / badges (memoized)
  const categoryQueryLink = useMemo(() => {
    if (mainCategory?.id || mainCategory?._id)
      return `/designs?mainCategory=${mainCategory?.id ?? mainCategory?._id}`;
    if (subCategory?.id || subCategory?._id)
      return `/designs?subCategory=${subCategory?.id ?? subCategory?._id}`;
    return "/designs";
  }, [mainCategory, subCategory]);

  // Lightbox / fullscreen preview state
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const designerName =
    (design as any)?.designer?.name || (design as any)?.designerName || "";

  // Fetch reviews (with refetch so we can refresh after create/update/delete)
  const { data: reviewsData, refetch: refetchReviews } =
    useGetDesignReviewsQuery({
      designId,
      page: 1,
      limit: 100,
    });

  const statistics = reviewsData?.data?.statistics;
  const reviews = reviewsData?.data?.reviews || [];

  // Review mutations
  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  // Download mutation
  const [downloadDesign, { isLoading: isDownloading }] =
    useDownloadDesignMutation();

  const currentUserId = (user && user?._id) || "";

  // Detect existing review by current user for this design (support both _id and id)
  const existingReview = reviews.find(
    (r: any) =>
      r.reviewer?._id === currentUserId || r.reviewer?.id === currentUserId
  );

  // Local modal state for writing/editing review on design page
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(
    existingReview || null
  );
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  // Keep editingReview in sync when reviews load or current user changes
  useEffect(() => {
    const found = reviews.find(
      (r: any) =>
        r.reviewer?._id === currentUserId || r.reviewer?.id === currentUserId
    );
    setEditingReview(found || null);
    if (found) {
      setReviewForm({
        rating: found.rating || 5,
        comment: found.comment || "",
      });
    }
  }, [reviews, currentUserId]);

  const openWriteModal = () => {
    setEditingReview(existingReview || null);
    if (existingReview) {
      setReviewForm({
        rating: existingReview.rating || 5,
        comment: existingReview.comment || "",
      });
    } else {
      setReviewForm({ rating: 5, comment: "" });
    }
    setReviewModalOpen(true);
  };

  const toast = useToast();
  const confirmDialog = useConfirm();

  // Helper: format bytes into a human readable string (B / KB / MB / GB)
  const formatBytes = (bytes?: number, decimals = 2) => {
    const b = Number(bytes ?? 0);
    if (!b) return `0.00 B`;
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(b) / Math.log(1024));
    const val = b / Math.pow(1024, i);
    // reduce decimals as unit grows (keeps display tidy)
    return `${val.toFixed(Math.max(0, decimals - i))} ${units[i]}`;
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewForm.comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters long");
      return;
    }
    try {
      if (editingReview) {
        const reviewId = editingReview._id || editingReview.id;
        await updateReview({
          id: reviewId,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }).unwrap();
        toast.success("Review updated successfully");
      } else {
        await createReview({
          designId,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }).unwrap();
        toast.success("Review submitted successfully");
      }
      setReviewModalOpen(false);
      await refetchReviews();
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const handleDeleteReview = async (id: string) => {
    const ok = await confirmDialog.confirm(
      "Are you sure you want to delete this review?",
      {
        title: "Delete review",
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
      }
    );
    if (!ok) return;
    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted successfully");
      await refetchReviews();
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  // Check download access
  const {
    access,
    isLoading: accessLoading,
    refetch: refetchAccess,
  } = useDesignDownloadAccess(designId);

  const canReview =
    Boolean(user) &&
    (access?.canDownload ||
      access?.status === "completed" ||
      access?.reason === "subscription");

  const handlePurchaseClick = useCallback(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    setPurchaseModalOpen(true);
  }, [user, router]);

  const handlePaymentSuccess = useCallback(() => {
    // Refetch design data to update purchase status
    refetchDesign();
    // Refetch access status
    refetchAccess();
  }, [refetchDesign, refetchAccess]);

  const handleDownload = useCallback(async () => {
    try {
      // Use RTK Query mutation for download - it returns blob directly
      const blob = await downloadDesign(designId).unwrap();

      // Extract filename from the blob response (we'll need to get headers differently)
      // For now, create a default filename
      const filename = `design-${designId}.zip`;

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Download completed successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Download failed. Please try again.";
      toast.error(errorMessage);
    }
  }, [designId, downloadDesign, toast]);

  const purchaseDesign = useMemo(() => {
    return {
      _id: design?._id!,
      title: design?.title,
      description: design?.description,
      price: design?.discountedPrice as number,
      basePrice: design?.basePrice as number,
      discountedPrice: design?.discountedPrice,
      currencyDisplay: (design as any)?.currencyDisplay,
      currencyCode: (design as any)?.currencyCode,
      previewImageUrl: previewImages[0] || "",
      category: mainCategory || subCategory || null,
    };
  }, [
    design?._id,
    design?.title,
    design?.description,
    design?.discountedPrice,
    design?.basePrice,
    previewImages,
    mainCategory,
    subCategory,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-muted rounded-3xl"></div>
                <div className="h-48 bg-muted rounded-3xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-80 bg-muted rounded-3xl"></div>
                <div className="h-40 bg-muted rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !design) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-xl px-6">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Package className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-foreground mb-4">
            Design Not Found
          </h1>
          <p className="text-muted-foreground mb-8 text-lg font-medium">
            The design you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/designs">
            <Button className="bg-primary hover:bg-primary/90 text-secondary font-black rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all px-8 py-6 text-lg">
              Back to Designs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-3 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors font-bold"
            >
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href="/designs"
              className="text-muted-foreground hover:text-primary transition-colors font-bold"
            >
              Designs
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href={categoryQueryLink}
              className="text-muted-foreground hover:text-primary transition-colors font-bold"
            >
              {mainCategory?.name || subCategory?.name || "Category"}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-black truncate max-w-xs">
              {design.title}
            </span>
          </div>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image */}
            <div className="bg-card rounded-3xl border-2 border-border overflow-hidden group relative shadow-2xl">
              {/* Glowing Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
              
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {heroImage ? (
                  <>
                    <Image
                      src={heroImage}
                      alt={`${design.title} preview ${currentImageIndex + 1}`}
                      fill
                      priority={true}
                      className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                        imageLoaded
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />

                    {/* Prev / Next controls */}
                    {previewImages.length > 1 && (
                      <>
                        <button
                          aria-label="Previous image"
                          onClick={() =>
                            setCurrentImageIndex(
                              (i) =>
                                (i - 1 + previewImages.length) %
                                previewImages.length
                            )
                          }
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/95 backdrop-blur-xl rounded-full p-3 shadow-2xl border-2 border-border hover:border-primary hover:scale-110 transition-all duration-300 z-10"
                        >
                          <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          aria-label="Next image"
                          onClick={() =>
                            setCurrentImageIndex(
                              (i) => (i + 1) % previewImages.length
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/95 backdrop-blur-xl rounded-full p-3 shadow-2xl border-2 border-border hover:border-primary hover:scale-110 transition-all duration-300 z-10"
                        >
                          <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                    
                    {/* Fullscreen button */}
                    <button
                      aria-label="Open fullscreen"
                      onClick={() => setLightboxOpen(true)}
                      className="absolute top-4 right-4 bg-card/95 backdrop-blur-xl rounded-xl p-3 shadow-2xl border-2 border-border hover:border-primary hover:scale-110 transition-all duration-300 z-10"
                    >
                      <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                    
                    {/* Image counter */}
                    {previewImages.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-xl px-4 py-2 rounded-xl text-sm font-black text-foreground shadow-2xl border-2 border-border">
                        {currentImageIndex + 1} / {previewImages.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Package className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                )}

                {/* Floating Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-4 py-2 rounded-xl text-sm font-black backdrop-blur-xl shadow-2xl border-2 transition-all duration-300 ${
                      design.status === "Active"
                        ? "bg-primary/95 text-secondary border-primary"
                        : "bg-destructive/95 text-white border-destructive"
                    }`}
                  >
                    {design.status}
                  </span>
                </div>

                {/* Like Button */}
                <div className="absolute top-4 right-4">
                  <LikeButton
                    designId={design._id!}
                    initialLikesCount={design.likesCount}
                    variant="icon"
                    size="lg"
                    showCount={false}
                    className="bg-card/95 backdrop-blur-xl hover:bg-primary/20 shadow-2xl border-2 border-border hover:border-primary hover:scale-110 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Image Thumbnails */}
              {previewImages.length > 1 && (
                <div className="flex items-center gap-3 mt-6 overflow-x-auto p-2">
                  {previewImages.map((src, idx) => (
                    <button
                      key={src + idx}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setImageLoaded(false);
                      }}
                      className={`group shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        idx === currentImageIndex
                          ? "ring-4 ring-primary/30 border-primary shadow-2xl scale-105"
                          : "border-border hover:border-primary/50 hover:scale-105"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`${design.title} thumb ${idx + 1}`}
                        width={160}
                        height={96}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Image Lightbox */}
              <ImageLightbox
                images={previewImages}
                isOpen={lightboxOpen}
                currentIndex={currentImageIndex}
                onClose={() => setLightboxOpen(false)}
                onIndexChange={setCurrentImageIndex}
                alt={design.title}
              />

              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-4 p-6 bg-card/50 backdrop-blur-sm border-t-2 border-border rounded-b-3xl">
                <div className="text-center group">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <LikeButton
                        designId={design._id!}
                        initialLikesCount={design.likesCount}
                        variant="compact"
                        size="sm"
                        showCount={false}
                      />
                    </div>
                  </div>
                  <p className="text-xl font-black text-foreground mb-1">{design.likesCount || 0}</p>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Likes</span>
                </div>
                <div className="text-center group">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Download className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xl font-black text-foreground mb-1">
                    {design.downloadCount || 0}
                  </p>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Downloads</span>
                </div>
                <div className="text-center group">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                  </div>
                  <p className="text-xl font-black text-foreground mb-1">
                    {statistics?.averageRating
                      ? statistics.averageRating.toFixed(1)
                      : "0.0"}
                  </p>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Rating</span>
                </div>
                <div className="text-center group">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xl font-black text-foreground mb-1">
                    {statistics?.totalReviews || 0}
                  </p>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reviews</span>
                </div>
              </div>
            </div>
            {/* Tools */}
            {design.usedTools && design.usedTools.length > 0 && (
              <div className="group bg-card rounded-3xl border-2 border-border p-8 shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Wrench className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground">Tools Used</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {design.usedTools.map((tool, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary text-sm px-4 py-2 rounded-xl font-black border-2 border-primary/20 hover:bg-primary hover:text-secondary hover:scale-105 transition-all duration-300 cursor-default"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Effects */}
            {design.effectsUsed && design.effectsUsed.length > 0 && (
              <div className="group bg-card rounded-3xl border-2 border-border p-8 shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground">Effects</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {design.effectsUsed.map((effect, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary text-sm px-4 py-2 rounded-xl font-black border-2 border-primary/20 hover:bg-primary hover:text-secondary hover:scale-105 transition-all duration-300 cursor-default"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Process */}
            {design.processDescription && (
              <div className="group bg-card rounded-3xl border-2 border-border p-8 md:col-span-2 shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground">Design Process</h3>
                </div>
                <p className="text-base text-foreground/80 leading-relaxed font-medium">
                  {design.processDescription}
                </p>
              </div>
            )}

            {/* Reviews Section */}
            <div
              id="reviews"
              className="bg-card rounded-3xl border-2 border-border p-8 shadow-2xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-black text-foreground">
                    Customer Reviews
                  </h2>
                </div>
                {statistics && statistics.totalReviews > 0 && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-xl border-2 border-primary/20">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 transition-all duration-300 ${
                            i < Math.round(statistics.averageRating)
                              ? "text-primary fill-primary"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xl font-black text-foreground">
                      {statistics.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm font-bold text-muted-foreground">
                      ({statistics.totalReviews}{" "}
                      {statistics.totalReviews === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}
                {canReview && (
                  <div>
                    <button
                      onClick={openWriteModal}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-secondary text-base font-black rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      {editingReview ? "Edit your review" : "Write a review"}
                    </button>
                  </div>
                )}
              </div>

              {/* Rating Distribution */}
              {statistics &&
                statistics.totalReviews > 0 &&
                statistics.ratingDistribution && (
                  <div className="mb-6">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count =
                          Number(statistics.ratingDistribution[0]?.[rating]) ||
                          0;

                        const percentage =
                          statistics.totalReviews > 0
                            ? (count / statistics.totalReviews) * 100
                            : 0;

                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-12">
                              <span className="text-sm font-medium text-gray-700">
                                {rating}
                              </span>
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-12 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Reviews List */}
              {reviewModalOpen && (
                <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium">Rating</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            rating: Number(e.target.value),
                          })
                        }
                        className="border border-gray-200 rounded px-2 py-1 text-sm"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} Star{r > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            comment: e.target.value,
                          })
                        }
                        placeholder="Write your review"
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-28"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-2 rounded"
                      >
                        {editingReview ? "Update Review" : "Submit Review"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewModalOpen(false)}
                        className="text-sm px-3 py-2 rounded border border-gray-200"
                      >
                        Cancel
                      </button>
                      {editingReview && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteReview(
                              editingReview._id || editingReview.id
                            )
                          }
                          className="text-sm px-3 py-2 rounded border border-red-200 text-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((review: any) => (
                    <div
                      key={review._id}
                      className="border-t border-gray-200 pt-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground">
                              {review.reviewer.name}
                            </span>
                            {(review.reviewer?._id === currentUserId ||
                              review.reviewer?.id === currentUserId) && (
                              <span className="ml-2 inline-flex items-center text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                You reviewed
                              </span>
                            )}
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.title && (
                            <h4 className="font-medium text-foreground text-sm mb-1">
                              {review.title}
                            </h4>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                          {review.reviewer?._id === currentUserId && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingReview(review);
                                  setReviewForm({
                                    rating: review.rating || 5,
                                    comment: review.comment || "",
                                  });
                                  setReviewModalOpen(true);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteReview(review._id || review.id)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                  {reviews.length > 5 && (
                    <button className="text-sm text-primary hover:text-primary/90 font-medium">
                      Show all {reviews.length} reviews
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No reviews yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Be the first to review this design
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="group bg-card rounded-3xl border-2 border-border p-8 sticky top-20 space-y-6 shadow-2xl hover:shadow-primary/20 transition-all duration-500">
              {/* Title & Category */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Link href={categoryQueryLink}>
                    <span className="bg-primary/95 hover:bg-primary text-secondary text-sm font-black px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
                      {mainCategory?.name || subCategory?.name || "Category"}
                    </span>
                  </Link>
                  {design.complexityLevel && (
                    <span className="bg-primary/10 text-primary text-sm font-black px-4 py-2 rounded-xl border-2 border-primary/20">
                      {design.complexityLevel}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-black text-foreground leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
                  {design.title}
                </h1>
                {designerName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <p className="text-base text-foreground/80 font-medium">
                      by{" "}
                      <span className="font-black text-primary">
                        {designerName}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* discounted price */}
              <div className="flex flex-col gap-3 py-6 border-y-2 border-border">
                <div className="flex items-baseline gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-primary drop-shadow-lg">
                      {design?.currencyDisplay}
                      {design?.discountedPrice?.toFixed(2) || 0}
                    </span>
                    <span className="text-lg font-bold text-muted-foreground">
                      {design.currencyCode}
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-muted-foreground/50 line-through">
                    {design?.currencyDisplay}
                    {design?.basePrice.toFixed(2) || 0}
                  </span>
                  <span className="text-sm font-black text-destructive bg-destructive/10 px-3 py-1 rounded-lg">
                    SAVE {Math.round(((design?.basePrice - (design?.discountedPrice || 0)) / design?.basePrice) * 100)}%
                  </span>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-4">
                {accessLoading ? (
                  <div className="w-full h-16 bg-primary/5 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/20">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : access.canDownload ||
                  access.status === "pending" ||
                  access.status === "completed" ? (
                  <>
                    <div className="p-5 bg-primary/10 border-2 border-primary/30 rounded-2xl backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-black text-foreground text-base mb-1">
                            {access.message}
                          </p>
                          <p className="text-sm text-foreground/70 font-medium">
                            {access.reason === "subscription" &&
                            access.status === "completed"
                              ? "Included with subscription access"
                              : access.reason === "subscription" &&
                                access.status === "pending"
                              ? "Your subscription is pending"
                              : access.reason === "purchased" &&
                                access.status === "pending"
                              ? "Your individual purchase is pending now when complete You can download the design"
                              : access.reason === "purchased" &&
                                access.status === "completed"
                              ? "You purchased this design. You own this design"
                              : " "}
                          </p>
                        </div>
                      </div>
                    </div>
                    {access.status === "completed" ? (
                      <Button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="w-full bg-primary hover:bg-primary/90 text-secondary text-base font-black h-14 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Preparing Download...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            Download Now
                          </>
                        )}
                      </Button>
                    ) : null}
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handlePurchaseClick}
                      className="w-full bg-primary hover:bg-primary/90 text-secondary text-base font-black h-14 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Purchase for {design?.currencyDisplay}
                      {design?.discountedPrice?.toFixed(2) || 0}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground font-medium">
                      or{" "}
                      <Link
                        href="/pricing"
                        className="text-primary font-black hover:underline"
                      >
                        subscribe
                      </Link>{" "}
                      for unlimited access
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-4 py-6 border-y-2 border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-black text-foreground mb-3">
                      Download details
                    </p>
                    {design?.downloadableFile ? (
                      <dl className="text-sm text-foreground/80 grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                          <dt className="w-24 font-bold text-muted-foreground">File name</dt>
                          <dd className="truncate font-medium">
                            {(design.downloadableFile as any).file_name || "—"}
                          </dd>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                          <dt className="w-24 font-bold text-muted-foreground">Format</dt>
                          <dd className="uppercase font-black text-primary">
                            {(design.downloadableFile as any).file_format ||
                              "—"}
                          </dd>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                          <dt className="w-24 font-bold text-muted-foreground">Size</dt>
                          <dd className="font-black text-foreground">
                            {formatBytes(
                              (design.downloadableFile as any).file_size
                            )}
                          </dd>
                        </div>
                      </dl>
                    ) : (
                      <p className="text-sm text-muted-foreground font-medium mt-2">
                        No downloadable file information available
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {design.tags && design.tags.length > 0 && (
                <div className="pt-6 border-t-2 border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-black text-foreground text-lg">
                      Tags
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {design.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary text-sm px-4 py-2 rounded-xl font-black border-2 border-primary/20 hover:bg-primary hover:text-secondary hover:scale-105 transition-all duration-300 cursor-default"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground text-sm">
                    Timeline
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium text-foreground">
                      {design?.createdAt
                        ? new Date(design.createdAt).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Updated</span>
                    <span className="font-medium text-foreground">
                      {design?.updatedAt
                        ? new Date(design.updatedAt).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500">
                  🔒 Secure checkout • Lifetime access
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Purchase Modal */}
        {design && (
          <PurchaseModal
            isOpen={purchaseModalOpen}
            onClose={() => setPurchaseModalOpen(false)}
            design={purchaseDesign}
            purchaseType="individual"
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
}
