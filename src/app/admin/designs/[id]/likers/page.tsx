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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading design likers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center py-20 bg-card rounded-2xl shadow-sm border border-border">
          <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive text-secondary">
            <svg
              className="w-12 h-12"
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
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Error Loading Likers
          </h2>
          <p className="text-muted-foreground mb-6">
            Failed to load design likers. You may not have permission to view
            this information.
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/designs">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Designs
            </Button>
          </Link>
          <div className="h-6 w-px bg-border"></div>
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin" className="hover:text-primary">
              Admin
            </Link>
            <span>/</span>
            <Link href="/admin/designs" className="hover:text-primary">
              Designs
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Likers</span>
          </nav>
        </div>
      </div>

      {/* Header with Design Info */}
      <div>
        <div className="relative bg-card/95 dark:bg-[#141414]/95 rounded-3xl shadow-2xl dark:shadow-primary/20 border border-border/80 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-gradient-to-br from-primary/10 via-transparent to-primary/20 blur-3xl" />
          <div className="relative grid md:grid-cols-3 gap-6 p-6">
            {/* Design Preview */}
            <div className="md:col-span-1">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-transparent dark:from-[#1e1e1e] dark:via-[#141414] dark:to-[#0a0a0a]">
                {design?.previewImageUrls &&
                design.previewImageUrls.length > 0 ? (
                  <Image
                    src={design.previewImageUrls[0]}
                    alt={design.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-muted-foreground/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Design Info */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-black text-foreground mb-2">
                      {design?.title}
                    </h1>
                    <p className="text-muted-foreground line-clamp-2">
                      {design?.description}
                    </p>
                  </div>
                  <Link
                    href={`/designs/${designId}`}
                    className="text-primary hover:text-primary/80 font-semibold text-sm"
                  >
                    View Design →
                  </Link>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold border border-primary/20">
                    {design?.mainCategory?.name || "Uncategorized"}
                    {design?.subCategory && ` > ${design.subCategory.name}`}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      <span className="text-xl font-bold">
                        {design?.currencyDisplay}
                      </span>
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
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-500/20 dark:via-[#141414] dark:to-[#0a0a0a] rounded-2xl p-4 border border-rose-500/30 shadow-lg dark:shadow-rose-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span className="text-xs font-medium text-red-500">
                      Total Likes
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {design?.likesCount || 0}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-[#141414] dark:to-[#0a0a0a] rounded-2xl p-4 border border-primary/30 shadow-lg dark:shadow-primary/10">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                    <span className="text-xs font-medium text-primary">
                      Downloads
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {design?.downloadCount || 0}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent dark:from-violet-500/20 dark:via-[#141414] dark:to-[#0a0a0a] rounded-2xl p-4 border border-violet-500/30 shadow-lg dark:shadow-violet-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-medium text-purple-500">
                      Unique Likers
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {pagination?.totalItems || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Likers Section */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground">
              Users Who Liked This Design
            </h2>
            <p className="text-muted-foreground mt-1">
              {pagination?.totalItems || 0} total{" "}
              {pagination?.totalItems === 1 ? "user" : "users"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {likers.length === 0 ? (
        <div className="text-center py-20 bg-card/95 dark:bg-[#141414]/95 rounded-3xl shadow-2xl border border-border/70">
          <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent dark:from-primary/20 dark:via-[#141414] dark:to-[#0a0a0a]">
            <Heart className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">
            No Likes Yet
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            This design hasn&apos;t received any likes yet. Be the first to like
            it!
          </p>
        </div>
      ) : (
        <>
          {/* Likers List */}
          <div className="bg-card/95 dark:bg-[#141414]/95 rounded-3xl shadow-2xl border border-border/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/80 dark:bg-[#141414]/80 border-b border-border/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Liked On
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {likers.map((liker: DesignLiker, index: number) => (
                    <tr
                      key={liker.user._id}
                      className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              index % 5 === 0
                                ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                : index % 5 === 1
                                ? "bg-gradient-to-br from-purple-500 to-purple-600"
                                : index % 5 === 2
                                ? "bg-gradient-to-br from-green-500 to-green-600"
                                : index % 5 === 3
                                ? "bg-gradient-to-br from-orange-500 to-orange-600"
                                : "bg-gradient-to-br from-pink-500 to-pink-600"
                            }`}
                          >
                            {liker.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {liker.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {liker.user._id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4 text-muted-foreground/60" />
                          {liker.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            liker.user.role === "admin"
                              ? "bg-violet-500/10 text-violet-400 border border-violet-500/30"
                              : "bg-primary/10 text-primary border border-primary/20"
                          }`}
                        >
                          {liker.user.role === "admin" && (
                            <Shield className="w-3 h-3" />
                          )}
                          {liker.user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 text-muted-foreground/60" />
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
            <div className="mt-8 flex justify-center items-center gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
                className="px-4 py-2 rounded-xl"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                      page === i + 1
                        ? "bg-gradient-to-r from-primary to-primary/60 text-primary-foreground shadow-lg dark:shadow-primary/20"
                        : "bg-card/90 text-muted-foreground hover:bg-primary/10 border border-border/80"
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
                className="px-4 py-2 rounded-xl"
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
