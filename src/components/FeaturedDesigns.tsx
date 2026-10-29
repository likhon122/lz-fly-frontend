"use client";

import React, { useState } from "react";
import { useGetDesignsQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Design } from "@/lib/allTypes";
import { Download, Eye, ArrowRight, Star, Heart } from "lucide-react";

export const FeaturedDesigns: React.FC = () => {
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
            <div className="h-6 w-32 bg-muted rounded-full animate-pulse mb-3" />
            <div className="h-9 w-64 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <div className="h-72 bg-muted/60 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-muted/80 rounded-md w-3/4 animate-pulse" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-muted/60 rounded-md w-24 animate-pulse" />
                  <div className="h-5 bg-muted/60 rounded-md w-16 animate-pulse" />
                </div>
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
        <div className="text-center bg-card rounded-xl p-12 border border-border">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
            <Star className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            No Designs Available Yet
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
            Check back soon for freshly curated templates and design assets.
          </p>
          <Button className="bg-primary text-primary-foreground font-bold rounded-lg" asChild>
            <Link href="/designs">Browse All Designs</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted/40 border border-border rounded text-xs font-bold text-foreground uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span>Curated Collection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Featured Assets
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-medium mt-1.5">
            Production-grade design templates loved by creative teams and studios
          </p>
        </div>
        <Link href="/designs">
          <Button
            variant="outline"
            className="border-border hover:border-foreground/40 bg-card text-foreground font-bold rounded-lg text-sm px-5 py-2.5 transition-colors group"
          >
            Explore Catalog
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.slice(0, 6).map((design) => (
          <Link
            href={`/designs/${design._id}`}
            key={design._id}
            className="group relative block"
          >
            {/* Main Card */}
            <div className="relative bg-card rounded-xl border border-border hover:border-foreground/40 transition-colors overflow-hidden flex flex-col">
              {/* Image Section */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-muted/40">
                {design.previewImageUrls && design.previewImageUrls[0] ? (
                  <Image
                    src={design.previewImageUrls[0]}
                    alt={design.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                      loadedImages[design._id!] ? "opacity-100" : "opacity-0"
                    } transition-opacity duration-300`}
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
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                    <div className="w-16 h-16 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
                      <Star className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                )}

                {/* Price Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-background text-foreground px-3 py-1.5 rounded-lg border border-border">
                    <span className="text-sm font-bold text-foreground">
                      {design.currencyDisplay}
                      {typeof design.discountedPrice === "number" &&
                      design.discountedPrice >= 0
                        ? design.discountedPrice
                        : design.basePrice ?? 0}
                    </span>
                  </div>
                </div>

                {/* Category Pill */}
                {(design.mainCategory?.name || design.subCategory?.name) && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-background text-foreground px-3 py-1 rounded-lg text-xs font-bold border border-border">
                      {design.mainCategory?.name || design.subCategory?.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-6">
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                  {design.title}
                </h3>

                <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    {/* Rating */}
                    <div className="flex items-center gap-1 font-bold text-foreground">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span>
                        {(design as any).avgRating &&
                        (design as any).avgRating > 0
                          ? (design as any).avgRating.toFixed(1)
                          : "5.0"}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      <span>{design.likesCount || 0}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      <span>{design.downloadCount || 0}</span>
                    </div>
                  </div>

                  <span className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View
                    <Eye className="w-3.5 h-3.5" />
                  </span>
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors px-10 py-5 text-sm sm:text-base"
            >
              Browse All {designs.length}+ Designs
              <ArrowRight className="w-4 h-4 ml-2.5" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedDesigns;
