/* eslint-disable react/jsx-key */
"use client";

import React from "react";
import { useGetCategoriesQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Categories
              </h2>
              <p className="text-lg text-gray-600">
                Explore design collections by category
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-7 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-7 bg-gray-200 rounded-full w-20"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No Categories Available
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Categories will be available soon. Check back later for amazing
              design collections.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/designs">Browse All Designs</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const getCategoryColor = (index: number) => {
    const colors = [
      {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-700",
        accent: "bg-slate-500"
      },
      {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-700",
        accent: "bg-gray-500"
      },
      {
        bg: "bg-zinc-50",
        border: "border-zinc-200",
        text: "text-zinc-700",
        accent: "bg-zinc-500"
      },
      {
        bg: "bg-neutral-50",
        border: "border-neutral-200",
        text: "text-neutral-700",
        accent: "bg-neutral-500"
      },
      {
        bg: "bg-stone-50",
        border: "border-stone-200",
        text: "text-stone-700",
        accent: "bg-stone-500"
      },
      {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        accent: "bg-blue-500"
      }
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="">
      <div className="max-w-7xl mx-auto ">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <ArrowRight className="w-4 h-4 text-primary" />
              <span className="text-sm font-black text-primary uppercase tracking-wider">
                Browse Categories
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-3">
              Explore by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              Discover {categories.length}+ specialized design collections
            </p>
          </div>
          <Link href="/categories">
            <Button
              variant="outline"
              className="border-2 border-border hover:border-primary hover:bg-primary/5 rounded-xl font-black group"
            >
              View All Categories
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            return (
              <div
                key={category.id}
                className="group bg-card rounded-2xl border-2 border-border hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Category Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <span className="text-2xl">🎨</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-black text-foreground group-hover:text-foreground transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-xs text-muted-foreground font-bold">
                            {category.subcategories.length} specialties
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {category.subcategories.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories
                          .slice(0, 4)
                          .map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              href={`/designs?subCategory=${subcategory.id}`}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-secondary transition-all border border-primary/20 hover:border-primary hover:scale-105"
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        {category.subcategories.length > 4 && (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-muted text-muted-foreground border border-border">
                            +{category.subcategories.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Link
                      href={`/designs?mainCategory=${category.id}`}
                      className="inline-flex items-center text-sm font-black text-foreground hover:text-foreground transition-colors group/link"
                    >
                      Browse designs
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 px-10 py-8 bg-card rounded-2xl shadow-xl border-2 border-border">
            <div className="text-center">
              <div className="text-3xl font-black text-foreground mb-2">
                {categories.length}
              </div>
              <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">
                Categories
              </div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary mb-2">
                {categories.reduce(
                  (total, cat) => total + cat.subcategories.length,
                  0
                )}
              </div>
              <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">
                Specialties
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
