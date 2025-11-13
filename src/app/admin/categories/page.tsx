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
          <div className="bg-card/95 dark:bg-[#141414]/95 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-primary/20 p-5 sm:p-6 border border-border/70 dark:border-[#1e1e1e] relative overflow-hidden">
            {/* Premium Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary/70 via-primary to-primary/90 dark:from-primary/40 dark:via-primary/60 dark:to-primary/50 rounded-xl shadow-lg dark:shadow-primary/30">
                  <Tags className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary/70 via-primary to-primary/90 dark:from-primary/40 dark:via-primary/60 dark:to-primary/50 bg-clip-text text-transparent">
                    Categories Management
                  </h1>
                  <p className="text-muted-foreground/80 dark:text-muted-foreground/60 mt-1 text-sm">
                    Organize and manage design categories
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
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
                  className="bg-gradient-to-r from-primary/70 via-primary to-primary/90 dark:from-primary/40 dark:via-primary/60 dark:to-primary/50 hover:from-primary/80 hover:via-primary/90 hover:to-primary dark:hover:from-primary/50 dark:hover:via-primary/70 dark:hover:to-primary/60 shadow-xl dark:shadow-primary/20 hover:shadow-2xl transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" />
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
                  // Track if modal is for subcategory creation

                  className="bg-gradient-to-r from-emerald-500/70 via-emerald-500 to-emerald-500/90 dark:from-emerald-500/40 dark:via-emerald-500/60 dark:to-emerald-500/50 hover:from-emerald-600 hover:via-emerald-600 hover:to-emerald-600 dark:hover:from-emerald-500 dark:hover:via-emerald-500 dark:hover:to-emerald-500 shadow-xl dark:shadow-emerald-500/20 hover:shadow-2xl transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Subcategory
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              <div className="bg-gradient-to-br from-primary/10 to-primary/15 dark:from-primary/10 dark:to-primary/5 p-4 sm:p-5 rounded-xl border border-primary/30 dark:border-primary/20 backdrop-blur-sm hover:shadow-lg dark:hover:shadow-primary/10 transition-all">
                <div className="text-sm text-primary dark:text-primary/90 font-medium mb-1">
                  Total Categories
                </div>
                <div className="text-3xl font-bold text-foreground dark:text-foreground">
                  {categories.length +
                    categories.flatMap((cat) => cat.subcategories || []).length}
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/15 dark:from-emerald-500/10 dark:to-emerald-500/5 p-4 sm:p-5 rounded-xl border border-emerald-500/30 dark:border-emerald-500/20 backdrop-blur-sm hover:shadow-lg dark:hover:shadow-emerald-500/10 transition-all">
                <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Active</div>
                <div className="text-3xl font-bold text-foreground dark:text-foreground">
                  {categories.filter((c: ICategory) => c.isActive).length +
                    categories
                      .flatMap((cat) => cat.subcategories || [])
                      .filter((s: ICategory) => s.isActive).length}
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/15 dark:from-amber-500/10 dark:to-amber-500/5 p-4 sm:p-5 rounded-xl border border-amber-500/30 dark:border-amber-500/20 backdrop-blur-sm hover:shadow-lg dark:hover:shadow-amber-500/10 transition-all">
                <div className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">
                  Inactive
                </div>
                <div className="text-3xl font-bold text-foreground dark:text-foreground">{categories.filter((c: ICategory) => !c.isActive).length +
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
            className={`${activeTab === "all" ? "font-bold bg-primary/90 dark:bg-primary/80 shadow-lg dark:shadow-primary/30" : "hover:bg-muted/60 dark:hover:bg-muted/40"} transition-all rounded-xl`}
          >
            All Categories
          </Button>
          <Button
            variant={activeTab === "parent" ? "default" : "outline"}
            onClick={() => setActiveTab("parent")}
            className={`${activeTab === "parent" ? "font-bold bg-primary/90 dark:bg-primary/80 shadow-lg dark:shadow-primary/30" : "hover:bg-muted/60 dark:hover:bg-muted/40"} transition-all rounded-xl`}
          >
            Parent Categories
          </Button>
          <Button
            variant={activeTab === "sub" ? "default" : "outline"}
            onClick={() => setActiveTab("sub")}
            className={`${activeTab === "sub" ? "font-bold bg-primary/90 dark:bg-primary/80 shadow-lg dark:shadow-primary/30" : "hover:bg-muted/60 dark:hover:bg-muted/40"} transition-all rounded-xl`}
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
                      className="bg-card/95 dark:bg-[#141414]/95 backdrop-blur-sm border border-border/70 dark:border-[#1e1e1e] rounded-xl shadow-lg dark:shadow-primary/10 p-4 sm:p-5 flex flex-col gap-3 hover:shadow-xl dark:hover:shadow-primary/20 transition-all hover:scale-[1.02] relative overflow-hidden group"
                    >
                      {/* Subtle gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent dark:group-hover:from-primary/10 transition-all pointer-events-none" />
                      
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
                        className="bg-card border border-border/70 dark:border-[#1e1e1e] rounded-xl shadow p-4 sm:p-5 flex flex-col gap-3"
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
                      className="bg-card border border-border/70 dark:border-[#1e1e1e] rounded-xl shadow p-4 sm:p-5 flex flex-col gap-3"
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
                        className="bg-card border border-border/70 dark:border-[#1e1e1e] rounded-xl shadow p-4 sm:p-5 flex flex-col gap-3"
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
            className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCloseModal();
            }}
          >
            <div
              className="bg-card/95 dark:bg-[#141414]/95 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-primary/20 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border/70 dark:border-[#1e1e1e] relative"
              tabIndex={0}
            >
              {/* Premium glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent pointer-events-none rounded-2xl" />
              
              <div className="p-4 sm:p-6 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    id="category-modal-title"
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary/70 via-primary to-primary/90 dark:from-primary/40 dark:via-primary/60 dark:to-primary/50 bg-clip-text text-transparent"
                  >
                    {editingCategory
                      ? "Edit Category"
                      : isSubcategoryMode
                      ? "Create Subcategory"
                      : "Create Parent Category"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-muted/60 dark:hover:bg-muted/40 rounded-xl transition-all hover:scale-110"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-muted-foreground dark:text-muted-foreground/80" />
                  </button>
                </div>

                {error && (
                  <div
                    className="mb-4 bg-red-500/10 dark:bg-red-500/15 border border-red-500/30 dark:border-red-500/40 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl flex items-center gap-2 backdrop-blur-sm"
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
                        className="w-full px-4 py-3 border border-border/70 dark:border-[#1e1e1e] rounded-xl focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/60 focus:border-primary dark:focus:border-primary/60 outline-none transition-all bg-muted/30 dark:bg-[#141414]/80 backdrop-blur-sm hover:bg-muted/50 dark:hover:bg-[#141414]/90 text-foreground dark:text-foreground"
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
                      className="flex-1 bg-gradient-to-r from-primary/70 via-primary to-primary/90 dark:from-primary/40 dark:via-primary/60 dark:to-primary/50 hover:from-primary/80 hover:via-primary/90 hover:to-primary dark:hover:from-primary/50 dark:hover:via-primary/70 dark:hover:to-primary/60"
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-5">
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




