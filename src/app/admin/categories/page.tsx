"use client";

import { useState } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/services/api";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Tags,
  Loader2,
  AlertCircle,
  Calendar,
  Filter,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ICategory {
  id: string;
  name: string;
  slug?: string;
  parentCategory: ICategory | null;
  description: string;
  isActive: boolean;
  subcategories?: ICategory[];
  createdAt: string;
  updatedAt: string;
}

interface FormErrors {
  name?: string;
  description?: string;
}

import { useEffect, useRef } from "react";
import { useToast } from "@/components/ToastProvider";
// Simple debounce hook for search
// ...existing code...
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function CategoriesPage() {
  // Tab state: 'parent', 'sub', or 'all'
  const [activeTab, setActiveTab] = useState<"parent" | "sub" | "all">("all");
  // Track if modal is for subcategory creation
  const [isSubcategoryMode, setIsSubcategoryMode] = useState(false);

  const toast = useToast();
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  // ...existing code...
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Fetch categories with pagination and search
  // If your RTK Query API doesn't support params, fallback to local filtering
  const { data, isLoading, refetch } = useGetCategoriesQuery({
    page,
    limit,
    search: debouncedSearchTerm,
  } as any);

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    parentCategory: null as string | null,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const categories: ICategory[] = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20, pages: 1 };

  // Apply filters
  // Only filter by status, search is handled by backend
  const filteredCategories = categories.filter((cat) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && cat.isActive) ||
      (statusFilter === "inactive" && !cat.isActive);
    return matchesStatus;
  });
  // No console logs or dead code

  // Validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Category name must be at least 2 characters long";
    } else if (formData.name.length > 50) {
      errors.name = "Category name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = "Category name can only contain letters and spaces";
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = "Category description is required";
    } else if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters long";
    } else if (formData.description.length > 200) {
      errors.description = "Description cannot exceed 200 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    try {
      if (editingCategory) {
        const updateData = {
          id: editingCategory.id,
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive,
          parentCategory: formData.parentCategory, // Already a string | null
        };
        await updateCategory(updateData).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await createCategory(formData).unwrap();
        toast.success("Category created successfully!");
      }
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        isActive: true,
        parentCategory: null,
      });
      setEditingCategory(null);
      setFormErrors({});
      refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as { data?: { message?: string }; message?: string };
      setError(
        error?.data?.message ||
          error?.message ||
          "An error occurred while saving category"
      );
    }
  };

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      parentCategory: category.parentCategory?.id || null,
    });
    setFormErrors({});
    setError(null);
    setShowModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setError(null);
    try {
      await deleteCategory(categoryToDelete).unwrap();
      setSuccess("Category deleted successfully!");
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
      refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as { data?: { message?: string }; message?: string };
      setError(
        error?.data?.message ||
          error?.message ||
          "An error occurred while deleting category"
      );
      setShowDeleteConfirm(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      isActive: true,
      parentCategory: null,
    });
    setFormErrors({});
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="min-h-screen ">
        <div className=" mx-auto px-6 space-y-6">
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 dark:bg-red-500/15 border border-red-500/30 dark:border-red-500/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Header */}
          <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-muted/40 border border-border rounded-lg text-primary">
                  <Tags className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    Categories Management
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm font-medium">
                    Organize and manage design categories and disciplines
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5 flex-wrap">
                <Button
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({
                      name: "",
                      description: "",
                      isActive: true,
                      parentCategory: null,
                    });
                    setFormErrors({});
                    setError(null);
                    setShowModal(true);
                    setIsSubcategoryMode(false);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create Parent Category
                </Button>
                <Button
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({
                      name: "",
                      description: "",
                      isActive: true,
                      parentCategory: "",
                    });
                    setFormErrors({});
                    setError(null);
                    setShowModal(true);
                    setIsSubcategoryMode(true);
                  }}
                  variant="outline"
                  className="border-border hover:border-foreground/40 bg-card text-foreground font-bold rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create Subcategory
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-background p-4 sm:p-5 rounded-xl border border-border">
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">
                  Total Categories
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {categories.length +
                    categories.flatMap((cat) => cat.subcategories || []).length}
                </div>
              </div>
              <div className="bg-background p-4 sm:p-5 rounded-xl border border-border">
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Active Categories</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {categories.filter((c: ICategory) => c.isActive).length +
                    categories
                      .flatMap((cat) => cat.subcategories || [])
                      .filter((s: ICategory) => s.isActive).length}
                </div>
              </div>
              <div className="bg-background p-4 sm:p-5 rounded-xl border border-border">
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">
                  Inactive Categories
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{categories.filter((c: ICategory) => !c.isActive).length +
                    categories
                      .flatMap((cat) => cat.subcategories || [])
                      .filter((s: ICategory) => !s.isActive).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {/* Tabs for Parent/Subcategories/All */}
        <div className="mt-6 flex gap-2 px-4 sm:px-6 flex-wrap">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
            className={`${activeTab === "all" ? "font-bold bg-primary text-primary-foreground" : "border-border hover:border-foreground/40 text-foreground bg-card"} rounded-lg transition-colors`}
          >
            All Categories
          </Button>
          <Button
            variant={activeTab === "parent" ? "default" : "outline"}
            onClick={() => setActiveTab("parent")}
            className={`${activeTab === "parent" ? "font-bold bg-primary text-primary-foreground" : "border-border hover:border-foreground/40 text-foreground bg-card"} rounded-lg transition-colors`}
          >
            Parent Categories
          </Button>
          <Button
            variant={activeTab === "sub" ? "default" : "outline"}
            onClick={() => setActiveTab("sub")}
            className={`${activeTab === "sub" ? "font-bold bg-primary text-primary-foreground" : "border-border hover:border-foreground/40 text-foreground bg-card"} rounded-lg transition-colors`}
          >
            Subcategories
          </Button>
        </div>
        {/* Categories Table */}
        <div className="  overflow-hidden mt-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="ml-3 text-muted-foreground">Loading categories...</span>
            </div>
          ) : (
            <>
              {/* Refactored tab logic for new backend response */}
              {activeTab === "all" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-5">
                  {/* All Parent Categories */}
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col gap-3 hover:border-foreground/40 transition-colors"
                    >
                      
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                          <Tags className="w-6 h-6 text-primary dark:text-primary/90" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground dark:text-foreground">
                            {category.name}
                          </h3>
                          <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/60">
                            ID: {category.id?.slice(-8)} | Parent Category
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 relative z-10">
                        {category.description}
                      </p>
                      <div className="flex gap-2 text-xs flex-wrap relative z-10">
                        <span
                          className={
                            category.isActive
                              ? "bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg font-medium"
                              : "bg-red-500/15 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/40 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-lg font-medium"
                          }
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className="text-muted-foreground/60">
                          Created: {formatDate(category.createdAt)}
                        </span>
                      </div>
                      {category.subcategories &&
                        category.subcategories.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-indigo-600 font-medium">
                              Subcategories:
                            </span>
                            <ul className="ml-2 list-disc text-xs text-muted-foreground">
                              {category.subcategories.map((sub) => (
                                <li key={sub.id}>{sub.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(category.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {/* All Subcategories */}
                  {categories
                    .flatMap((cat) => cat.subcategories || [])
                    .map((subcat) => (
                      <div
                        key={subcat.id}
                        className="bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col gap-3 hover:border-foreground/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Tags className="w-8 h-8 text-indigo-600" />
                          <div>
                            <h3 className="font-bold text-lg text-foreground">
                              {subcat.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              ID: {subcat.id?.slice(-8)} | Subcategory
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {subcat.description}
                        </p>
                        <div className="flex gap-2 text-xs">
                          <span
                            className={
                              subcat.isActive
                                ? "bg-green-100 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded"
                                : "bg-red-100 text-red-700 dark:text-red-300 px-2 py-1 rounded"
                            }
                          >
                            {subcat.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className="text-muted-foreground/60">
                            Created: {formatDate(subcat.createdAt)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Parent:
                          </span>{" "}
                          {subcat.parentCategory?.name || "Unknown"}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(subcat)}
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(subcat.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  {categories.length === 0 &&
                    categories.flatMap((cat) => cat.subcategories || [])
                      .length === 0 && (
                      <div className="col-span-full text-center text-muted-foreground py-12">
                        No categories found.
                      </div>
                    )}
                </div>
              ) : activeTab === "parent" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-5">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col gap-3 hover:border-foreground/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Tags className="w-8 h-8 text-primary" />
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            {category.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            ID: {category.id?.slice(-8)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                      <div className="flex gap-2 text-xs">
                        <span
                          className={
                            category.isActive
                              ? "bg-green-100 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded"
                              : "bg-red-100 text-red-700 dark:text-red-300 px-2 py-1 rounded"
                          }
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className="text-muted-foreground/60">
                          Created: {formatDate(category.createdAt)}
                        </span>
                      </div>
                      {category.subcategories &&
                        category.subcategories.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-indigo-600 font-medium">
                              Subcategories:
                            </span>
                            <ul className="ml-2 list-disc text-xs text-muted-foreground">
                              {category.subcategories.map((sub) => (
                                <li key={sub.id}>{sub.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(category.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                      No parent categories found.
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-5">
                  {categories
                    .flatMap((cat) => cat.subcategories || [])
                    .map((subcat) => (
                      <div
                        key={subcat.id}
                        className="bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col gap-3 hover:border-foreground/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Tags className="w-8 h-8 text-indigo-600" />
                          <div>
                            <h3 className="font-bold text-lg text-foreground">
                              {subcat.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              ID: {subcat.id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {subcat.description}
                        </p>
                        <div className="flex gap-2 text-xs">
                          <span
                            className={
                              subcat.isActive
                                ? "bg-green-100 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded"
                                : "bg-red-100 text-red-700 dark:text-red-300 px-2 py-1 rounded"
                            }
                          >
                            {subcat.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className="text-muted-foreground/60">
                            Created: {formatDate(subcat.createdAt)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Parent:
                          </span>{" "}
                          {subcat.parentCategory?.name || "Unknown"}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(subcat)}
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(subcat.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  {categories.flatMap((cat) => cat.subcategories || [])
                    .length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                      No subcategories found.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCloseModal();
            }}
          >
            <div
              className="bg-card rounded-xl border border-border max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
              tabIndex={0}
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    id="category-modal-title"
                    className="text-2xl font-bold text-foreground"
                  >
                    {editingCategory
                      ? "Edit Category"
                      : isSubcategoryMode
                      ? "Create Subcategory"
                      : "Create Parent Category"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <div
                    className="mb-4 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-center gap-2"
                    role="alert"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Parent Category Field - for subcategory creation and editing */}
                  {(isSubcategoryMode ||
                    (editingCategory && editingCategory.parentCategory)) && (
                    <div className="mb-4">
                      <label
                        htmlFor="parent-category"
                        className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"
                      >
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full">
                          <Tags className="w-4 h-4 text-primary" />
                        </span>
                        Parent Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="parent-category"
                        value={formData.parentCategory || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentCategory: e.target.value || null,
                          })
                        }
                        className="w-full px-3.5 py-2.5 border border-border rounded-lg outline-none transition-colors bg-background text-foreground focus:border-foreground/40 text-sm font-medium"
                      >
                        <option value="" className="bg-card dark:bg-[#141414]">Select Parent Category</option>
                        {categories
                          .filter((cat) => !cat.parentCategory)
                          .map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-card dark:bg-[#141414]">
                              {cat.name}
                            </option>
                          ))}
                      </select>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground/80 dark:text-muted-foreground/60">
                        <Info className="w-4 h-4 text-primary/80 dark:text-primary/70" />
                        <span>
                          <strong className="text-foreground dark:text-foreground/90">Tip:</strong> Select a parent category for
                          your subcategory.
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="category-name"
                      className="block text-sm font-semibold text-foreground mb-2"
                    >
                      {isSubcategoryMode ? "Sub Category" : "Category"} Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="category-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formErrors.name) {
                          setFormErrors({ ...formErrors, name: undefined });
                        }
                      }}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary dark:ring-primary/60 focus:border-transparent outline-none transition-all ${
                        formErrors.name
                          ? "border-red-300 bg-red-500/10 dark:bg-red-500/15"
                          : "border-border dark:border-[#1e1e1e]"
                      }`}
                      placeholder="e.g., Web Design"
                      aria-invalid={!!formErrors.name}
                      aria-describedby="category-name-error"
                    />
                    {formErrors.name && (
                      <p
                        id="category-name-error"
                        className="mt-1 text-sm text-red-500 flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.name}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      2-50 characters, letters and spaces only
                    </p>
                  </div>

                  {/* Description Field */}
                  <div>
                    <label
                      htmlFor="category-description"
                      className="block text-sm font-semibold text-foreground mb-2"
                    >
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="category-description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        });
                        if (formErrors.description) {
                          setFormErrors({
                            ...formErrors,
                            description: undefined,
                          });
                        }
                      }}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary dark:ring-primary/60 focus:border-transparent outline-none transition-all resize-none ${
                        formErrors.description
                          ? "border-red-300 bg-red-500/10 dark:bg-red-500/15"
                          : "border-border dark:border-[#1e1e1e]"
                      }`}
                      placeholder="Describe this category..."
                      aria-invalid={!!formErrors.description}
                      aria-describedby="category-description-error"
                    />
                    {formErrors.description && (
                      <p
                        id="category-description-error"
                        className="mt-1 text-sm text-red-500 flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formData.description.length}/200 characters (minimum 10)
                    </p>
                  </div>

                  {/* Active Status Toggle */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-[#141414]/50 rounded-xl border border-border/70 dark:border-[#1e1e1e]">
                    <div className="flex items-center gap-3">
                      {formData.isActive ? (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <label
                          htmlFor="isActive"
                          className="text-sm font-semibold text-foreground cursor-pointer"
                        >
                          Active Status
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {formData.isActive
                            ? "Category is visible to users"
                            : "Category is hidden from users"}
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-5 h-5 text-primary border-border rounded focus:ring-blue-600 cursor-pointer"
                      aria-checked={formData.isActive}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={handleCloseModal}
                      variant="outline"
                      className="flex-1"
                      disabled={isCreating || isUpdating}
                      aria-label="Cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors"
                      disabled={isCreating || isUpdating}
                      aria-label={
                        editingCategory ? "Update Category" : "Create Category"
                      }
                    >
                      {isCreating || isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {editingCategory ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          {editingCategory
                            ? "Update Category"
                            : "Create Category"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl border border-border max-w-md w-full p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Delete Category
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-foreground mb-6">
                Are you sure you want to delete this category? All associated
                designs will need to be recategorized.
              </p>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setCategoryToDelete(null);
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}




