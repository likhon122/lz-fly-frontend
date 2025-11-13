"use client";

import React, { useState, useEffect } from "react";
import { useGetDesignsQuery, useGetCategoriesQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/LikeButton";
import Link from "next/link";
import Image from "next/image";
import { Design } from "@/lib/allTypes";
import { useSearchParams } from "next/navigation";
import { Star, Filter, X as CloseIcon } from "lucide-react";

type ViewMode = "grid" | "list";

export default function DesignsPage() {
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  // Single-select for parent and subcategories
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  // Multi-select for complexity levels
  const [selectedComplexities, setSelectedComplexities] = useState<string[]>(
    () => {
      const param = searchParams.get("complexityLevel");
      return param ? param.split(",") : [];
    }
  );
  const [minPrice, setMinPrice] = useState<number>(
    Number(searchParams.get("minPrice")) || 0
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    Number(searchParams.get("maxPrice")) || 1000
  );
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page")) || 1
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
      name: sc.name
    }))
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
      complexityLevel: selectedComplexities.join(",")
    }),
    ...(minPrice > 0 && { minPrice }),
    ...(maxPrice < 1000 && { maxPrice }),
    status: "Active" // Only show active designs
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
    currentPage
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
    maxPrice < 1000
  ].filter(Boolean).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(""); // Reset subcategory when parent changes
    setCurrentPage(1);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    const parentCategory = categories.find((cat) =>
      cat.subcategories.some((sub: any) => sub.id === subcategoryId)
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
        : [...prev, complexity]
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header with Search */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-foreground mb-3">
                Discover <span className="gradient-text">Amazing Designs</span>
              </h1>

              <div className="flex w-full items-center justify-between mt-4">
                <nav>
                  <div className="flex items-center space-x-2 text-sm">
                    <Link
                      href="/"
                      className="text-muted-foreground hover:text-primary transition-colors font-bold"
                    >
                      Home
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-foreground font-black">Designs</span>
                  </div>
                </nav>
                <div className="bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-primary/20">
                  <p className="text-sm text-primary font-black">
                    {pagination.totalItems || 0} designs available
                  </p>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-card border-2 border-border rounded-xl p-1 shadow-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-primary text-secondary shadow-lg scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  title="Grid view"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 6v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-primary text-secondary shadow-lg scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  title="List view"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-5 py-3 bg-card border-2 border-border rounded-xl text-sm font-black text-foreground hover:bg-muted transition-all shadow-lg hover:scale-105"
              >
                <Filter className="w-5 h-5 inline mr-2" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg
                className="w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search designs by name, tag, or designer..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-14 pr-14 py-5 bg-card border-2 border-border rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all text-foreground placeholder-muted-foreground shadow-lg text-lg font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-80 shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-card rounded-3xl border-2 border-border p-8 sticky top-24 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-foreground">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary hover:text-primary/80 font-black transition-colors px-4 py-2 bg-primary/10 rounded-xl hover:bg-primary/20"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-8">
                {/* Category & Subcategory Filter */}
                <div>
                  <label className="block text-base font-black text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Category & Subcategory
                  </label>
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <div key={cat.id} className="mb-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="mainCategory"
                            checked={selectedCategory === cat.id}
                            onChange={() => handleCategorySelect(cat.id)}
                            className="w-5 h-5 text-primary border-2 border-border focus:ring-primary focus:ring-2"
                          />
                          <span className="font-black text-foreground group-hover:text-primary transition-colors">
                            {cat.name}
                          </span>
                        </label>
                        {cat.subcategories.length > 0 && (
                          <div className="ml-8 mt-3 space-y-2">
                            {cat.subcategories.map((subcat: any) => (
                              <label
                                key={subcat.id}
                                className="flex items-center gap-3 cursor-pointer group"
                              >
                                <input
                                  type="radio"
                                  name="subCategory"
                                  checked={selectedSubcategory === subcat.id}
                                  onChange={() =>
                                    handleSubcategorySelect(subcat.id)
                                  }
                                  className="w-4 h-4 text-primary border-2 border-border focus:ring-primary focus:ring-2"
                                />
                                <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
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
                <div>
                  <label className="block text-base font-black text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Complexity Level
                  </label>
                  <div className="space-y-2">
                    {["Basic", "Intermediate", "Advanced"].map((level) => (
                      <label
                        key={level}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedComplexities.includes(level)}
                          onChange={() => handleComplexityToggle(level)}
                          className="w-5 h-5 text-primary border-2 border-border rounded focus:ring-primary focus:ring-2"
                        />
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-base font-black text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Price Range
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground font-bold">
                      <span>
                        {designs && designs[0]?.currencyDisplay}
                        {minPrice}
                      </span>
                      <span>
                        {designs && designs[0]?.currencyDisplay}
                        {maxPrice}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) =>
                          handlePriceChange(Number(e.target.value), maxPrice)
                        }
                        className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm font-bold"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) =>
                          handlePriceChange(minPrice, Number(e.target.value))
                        }
                        className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm font-bold"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="pt-6 border-t-2 border-border">
                    <p className="text-sm font-black text-foreground mb-3">
                      Active Filters:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-xl text-xs font-black border border-primary/20">
                          Search
                          <button
                            onClick={() => setSearchQuery("")}
                            className="hover:text-primary/70"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      )}
                      {selectedCategory &&
                        (() => {
                          const cat = categories.find(
                            (c) => c.id === selectedCategory
                          );
                          return cat ? (
                            <span
                              key={cat.id}
                              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-xl text-xs font-black border border-primary/20"
                            >
                              {cat.name}
                              <button
                                onClick={() => setSelectedCategory("")}
                                className="hover:text-primary/70"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </span>
                          ) : null;
                        })()}
                      {selectedSubcategory &&
                        selectedCategory &&
                        (() => {
                          const cat = categories.find(
                            (c) => c.id === selectedCategory
                          );
                          const subcat = cat?.subcategories.find(
                            (sc: any) => sc.id === selectedSubcategory
                          );
                          return subcat ? (
                            <span
                              key={subcat.id}
                              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-xl text-xs font-black border border-primary/20"
                            >
                              {subcat.name}
                              <button
                                onClick={() => setSelectedSubcategory("")}
                                className="hover:text-primary/70"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </span>
                          ) : null;
                        })()}
                      {selectedComplexities.map((level) => (
                        <span
                          key={level}
                          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-xl text-xs font-black border border-primary/20"
                        >
                          {level}
                          <button
                            onClick={() => handleComplexityToggle(level)}
                            className="hover:text-primary/70"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-lg font-black text-foreground">
                  <span className="text-primary">
                    {pagination.totalItems || 0}
                  </span>{" "}
                  {(pagination.totalItems || 0) === 1 ? "design" : "designs"}{" "}
                  found
                </p>
              </div>
            </div>

            {/* Loading State */}
            {designsLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-border rounded-full"></div>
                  <div className="w-20 h-20 border-4 border-primary rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
                </div>
                <p className="mt-8 text-xl text-muted-foreground font-black">
                  Loading amazing designs...
                </p>
              </div>
            ) : designs.length > 0 ? (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="overflow-y-auto max-h-[calc(100vh-200px)] scroll-smooth  scrollbar-hide">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pr-2 pb-32">
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
                          <Link
                            key={design._id!}
                            href={`/designs/${design._id!}`}
                            className="group relative block animate-fade-in"
                          >
                            {/* Main Card */}
                            <div className="relative bg-card rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10">
                              {/* Animated Glowing Border */}
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 animate-pulse" />

                              {/* Content Wrapper */}
                              <div className="relative bg-card rounded-3xl overflow-hidden border-2 border-border hover:border-primary/30 transition-all duration-500">
                                {/* Image Section */}
                                <div className="relative h-64 overflow-hidden">
                                  {preview ? (
                                    <Image
                                      src={preview}
                                      alt={design.title}
                                      fill
                                      className="object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <span className="text-4xl font-black text-primary">
                                          {design.title.charAt(0)}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Dark Overlay on Hover */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700" />

                                  {/* Floating Price Badge */}
                                  <div className="absolute top-4 right-4 z-20">
                                    <div className="relative">
                                      <div className="absolute -inset-2 bg-primary/40 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                      <div className="relative bg-card/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-2xl border border-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                        <span className="text-xl font-black text-primary">
                                          {design.currencyDisplay}
                                          {typeof discountedPrice ===
                                            "number" && discountedPrice >= 0
                                            ? discountedPrice
                                            : basePrice}
                                        </span>
                                        {typeof basePrice === "number" &&
                                          basePrice > 0 &&
                                          typeof discountedPrice === "number" &&
                                          discountedPrice >= 0 &&
                                          discountedPrice < basePrice && (
                                            <span className="block text-xs text-muted-foreground line-through mt-0.5">
                                              {design.currencyDisplay}
                                              {basePrice}
                                            </span>
                                          )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Category Badge - Slides in from Left */}
                                  <div className="absolute top-4 left-4 z-20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500">
                                    <span className="bg-card/95 backdrop-blur-xl text-foreground px-3 py-2 rounded-xl text-sm font-bold shadow-lg border border-border/50">
                                      {categoryObj?.name || "Design"}
                                    </span>
                                  </div>

                                  {/* Complexity Badge - Bottom Left */}
                                  {design.complexityLevel && (
                                    <div className="absolute bottom-4 left-4 z-20">
                                      <span className="bg-primary/95 backdrop-blur-xl text-secondary px-3 py-1.5 rounded-xl text-xs font-black shadow-lg">
                                        {design.complexityLevel}
                                      </span>
                                    </div>
                                  )}

                                  {/* Like Button - Bottom Right (Appears on Hover) */}
                                  <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <LikeButton
                                      designId={design._id!}
                                      initialLikesCount={design.likesCount}
                                      variant="icon"
                                      size="md"
                                      showCount={false}
                                      className="bg-card/95 hover:bg-card shadow-lg backdrop-blur-xl border border-border/50"
                                    />
                                  </div>
                                </div>

                                {/* Info Section - Slides Up */}
                                <div className="relative p-6 transform translate-y-0 group-hover:-translate-y-2 transition-all duration-500">
                                  <h3 className="text-xl font-black text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                                    {design.title}
                                  </h3>

                                  {/* Designer Name */}
                                  {designerName && (
                                    <p className="text-sm text-muted-foreground mb-3 font-bold flex items-center gap-2">
                                      <svg
                                        className="w-4 h-4 text-primary"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                      </svg>
                                      {designerName}
                                    </p>
                                  )}

                                  {/* Rating & Stats Row */}
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                      {/* Rating */}
                                      <div className="flex items-center gap-1.5">
                                        <Star className="w-5 h-5 text-primary fill-primary" />
                                        <span className="text-lg font-black text-foreground">
                                          {(() => {
                                            const avgRating =
                                              (design as any)?.avgRating ??
                                              (design as any)?.statistics
                                                ?.averageRating ??
                                              0;
                                            return avgRating && avgRating > 0
                                              ? avgRating.toFixed(1)
                                              : "5.0";
                                          })()}
                                        </span>
                                      </div>

                                      {/* Review Count */}
                                      {(() => {
                                        const totalReviews =
                                          (design as any)?.totalReviews ??
                                          (design as any)?.statistics
                                            ?.totalReviews ??
                                          0;
                                        return totalReviews > 0 ? (
                                          <span className="text-sm text-muted-foreground font-medium">
                                            ({totalReviews})
                                          </span>
                                        ) : null;
                                      })()}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <svg
                                          className="w-4 h-4 text-primary"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                          />
                                        </svg>
                                        <span className="text-sm font-bold">
                                          {design.likesCount || 0}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <svg
                                          className="w-4 h-4 text-primary"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                                          />
                                        </svg>
                                        <span className="text-sm font-bold">
                                          {design.downloadCount || 0}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Tags */}
                                  {design.tags && design.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {design.tags.slice(0, 2).map((tag) => (
                                        <span
                                          key={tag}
                                          className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-lg font-bold"
                                        >
                                          #{tag}
                                        </span>
                                      ))}
                                      {design.tags.length > 2 && (
                                        <span className="text-xs text-muted-foreground px-2 py-1 font-bold">
                                          +{design.tags.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* CTA Button */}
                                  <Button className="w-full bg-primary hover:bg-primary/90 text-secondary font-black rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="overflow-y-auto max-h-[calc(100vh-350px)] scroll-smooth scrollbar-hide">
                    <div className="space-y-6 pr-2">
                      {designs.map((design, index) => {
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
                          <Link
                            key={design._id!}
                            href={`/designs/${design._id!}`}
                            className="group block animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="relative bg-card rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 border-2 border-border hover:border-primary/30">
                              {/* Glowing Effect on Hover */}
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
                              
                              <div className="relative bg-card rounded-3xl p-6">
                                <div className="flex gap-8">
                                  {/* Image Section */}
                                  <div className="shrink-0 w-72 h-48 rounded-2xl overflow-hidden relative">
                                    {preview ? (
                                      <Image
                                        src={preview}
                                        alt={design.title}
                                        fill
                                        className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
                                      />
                                    ) : (
                                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                                          <span className="text-4xl font-black text-primary">
                                            {design.title.charAt(0)}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                                    
                                    {/* Like Button Overlay */}
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <LikeButton
                                        designId={design._id!}
                                        initialLikesCount={design.likesCount}
                                        variant="icon"
                                        size="md"
                                        showCount={false}
                                        className="bg-card/95 hover:bg-card shadow-lg backdrop-blur-xl"
                                      />
                                    </div>
                                    
                                    {/* Complexity Badge */}
                                    {design.complexityLevel && (
                                      <div className="absolute top-4 left-4">
                                        <span className="bg-primary/95 backdrop-blur-xl text-secondary px-3 py-1.5 rounded-xl text-xs font-black shadow-lg">
                                          {design.complexityLevel}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Content Section */}
                                  <div className="flex-1 flex flex-col justify-between min-w-0">
                                    {/* Top Section */}
                                    <div>
                                      <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1 min-w-0">
                                          {/* Category Badge */}
                                          <span className="inline-block bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-xl font-bold mb-3 border border-primary/20">
                                            {categoryObj?.name || "Design"}
                                          </span>
                                          
                                          {/* Title */}
                                          <h3 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">
                                            {design.title}
                                          </h3>
                                          
                                          {/* Designer */}
                                          {designerName && (
                                            <p className="text-base text-muted-foreground font-bold flex items-center gap-2 mb-3">
                                              <svg
                                                className="w-5 h-5 text-primary"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                              </svg>
                                              {designerName}
                                            </p>
                                          )}
                                        </div>
                                        
                                        {/* Price Section */}
                                        <div className="text-right ml-6 shrink-0">
                                          <div className="relative">
                                            <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                            <div className="relative bg-primary/10 backdrop-blur-sm px-6 py-3 rounded-2xl border-2 border-primary/20">
                                              <span className="text-3xl font-black text-primary block">
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
                                                <span className="text-sm text-muted-foreground line-through block mt-1">
                                                  {design.currencyDisplay}{basePrice}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Description */}
                                      <p className="text-base text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                                        {design.description}
                                      </p>

                                      {/* Stats Row */}
                                      <div className="flex items-center gap-6 mb-4">
                                        {/* Rating */}
                                        <div className="flex items-center gap-2">
                                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Star className="w-5 h-5 text-primary fill-primary" />
                                          </div>
                                          <div>
                                            <span className="text-xl font-black text-foreground">
                                              {(() => {
                                                const avgRating =
                                                  (design as any)?.avgRating ??
                                                  (design as any)?.statistics?.averageRating ??
                                                  0;
                                                return avgRating && avgRating > 0
                                                  ? avgRating.toFixed(1)
                                                  : "5.0";
                                              })()}
                                            </span>
                                            {(() => {
                                              const totalReviews =
                                                (design as any)?.totalReviews ??
                                                (design as any)?.statistics?.totalReviews ??
                                                0;
                                              return totalReviews > 0 ? (
                                                <span className="text-xs text-muted-foreground ml-1">
                                                  ({totalReviews})
                                                </span>
                                              ) : null;
                                            })()}
                                          </div>
                                        </div>
                                        
                                        {/* Likes */}
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                          <svg
                                            className="w-5 h-5 text-primary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2.5}
                                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                          </svg>
                                          <span className="font-bold">{design.likesCount || 0}</span>
                                        </div>
                                        
                                        {/* Downloads */}
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                          <svg
                                            className="w-5 h-5 text-primary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2.5}
                                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                                            />
                                          </svg>
                                          <span className="font-bold">{design.downloadCount || 0}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Bottom Section */}
                                    <div className="flex items-center justify-between">
                                      {/* Tags */}
                                      <div className="flex flex-wrap gap-2">
                                        {design.tags.slice(0, 4).map((tag) => (
                                          <span
                                            key={tag}
                                            className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-lg font-bold border border-primary/20"
                                          >
                                            #{tag}
                                          </span>
                                        ))}
                                        {design.tags.length > 4 && (
                                          <span className="text-xs text-muted-foreground px-3 py-1.5 font-bold">
                                            +{design.tags.length - 4} more
                                          </span>
                                        )}
                                      </div>
                                      
                                      {/* CTA Button */}
                                      <Button
                                        size="lg"
                                        className="bg-primary hover:bg-primary/90 text-secondary font-black rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all px-8"
                                      >
                                        View Details →
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Compact View - Removed for better UX */}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="bg-card rounded-2xl p-6 shadow-2xl border-2 border-border">
                      <nav className="flex items-center space-x-3">
                        {/* Previous Page */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-5 py-3 rounded-xl font-black transition-all ${
                            currentPage === 1
                              ? "text-muted-foreground cursor-not-allowed bg-muted"
                              : "text-foreground hover:text-primary hover:bg-muted bg-background border-2 border-border hover:border-primary shadow-lg hover:scale-105"
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>

                        {/* Page Numbers */}
                        {Array.from(
                          { length: Math.min(pagination.totalPages, 5) },
                          (_, i) => {
                            let pageNum;
                            if (pagination.totalPages <= 5) {
                              pageNum = i + 1;
                            } else {
                              if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (
                                currentPage >=
                                pagination.totalPages - 2
                              ) {
                                pageNum = pagination.totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-5 py-3 rounded-xl font-black transition-all ${
                                  currentPage === pageNum
                                    ? "bg-primary text-secondary shadow-xl scale-110"
                                    : "text-foreground hover:text-primary hover:bg-muted bg-background border-2 border-border hover:border-primary shadow-lg hover:scale-105"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}

                        {/* Next Page */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === pagination.totalPages}
                          className={`px-5 py-3 rounded-xl font-black transition-all ${
                            currentPage === pagination.totalPages
                              ? "text-muted-foreground cursor-not-allowed bg-muted"
                              : "text-foreground hover:text-primary hover:bg-muted bg-background border-2 border-border hover:border-primary shadow-lg hover:scale-105"
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </nav>

                      {/* Page Info */}
                      <div className="text-center mt-4 text-sm text-muted-foreground font-black">
                        Page <span className="text-primary">{currentPage}</span>{" "}
                        of{" "}
                        <span className="text-primary">
                          {pagination.totalPages}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-32">
                <div className="bg-card rounded-3xl p-16 max-w-xl mx-auto border-2 border-border shadow-2xl">
                  <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-foreground mb-4">
                    No Designs Found
                  </h3>
                  <p className="text-muted-foreground mb-8 text-lg font-medium">
                    {searchQuery || activeFiltersCount > 0
                      ? "Try adjusting your filters or search terms"
                      : "No designs are currently available"}
                  </p>
                  {activeFiltersCount > 0 && (
                    <Button
                      onClick={clearAllFilters}
                      className="bg-primary hover:bg-primary/90 text-secondary font-black rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all px-8 py-6 text-lg"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
