"use client";

import React, { useState, useEffect } from "react";
import { useGetDesignsQuery, useGetCategoriesQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/LikeButton";
import Link from "next/link";
import Image from "next/image";
import { Design } from "@/lib/allTypes";
import { useSearchParams } from "next/navigation";
import {
  Star,
  Filter,
  X as CloseIcon,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  Download,
  Heart,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

type ViewMode = "grid" | "list";

export default function DesignsPage() {
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedComplexities, setSelectedComplexities] = useState<string[]>(
    () => {
      const param = searchParams.get("complexityLevel");
      return param ? param.split(",") : [];
    },
  );
  const [minPrice, setMinPrice] = useState<number>(
    Number(searchParams.get("minPrice")) || 0,
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    Number(searchParams.get("maxPrice")) || 1000,
  );
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page")) || 1,
  );
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 12;
  const { data: categoriesData } = useGetCategoriesQuery();

  // Normalize categories and subcategories
  const rawCategories = categoriesData?.data || [];
  const categories = (rawCategories as any[]).map((c: any) => ({
    id: c.id ?? c._id,
    name: c.name,
    subcategories: (c.subcategories || []).map((sc: any) => ({
      id: sc.id ?? sc._id,
      name: sc.name,
    })),
  }));

  const mainCategory = selectedCategory || undefined;
  const subCategory = selectedSubcategory || undefined;
  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    ...(searchQuery && { search: searchQuery }),
    ...(mainCategory && { mainCategory }),
    ...(subCategory && { subCategory }),
    ...(selectedComplexities.length > 0 && {
      complexityLevel: selectedComplexities.join(","),
    }),
    ...(minPrice > 0 && { minPrice }),
    ...(maxPrice < 1000 && { maxPrice }),
    status: "Active",
  };

  const { data: designsResponse, isLoading: designsLoading } =
    useGetDesignsQuery(queryParams);

  const designs: Design[] = designsResponse?.data || [];
  const pagination = designsResponse?.pagination || {};

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (mainCategory) params.set("mainCategory", mainCategory);
    if (subCategory) params.set("subCategory", subCategory);
    if (selectedComplexities.length > 0)
      params.set("complexityLevel", selectedComplexities.join(","));
    if (minPrice > 0) params.set("minPrice", minPrice.toString());
    if (maxPrice < 1000) params.set("maxPrice", maxPrice.toString());
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    window.history.replaceState({}, "", newUrl);
  }, [
    searchQuery,
    mainCategory,
    subCategory,
    selectedCategory,
    selectedComplexities,
    minPrice,
    maxPrice,
    currentPage,
  ]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedComplexities([]);
    setMinPrice(0);
    setMaxPrice(1000);
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    searchQuery !== "",
    !!selectedCategory,
    !!selectedSubcategory,
    selectedComplexities.length > 0,
    minPrice > 0,
    maxPrice < 1000,
  ].filter(Boolean).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory("");
    setCurrentPage(1);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    const parentCategory = categories.find((cat) =>
      cat.subcategories.some((sub: any) => sub.id === subcategoryId),
    );
    if (parentCategory) {
      setSelectedCategory(parentCategory.id);
    }
    setSelectedSubcategory(subcategoryId);
    setCurrentPage(1);
  };

  const handleComplexityToggle = (complexity: string) => {
    setSelectedComplexities((prev) =>
      prev.includes(complexity)
        ? prev.filter((c) => c !== complexity)
        : [...prev, complexity],
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm font-semibold">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-foreground">Designs</span>
          </div>
        </nav>

        {/* Page Header Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
              Asset Catalog
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Design Catalog
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Explore production-ready UI kits, mobile systems, wireframes, and
              curated design templates crafted by verified creators.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/categories">
              <Button
                variant="outline"
                className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-5 py-2.5 transition-colors"
              >
                Browse Categories
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Minimalist Metrics Strip (0 gradients, 0 box shadow, 0 blur) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-b border-border">
          <div className="border-r border-border/50 pr-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
              {pagination.totalItems || 0}
            </div>
            <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
              Available Designs
            </div>
          </div>
          <div className="border-r border-border/50 pr-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary">
              {categories.length}
            </div>
            <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
              Disciplines
            </div>
          </div>
          <div className="border-r border-border/50 pr-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
              {activeFiltersCount}
            </div>
            <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
              Active Filters
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
              100%
            </div>
            <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
              Commercial License
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Mobile Toggle, and View Mode */}
        <div className="py-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search designs by title, designer, or tags..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-sm sm:text-base bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 justify-between sm:justify-end">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-4 py-2 flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>

            {/* View Mode Switcher */}
            <div className="flex items-center border border-border rounded-lg p-1 bg-card">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded text-sm font-semibold transition-colors ${
                  viewMode === "grid"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded text-sm font-semibold transition-colors ${
                  viewMode === "list"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="List view"
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-80 shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-foreground" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Filters
                  </h2>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-primary hover:underline font-bold"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* Category & Subcategory Filter */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Category
                </div>
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="mainCategory"
                      checked={!selectedCategory}
                      onChange={() => {
                        setSelectedCategory("");
                        setSelectedSubcategory("");
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-primary border-border focus:ring-0"
                    />
                    <span
                      className={
                        !selectedCategory
                          ? "text-primary font-bold"
                          : "text-foreground"
                      }
                    >
                      All Categories
                    </span>
                  </label>
                  {categories.map((cat) => (
                    <div key={cat.id} className="space-y-2">
                      <label className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="mainCategory"
                          checked={selectedCategory === cat.id}
                          onChange={() => handleCategorySelect(cat.id)}
                          className="w-4 h-4 text-primary border-border focus:ring-0"
                        />
                        <span
                          className={
                            selectedCategory === cat.id
                              ? "text-primary font-bold"
                              : "text-foreground"
                          }
                        >
                          {cat.name}
                        </span>
                      </label>
                      {cat.subcategories.length > 0 &&
                        selectedCategory === cat.id && (
                          <div className="ml-6 space-y-1.5 border-l-2 border-border pl-3 py-1">
                            {cat.subcategories.map((subcat: any) => (
                              <label
                                key={subcat.id}
                                className="flex items-center gap-2 text-xs font-medium cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name="subCategory"
                                  checked={selectedSubcategory === subcat.id}
                                  onChange={() =>
                                    handleSubcategorySelect(subcat.id)
                                  }
                                  className="w-3.5 h-3.5 text-primary border-border focus:ring-0"
                                />
                                <span
                                  className={
                                    selectedSubcategory === subcat.id
                                      ? "text-primary font-bold"
                                      : "text-muted-foreground hover:text-foreground"
                                  }
                                >
                                  {subcat.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Complexity Level Filter */}
              <div className="pt-4 border-t border-border">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Complexity
                </div>
                <div className="space-y-2.5">
                  {["Basic", "Intermediate", "Advanced"].map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedComplexities.includes(level)}
                        onChange={() => handleComplexityToggle(level)}
                        className="w-4 h-4 rounded text-primary border-border focus:ring-0"
                      />
                      <span className="text-foreground">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  <span>Price Range</span>
                  <span className="text-foreground font-semibold">
                    ${minPrice} - ${maxPrice}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-medium">
                      Min ($)
                    </span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) =>
                        handlePriceChange(Number(e.target.value), maxPrice)
                      }
                      className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-medium">
                      Max ($)
                    </span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) =>
                        handlePriceChange(minPrice, Number(e.target.value))
                      }
                      className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>

              {/* Active Filters Summary */}
              {activeFiltersCount > 0 && (
                <div className="pt-4 border-t border-border">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                    Active Filters
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-muted/40 text-xs font-semibold text-foreground">
                        Search: {searchQuery}
                        <button
                          onClick={() => setSearchQuery("")}
                          className="hover:text-primary"
                        >
                          <CloseIcon className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    )}
                    {selectedCategory && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-muted/40 text-xs font-semibold text-foreground">
                        {categories.find((c) => c.id === selectedCategory)
                          ?.name || "Category"}
                        <button
                          onClick={() => setSelectedCategory("")}
                          className="hover:text-primary"
                        >
                          <CloseIcon className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    )}
                    {selectedSubcategory && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-muted/40 text-xs font-semibold text-foreground">
                        Subcategory
                        <button
                          onClick={() => setSelectedSubcategory("")}
                          className="hover:text-primary"
                        >
                          <CloseIcon className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    )}
                    {selectedComplexities.map((level) => (
                      <span
                        key={level}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-muted/40 text-xs font-semibold text-foreground"
                      >
                        {level}
                        <button
                          onClick={() => handleComplexityToggle(level)}
                          className="hover:text-primary"
                        >
                          <CloseIcon className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Showing{" "}
                <span className="text-foreground font-bold">
                  {designs.length}
                </span>{" "}
                of{" "}
                <span className="text-foreground font-bold">
                  {pagination.totalItems || 0}
                </span>{" "}
                results
              </p>
            </div>

            {/* Loading State */}
            {designsLoading ? (
              <div className="border border-border rounded-xl bg-card p-16 text-center">
                <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-base font-bold text-foreground">
                  Loading designs...
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Fetching current production catalog.
                </p>
              </div>
            ) : designs.length > 0 ? (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {designs.map((design) => {
                      const preview =
                        (design as any)?.previewImageUrls?.[0] ||
                        (design as any)?.previewImageUrl ||
                        "";
                      const categoryObj =
                        (design as any)?.mainCategory ||
                        (design as any)?.category ||
                        (design as any)?.subCategory ||
                        null;
                      const discountedPrice = design.discountedPrice;
                      const basePrice = design.basePrice ?? 0;
                      const designerName =
                        (design as any)?.designer?.name ||
                        (design as any)?.designerName;

                      return (
                        <div
                          key={design._id!}
                          className="group border border-border rounded-xl bg-card overflow-hidden hover:border-foreground/40 transition-colors flex flex-col justify-between"
                        >
                          <div>
                            {/* Image Section */}
                            <div className="relative aspect-video bg-muted overflow-hidden border-b border-border">
                              {preview ? (
                                <Image
                                  src={preview}
                                  alt={design.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  className="object-cover transition-transform duration-300 group-hover:scale-102"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                  <span className="text-3xl font-bold text-muted-foreground/60">
                                    {design.title.charAt(0)}
                                  </span>
                                </div>
                              )}

                              {/* Price Pill */}
                              <div className="absolute top-3 right-3 z-10">
                                <span className="inline-flex items-center px-2.5 py-1 rounded border border-border bg-card/90 text-primary text-sm font-bold">
                                  {design.currencyDisplay}
                                  {typeof discountedPrice === "number" &&
                                  discountedPrice >= 0
                                    ? discountedPrice
                                    : basePrice}
                                </span>
                              </div>

                              {/* Category Pill */}
                              <div className="absolute top-3 left-3 z-10">
                                <span className="inline-flex items-center px-2.5 py-1 rounded border border-border bg-card/90 text-foreground text-xs font-semibold uppercase tracking-wider">
                                  {categoryObj?.name || "Design"}
                                </span>
                              </div>

                              {/* Like Button */}
                              <div className="absolute bottom-3 right-3 z-10">
                                <div className="p-1 rounded-lg border border-border bg-card/90">
                                  <LikeButton
                                    designId={design._id!}
                                    initialLikesCount={design.likesCount}
                                    variant="icon"
                                    size="sm"
                                    showCount={false}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Details Section */}
                            <div className="p-5">
                              <Link
                                href={`/designs/${design._id!}`}
                                className="block"
                              >
                                <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                  {design.title}
                                </h3>
                              </Link>

                              {designerName && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  by {designerName}
                                </p>
                              )}

                              {/* Ratings and Stats */}
                              <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-3 border-t border-border/50">
                                <div className="flex items-center gap-1.5 text-foreground font-semibold">
                                  <Star className="w-4 h-4 text-primary fill-primary" />
                                  <span>
                                    {(() => {
                                      const avg =
                                        (design as any)?.avgRating ??
                                        (design as any)?.statistics
                                          ?.averageRating ??
                                        0;
                                      return avg && avg > 0
                                        ? avg.toFixed(1)
                                        : "5.0";
                                    })()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3.5 text-xs font-medium">
                                  <span className="flex items-center gap-1">
                                    <Heart className="w-3.5 h-3.5 text-muted-foreground" />
                                    {design.likesCount || 0}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Download className="w-3.5 h-3.5 text-muted-foreground" />
                                    {design.downloadCount || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="px-5 pb-5">
                            <Link
                              href={`/designs/${design._id!}`}
                              className="block"
                            >
                              <Button
                                variant="outline"
                                className="w-full border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm py-2.5 transition-colors"
                              >
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-4">
                    {designs.map((design) => {
                      const preview =
                        (design as any)?.previewImageUrls?.[0] ||
                        (design as any)?.previewImageUrl ||
                        "";
                      const categoryObj =
                        (design as any)?.mainCategory ||
                        (design as any)?.category ||
                        (design as any)?.subCategory ||
                        null;
                      const designerName =
                        (design as any)?.designer?.name ||
                        (design as any)?.designerName;
                      const discountedPrice = design.discountedPrice;
                      const basePrice = design.basePrice ?? 0;

                      return (
                        <div
                          key={design._id!}
                          className="group border border-border rounded-xl bg-card p-5 hover:border-foreground/40 transition-colors flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                        >
                          <div className="flex gap-5 items-center min-w-0">
                            <div className="relative w-32 h-24 rounded-lg bg-muted shrink-0 overflow-hidden border border-border">
                              {preview ? (
                                <Image
                                  src={preview}
                                  alt={design.title}
                                  fill
                                  sizes="128px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-2xl font-bold text-muted-foreground/50">
                                    {design.title.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="inline-flex px-2 py-0.5 rounded border border-border bg-muted/40 text-xs font-semibold text-foreground uppercase tracking-wider">
                                  {categoryObj?.name || "Design"}
                                </span>
                                {design.complexityLevel && (
                                  <span className="text-xs font-semibold text-muted-foreground">
                                    • {design.complexityLevel}
                                  </span>
                                )}
                              </div>
                              <Link href={`/designs/${design._id!}`}>
                                <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                  {design.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground mt-1">
                                {designerName ? `by ${designerName} • ` : ""}
                                {design.likesCount || 0} likes •{" "}
                                {design.downloadCount || 0} downloads
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-5 self-end sm:self-center shrink-0">
                            <div className="text-right">
                              <span className="text-lg font-bold text-primary">
                                {design.currencyDisplay}
                                {typeof discountedPrice === "number" &&
                                discountedPrice >= 0
                                  ? discountedPrice
                                  : basePrice}
                              </span>
                              {typeof basePrice === "number" &&
                                basePrice > 0 &&
                                typeof discountedPrice === "number" &&
                                discountedPrice >= 0 &&
                                discountedPrice < basePrice && (
                                  <span className="block text-xs text-muted-foreground line-through">
                                    {design.currencyDisplay}
                                    {basePrice}
                                  </span>
                                )}
                            </div>

                            <Link href={`/designs/${design._id!}`}>
                              <Button
                                variant="outline"
                                className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-5 py-2.5 transition-colors"
                              >
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Minimalist Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground font-medium">
                      Page <span className="text-foreground font-bold">{currentPage}</span> of{" "}
                      <span className="text-foreground font-bold">{pagination.totalPages}</span>
                    </p>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm h-9 px-3.5 transition-colors disabled:opacity-40"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>

                      {Array.from(
                        { length: Math.min(pagination.totalPages, 5) },
                        (_, i) => {
                          let pageNum = i + 1;
                          if (pagination.totalPages > 5) {
                            if (currentPage > 3 && currentPage < pagination.totalPages - 1) {
                              pageNum = currentPage - 2 + i;
                            } else if (currentPage >= pagination.totalPages - 1) {
                              pageNum = pagination.totalPages - 4 + i;
                            }
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors border ${
                                currentPage === pageNum
                                  ? "bg-primary text-secondary border-primary"
                                  : "bg-card text-foreground border-border hover:border-foreground/40"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === pagination.totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm h-9 px-3.5 transition-colors disabled:opacity-40"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="border border-border rounded-xl bg-card p-14 text-center">
                <div className="w-14 h-14 rounded-lg border border-border bg-muted/40 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  No designs match your criteria
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                  Try clearing some filters or searching for broader terms to find what you need.
                </p>
                {activeFiltersCount > 0 && (
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="mt-5 border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-5 py-2.5 transition-colors"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
