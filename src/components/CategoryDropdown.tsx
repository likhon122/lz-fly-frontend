"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGetCategoriesQuery, useGetDesignsQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// Local Category type to match backend response
interface Subcategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  parentCategory: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  subcategories: Subcategory[];
}
import { Grid3x3, ChevronDown, ArrowRight } from "lucide-react";

export const CategoryDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const { data: allDesignsData } = useGetDesignsQuery({});

  const rawCategories = categoriesData?.data || [];
  const categories: Category[] = (rawCategories as any[]).map((c: any) => ({
    id: c.id ?? c._id,
    name: c.name,
    description: c.description ?? "",
    isActive: !!c.isActive,
    subcategories: (c.subcategories || []).map((sc: any) => ({
      id: sc.id ?? sc._id,
      name: sc.name,
      description: sc.description ?? "",
      isActive: !!sc.isActive,
      parentCategory: sc.parentCategory ?? null
    }))
  }));
  const allDesigns = allDesignsData?.data || [];

  const getCategoryDesignCount = (categoryId: string) => {
    return allDesigns.filter((design: any) => {
      const cat = design.category || design.mainCategory || design.subCategory;
      return cat?._id === categoryId || cat?.id === categoryId || false;
    }).length;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Categories Button */}
      <Button
        variant="ghost"
        onClick={toggleDropdown}
        className="flex items-center gap-2 text-foreground hover:text-primary hover:bg-muted px-5 py-2.5 text-sm font-black rounded-xl transition-all duration-200"
      >
        <Grid3x3 className="w-4 h-4" />
        <span>Categories</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-96 bg-card/98 dark:bg-card/98 backdrop-blur-3xl rounded-2xl shadow-2xl border border-border z-50">
          <div className="py-2">
            {/* Header */}
            <div className="px-5 py-3 border-b border-border">
              <h3 className="text-base font-black text-foreground">
                Browse by Category
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {categories.length} categories available
              </p>
            </div>

            {categoriesLoading ? (
              <div className="px-5 py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
                <p className="mt-3 text-sm text-muted-foreground font-medium">
                  Loading categories...
                </p>
              </div>
            ) : categories.length > 0 ? (
              <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
                <div className="px-2 py-2 space-y-1">
                  {categories.map((category) => {
                    const designCount = getCategoryDesignCount(category.id);
                    return (
                      <div key={category.id}>
                        <Link
                          href={`/designs?mainCategory=${category.id}`}
                          onClick={() => setIsOpen(false)}
                          className="group block px-4 py-3 rounded-xl hover:bg-muted transition-all duration-200"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                                {category.name}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 font-medium">
                                {category.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-black rounded-lg">
                                {designCount}
                              </span>
                              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                        </Link>
                        {category.subcategories.length > 0 && (
                          <div className="ml-5 mt-1.5 space-y-1">
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {category.subcategories.map((subcat) => (
                                <Link
                                  key={subcat.id}
                                  href={`/designs?subCategory=${subcat.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="px-2.5 py-1 bg-muted hover:bg-primary/10 text-foreground hover:text-primary text-xs font-bold rounded-lg transition-all border border-border"
                                >
                                  {subcat.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="px-5 py-8 text-center">
                <Grid3x3 className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-sm font-black text-foreground">
                  No categories available
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Check back soon for updates
                </p>
              </div>
            )}

            {/* Footer */}
            {categories.length > 0 && (
              <div className="border-t border-border px-5 py-3 mt-1">
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 text-sm font-black text-primary hover:text-primary/80 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <span>View All Categories</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
