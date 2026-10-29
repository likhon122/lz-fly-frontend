"use client";

import React, { useState } from "react";
import { useGetDesignLikersQuery, useGetDesignQuery } from "@/services/api";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Heart,
  Loader2,
  User,
  Mail,
  Calendar,
  Shield,
  ArrowLeft,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DesignLiker {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

export default function DesignLikersPage() {
  const params = useParams();
  const designId = params.id as string;
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: designData, isLoading: designLoading } =
    useGetDesignQuery(designId);
  const { data, isLoading, error } = useGetDesignLikersQuery({
    designId,
    page,
    limit,
  });

  const likers = data?.data || [];
  const pagination = data?.pagination;
  const design = designData?.data;

  if (designLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading design likers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center p-8 bg-card rounded-xl border border-border max-w-md w-full">
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 text-destructive">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">
            Error Loading Likers
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Failed to load design likers. You may not have permission to view
            this information.
          </p>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="rounded-lg border-border"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Back Button */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin
            </Link>
            <span>/</span>
            <Link
              href="/admin/designs"
              className="hover:text-primary transition-colors"
            >
              Designs
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">Likers</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Design Likers
          </h1>
        </div>

        <Link href="/admin/designs">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-lg border-border text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Designs
          </Button>
        </Link>
      </div>

      {/* Header with Design Info */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid md:grid-cols-3 gap-6 p-5 sm:p-6">
          {/* Design Preview */}
          <div className="md:col-span-1">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted/40 border border-border">
              {design?.previewImageUrls && design.previewImageUrls.length > 0 ? (
                <Image
                  src={design.previewImageUrls[0]}
                  alt={design.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
          </div>

          {/* Design Info */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {design?.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {design?.description}
                  </p>
                </div>
                <Link
                  href={`/designs/${designId}`}
                  className="text-primary hover:underline text-xs font-semibold whitespace-nowrap"
                >
                  View Details →
                </Link>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md font-semibold border border-primary/20">
                  {design?.mainCategory?.name || "Uncategorized"}
                  {design?.subCategory && ` > ${design.subCategory.name}`}
                </span>
                <span className="text-base font-bold text-foreground">
                  {design?.currencyDisplay}
                  {design?.discountedPrice &&
                  design.discountedPrice < design.basePrice
                    ? design.discountedPrice
                    : design.basePrice}
                </span>
                {design?.discountedPrice &&
                  design.discountedPrice < design.basePrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {design?.currencyDisplay} {design?.basePrice}
                    </span>
                  )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-muted/30 rounded-xl p-3.5 border border-border">
                <div className="flex items-center gap-1.5 mb-1">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Likes
                  </span>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {design?.likesCount || 0}
                </p>
              </div>

              <div className="bg-muted/30 rounded-xl p-3.5 border border-border">
                <div className="flex items-center gap-1.5 mb-1">
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Downloads
                  </span>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {design?.downloadCount || 0}
                </p>
              </div>

              <div className="bg-muted/30 rounded-xl p-3.5 border border-border">
                <div className="flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Unique Likers
                  </span>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {pagination?.totalItems || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Likers List Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          Users Who Liked ({pagination?.totalItems || 0})
        </h2>
      </div>

      {/* Content */}
      {likers.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-foreground mb-1">
            No Likes Yet
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            This design hasn&apos;t received any likes yet.
          </p>
        </div>
      ) : (
        <>
          {/* Likers Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Liked On
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {likers.map((liker: DesignLiker) => (
                    <tr
                      key={liker.user._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                            {liker.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {liker.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              ID: {liker.user._id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground/60" />
                          <span>{liker.user.email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                            liker.user.role === "admin"
                              ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                              : "bg-primary/10 text-primary border border-primary/20"
                          }`}
                        >
                          {liker.user.role === "admin" && (
                            <Shield className="w-3 h-3" />
                          )}
                          <span className="capitalize">{liker.user.role}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                          <span>
                            {new Date(liker.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
                className="px-3.5 py-1.5 rounded-lg border-border text-xs font-semibold"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                      page === i + 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:bg-muted border border-border"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                variant="outline"
                className="px-3.5 py-1.5 rounded-lg border-border text-xs font-semibold"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
