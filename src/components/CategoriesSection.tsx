/* eslint-disable react/jsx-key */
"use client";

import React from "react";
import { useGetCategoriesQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Layers,
  Sparkles,
  Palette,
  Layout,
  Component,
  FolderOpen
} from "lucide-react";

interface ParentCategory {
  name: string;
  description: string;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  parentCategory: ParentCategory;
}

interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  parentCategory: null;
  subcategories: Subcategory[];
}

const CATEGORY_ICONS = [
  Palette,
  Layers,
  Layout,
  Sparkles,
  Component,
  FolderOpen
];

export const CategoriesSection: React.FC = () => {
  const { data: categoriesData, isLoading, error } = useGetCategoriesQuery();
  const rawCategories = categoriesData?.data || [];
  const categories: Category[] = (rawCategories as any[]).map((c: any) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    isActive: c.isActive,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    slug: c.slug,
    parentCategory: c.parentCategory,
    subcategories: (c.subcategories || []).map((sc: any) => ({
      id: sc.id,
      name: sc.name,
      description: sc.description,
      isActive: sc.isActive,
      createdAt: sc.createdAt,
      updatedAt: sc.updatedAt,
      slug: sc.slug,
      parentCategory: sc.parentCategory
    }))
  }));

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <div className="h-6 w-32 bg-muted rounded animate-pulse mb-3" />
              <div className="h-9 w-64 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl border border-border p-6 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                  </div>
                </div>
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 bg-muted rounded w-16 animate-pulse" />
                  <div className="h-6 bg-muted rounded w-20 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 bg-card rounded-xl border border-border p-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-muted/40 border border-border flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Collections Coming Soon
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
              We are curating high quality design categories. Check back shortly.
            </p>
            <Button className="bg-primary text-primary-foreground font-bold" asChild>
              <Link href="/designs">Browse Available Designs</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted/40 border border-border rounded text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Explore Disciplines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Design Categories
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-medium mt-1.5">
              Browse {categories.length} production-verified creative disciplines and specialties
            </p>
          </div>
          <Link href="/categories">
            <Button
              variant="outline"
              className="border-border hover:border-foreground/40 bg-card text-foreground font-bold rounded-lg text-sm px-5 py-2.5 transition-colors group"
            >
              All Categories
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const IconComponent =
              CATEGORY_ICONS[index % CATEGORY_ICONS.length];

            return (
              <div
                key={category.id}
                className="group bg-card rounded-xl border border-border hover:border-foreground/40 transition-colors flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 sm:p-7">
                  {/* Category Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-muted/40 border border-border flex items-center justify-center text-primary shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                        {category.subcategories.length} Specialties
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-6">
                    {category.description}
                  </p>

                  {/* Subcategories */}
                  {category.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {category.subcategories.slice(0, 3).map((sub) => (
                        <span
                          key={sub.id}
                          className="px-2.5 py-1 rounded text-xs font-semibold bg-muted/40 text-muted-foreground border border-border"
                        >
                          {sub.name}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                          +{category.subcategories.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-6 sm:px-7 pb-6 pt-0">
                  <Link href={`/designs?category=${category.id}`}>
                    <Button
                      variant="outline"
                      className="w-full border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm py-2.5 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Explore Assets</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
