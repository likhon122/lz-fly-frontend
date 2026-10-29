/* eslint-disable react/jsx-key */
"use client";

import React, { useState } from "react";
import { useGetCategoriesQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Search,
  LayoutGrid,
  List,
  ArrowRight,
  X,
  Globe,
  Smartphone,
  Layout,
  Box,
  Sparkles,
  Palette,
  Image as ImageIcon,
  Type,
  Layers,
  Folder,
} from "lucide-react";

interface Subcategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  parentCategory: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subcategories: Subcategory[];
}

// Map category names to clean Lucide icons
const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("web") || n.includes("site") || n.includes("html")) return Globe;
  if (n.includes("mobile") || n.includes("app") || n.includes("ios") || n.includes("android")) return Smartphone;
  if (n.includes("ui") || n.includes("ux") || n.includes("dashboard") || n.includes("layout")) return Layout;
  if (n.includes("3d") || n.includes("render") || n.includes("model")) return Box;
  if (n.includes("brand") || n.includes("logo") || n.includes("identity")) return Sparkles;
  if (n.includes("illustrat") || n.includes("art") || n.includes("vector") || n.includes("draw")) return Palette;
  if (n.includes("photo") || n.includes("media") || n.includes("camera")) return ImageIcon;
  if (n.includes("font") || n.includes("type") || n.includes("text")) return Type;
  if (n.includes("system") || n.includes("component") || n.includes("template")) return Layers;
  return Folder;
};

export default function CategoriesPage() {
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const rawCategories = categoriesData?.data || [];
  const categories: Category[] = (rawCategories as any[]).map((c: any) => ({
    id: c.id ?? c._id,
    name: c.name,
    description: c.description ?? "",
    isActive: !!c.isActive,
    createdAt: c.createdAt ?? c.created_at ?? "",
    updatedAt: c.updatedAt ?? c.updated_at ?? "",
    subcategories: (c.subcategories || []).map((sc: any) => ({
      id: sc.id ?? sc._id,
      name: sc.name,
      description: sc.description ?? "",
      isActive: !!sc.isActive,
      parentCategory: sc.parentCategory ?? null,
      createdAt: sc.createdAt ?? sc.created_at ?? "",
      updatedAt: sc.updatedAt ?? sc.updated_at ?? "",
    })),
  }));

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.subcategories.some((sc) =>
        sc.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const totalSpecialties = categories.reduce(
    (acc, cat) => acc + cat.subcategories.length,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-semibold">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-foreground">Categories</span>
          </div>
        </nav>

        {/* Page Header Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-muted/40 text-foreground text-xs font-semibold uppercase tracking-wider mb-3">
              Asset Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Design Categories
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
              Explore production-ready templates and assets organized by creative
              disciplines and specialties.
            </p>
          </div>
          <Link href="/designs">
            <Button
              variant="outline"
              className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-xs px-4 py-2 transition-colors"
            >
              Browse All Designs
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Minimalist Metrics Strip (0 gradients, 0 box shadow, 0 blur) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-border">
          <div className="border-r border-border/50 pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {categories.length}
            </div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
              Main Disciplines
            </div>
          </div>
          <div className="border-r border-border/50 pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-primary">
              {totalSpecialties}
            </div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
              Curated Specialties
            </div>
          </div>
          <div className="border-r border-border/50 pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {categories.filter((c) => c.isActive).length}
            </div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
              Active Domains
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              100%
            </div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
              Production Verified
            </div>
          </div>
        </div>

        {/* Toolbar: Search & View Switcher */}
        <div className="py-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search categories or specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs font-semibold text-muted-foreground">
              Showing {filteredCategories.length} of {categories.length}
            </span>

            {/* View Mode Toggle */}
            <div className="inline-flex items-center border border-border rounded-lg p-0.5 bg-muted/40">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-card text-foreground border border-border/80 font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-card text-foreground border border-border/80 font-bold"
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

        {/* Content Section */}
        {categoriesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-muted/70 rounded-lg animate-pulse" />
                  <div className="w-14 h-4 bg-muted/70 rounded animate-pulse" />
                </div>
                <div className="h-5 bg-muted/70 rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-muted/60 rounded w-full animate-pulse" />
                <div className="flex gap-2 pt-2 border-t border-border/50">
                  <div className="h-6 w-16 bg-muted/60 rounded animate-pulse" />
                  <div className="h-6 w-20 bg-muted/60 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <>
            {/* GRID VIEW */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category) => {
                  const IconComp = getCategoryIcon(category.name);

                  return (
                    <div
                      key={category.id}
                      className="group bg-card border border-border hover:border-primary/80 rounded-xl p-5 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        {/* Card Top: Icon & Active Indicator */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-lg bg-muted/60 border border-border/80 flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
                            <IconComp className="w-5 h-5" />
                          </div>
                          {category.isActive && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-muted/40 text-[11px] font-semibold text-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              Active
                            </span>
                          )}
                        </div>

                        {/* Category Name & Count */}
                        <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          <Link href={`/designs?mainCategory=${category.id}`}>
                            {category.name}
                          </Link>
                        </h2>

                        <p className="text-xs text-muted-foreground mt-1.5 mb-4 line-clamp-2 leading-relaxed">
                          {category.description || "Collection of premium design templates and production assets."}
                        </p>

                        {/* Subcategories Chips */}
                        {category.subcategories.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/50 mb-2">
                            {category.subcategories.slice(0, 4).map((subcat) => (
                              <Link
                                key={subcat.id}
                                href={`/designs?subCategory=${subcat.id}`}
                                className="inline-flex items-center px-2 py-1 rounded border border-border/80 bg-muted/30 hover:bg-muted text-foreground/80 hover:text-foreground text-[11px] font-medium transition-colors"
                              >
                                {subcat.name}
                              </Link>
                            ))}
                            {category.subcategories.length > 4 && (
                              <span className="inline-flex items-center px-2 py-1 rounded border border-border/60 bg-muted/20 text-muted-foreground text-[11px] font-medium">
                                +{category.subcategories.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="pt-3 mt-4 border-t border-border/50 flex items-center justify-between text-xs">
                        <Link
                          href={`/designs?mainCategory=${category.id}`}
                          className="font-bold text-primary inline-flex items-center gap-1 hover:underline"
                        >
                          Explore templates
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {category.subcategories.length} specialties
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* LIST VIEW */}
            {viewMode === "list" && (
              <div className="space-y-3">
                {filteredCategories.map((category) => {
                  const IconComp = getCategoryIcon(category.name);

                  return (
                    <div
                      key={category.id}
                      className="group bg-card border border-border hover:border-primary/80 rounded-xl p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-lg bg-muted/60 border border-border/80 flex items-center justify-center text-foreground group-hover:text-primary transition-colors shrink-0">
                          <IconComp className="w-5 h-5" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              <Link href={`/designs?mainCategory=${category.id}`}>
                                {category.name}
                              </Link>
                            </h2>
                            {category.isActive && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-muted/40 text-[10px] font-semibold text-foreground shrink-0">
                                <span className="w-1 h-1 rounded-full bg-primary" />
                                Active
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {category.description || "Collection of premium design templates and production assets."}
                          </p>

                          {/* Subcategory inline tags */}
                          {category.subcategories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {category.subcategories.slice(0, 5).map((subcat) => (
                                <Link
                                  key={subcat.id}
                                  href={`/designs?subCategory=${subcat.id}`}
                                  className="inline-flex items-center px-2 py-0.5 rounded border border-border/80 bg-muted/30 hover:bg-muted text-foreground/80 hover:text-foreground text-[10px] font-medium transition-colors"
                                >
                                  {subcat.name}
                                </Link>
                              ))}
                              {category.subcategories.length > 5 && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-border/60 text-muted-foreground text-[10px] font-medium">
                                  +{category.subcategories.length - 5}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span className="text-xs text-muted-foreground font-medium hidden md:inline">
                          {category.subcategories.length} specialties
                        </span>
                        <Link href={`/designs?mainCategory=${category.id}`}>
                          <Button
                            size="sm"
                            className="bg-card hover:bg-primary hover:text-white text-foreground border border-border hover:border-primary font-bold rounded-lg text-xs px-3.5 py-1.5 transition-colors inline-flex items-center gap-1.5"
                          >
                            Browse
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Empty Search State */
          <div className="py-16 text-center border border-dashed border-border rounded-xl bg-card/40 my-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">
              No categories found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-5 leading-relaxed">
              No categories matched your search term &quot;{searchQuery}&quot;. Try adjusting your keywords.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={() => setSearchQuery("")}
                className="bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-xs px-4 py-2 transition-colors"
              >
                Clear Search Filter
              </Button>
              <Link href="/designs">
                <Button
                  variant="outline"
                  className="border-border text-foreground font-semibold rounded-lg text-xs px-4 py-2 transition-colors"
                >
                  View All Designs
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Minimalist Bottom Callout (0 gradient, 0 box shadow, 0 blur) */}
        {!categoriesLoading && filteredCategories.length > 0 && (
          <div className="mt-12 border border-border rounded-xl bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Looking for specific template formats?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
                Filter across all templates by file format (Figma, Framer, Blender, Sketch), design styles, and commercial licenses.
              </p>
            </div>
            <Link href="/designs" className="shrink-0">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-lg px-6 py-2.5 text-xs transition-colors inline-flex items-center gap-2">
                Browse Full Catalog
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
