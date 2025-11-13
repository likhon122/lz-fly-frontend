"use client";

import React, { useState } from "react";
import { useGetDesignsQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/LikeButton";
import Link from "next/link";
import Image from "next/image";
import { Design } from "@/lib/allTypes";
import { Download, Eye, ArrowRight, Star, Heart } from "lucide-react";

const FeaturedDesigns: React.FC = () => {
  const {
    data: designsData,
    isLoading,
    error
  } = useGetDesignsQuery({ limit: 8, status: "Active" });
  const designs: Design[] = designsData?.data || [];
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
    {}
  );

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Designs
            </h2>
            <p className="text-gray-600">Handpicked by our team</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse overflow-hidden"
            >
              <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300"></div>
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || designs.length === 0) {
    return (
      <section className="mb-16">
        <div className="text-center bg-gray-50 rounded-xl p-12 border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Designs Available
          </h3>
          <p className="text-gray-600 mb-6">
            Check back soon for amazing designs!
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/designs">Browse All Designs</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-black text-primary uppercase tracking-wider">
              Featured Collection
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-3">
            Trending <span className="gradient-text">Designs</span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Handpicked premium designs from top creators
          </p>
        </div>
        <Link href="/designs">
          <Button
            variant="outline"
            className="border-2 border-border hover:border-primary hover:bg-primary/5 rounded-xl font-black group"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {designs.slice(0, 6).map((design, index) => (
          <Link
            href={`/designs/${design._id}`}
            key={design._id}
            className="group relative block animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Main Card */}
            <div className="relative bg-card rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10">
              {/* Animated Glowing Border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 animate-pulse" />

              {/* Content Wrapper */}
              <div className="relative bg-card rounded-3xl overflow-hidden">
                {/* Image Section */}
                <div className="relative h-80 overflow-hidden">
                  {design.previewImageUrls && design.previewImageUrls[0] ? (
                    <Image
                      src={design.previewImageUrls[0]}
                      alt={design.title}
                      fill
                      className={`object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2 ${
                        loadedImages[design._id!] ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() =>
                        setLoadedImages((prev) => ({
                          ...prev,
                          [design._id!]: true
                        }))
                      }
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-primary"
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
                    </div>
                  )}

                  {/* Dark Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700" />

                  {/* Floating Price Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-primary/40 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      <div className="relative bg-card/95 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl border border-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <span className="text-2xl font-black text-primary">
                          {design.currencyDisplay}
                          {typeof design.discountedPrice === "number" &&
                          design.discountedPrice >= 0
                            ? design.discountedPrice
                            : design.basePrice ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Category Badge - Slides in from Left */}
                  <div className="absolute top-4 left-4 z-20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500">
                    <span className="bg-card/95 backdrop-blur-xl text-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-lg border border-border/50">
                      {design.mainCategory?.name ||
                        design.subCategory?.name ||
                        "Design"}
                    </span>
                  </div>
                </div>

                {/* Info Section - Slides Up */}
                <div className="relative p-6 transform translate-y-0 group-hover:-translate-y-2 transition-all duration-500">
                  <h3 className="text-2xl font-black text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                    {design.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Rating */}
                      <div className="flex items-center gap-1.5">
                        <Star className="w-5 h-5 text-primary fill-primary" />
                        <span className="text-lg font-black text-foreground">
                          {(design as any).avgRating &&
                          (design as any).avgRating > 0
                            ? (design as any).avgRating.toFixed(1)
                            : "5.0"}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm font-bold">
                            {design.likesCount || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span className="text-sm font-bold">
                            {design.downloadCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* View Button - Appears on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:shadow-primary/50 hover:scale-110 transition-all">
                        <Eye className="w-5 h-5 text-secondary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      {designs.length > 6 && (
        <div className="text-center mt-12">
          <Link href="/designs">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-secondary font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all px-12 py-7 text-lg"
            >
              View All {designs.length} Designs
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedDesigns;
