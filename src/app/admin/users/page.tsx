"use client";

import { useState } from "react";
import { useGetAllUsersQuery } from "@/services/api";
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Calendar,
  Shield,
  ShieldCheck,
  ShieldOff,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  isActive: boolean;
  isDeleted: boolean;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsersPage() {
  // Filter states
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"admin" | "customer" | "">("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<
    "name" | "email" | "createdAt" | "updatedAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch users with filters
  const { data, isLoading, error } = useGetAllUsersQuery({
    search: search || undefined,
    role: role || undefined,
    isActive,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const users = data?.data || [];
  const pagination = data?.pagination;

  const toast = useToast();

  // Handle filter changes
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page
  };

  const handleRoleFilter = (value: string) => {
    setRole(value as "admin" | "customer" | "");
    setPage(1);
  };

  const handleActiveFilter = (value: string) => {
    if (value === "") {
      setIsActive(undefined);
    } else {
      setIsActive(value === "true");
    }
    setPage(1);
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      // Toggle order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Export users (you can implement actual CSV export)
  const handleExport = () => {
    console.log("Exporting users...", users);
    toast.info("Export functionality to be implemented");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Users Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage platform users, roles, and permissions
            </p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-sm transition-colors self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Stats */}
        {pagination && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted/40 p-4 rounded-xl border border-border">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Total Users
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {pagination.totalItems}
              </div>
            </div>
            <div className="bg-muted/40 p-4 rounded-xl border border-border">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Current Page
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {pagination.currentPage} / {pagination.totalPages}
              </div>
            </div>
            <div className="bg-muted/40 p-4 rounded-xl border border-border">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Active Filters
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {[search, role, isActive !== undefined].filter(Boolean).length ||
                  "None"}
              </div>
            </div>
            <div className="bg-muted/40 p-4 rounded-xl border border-border">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Per Page
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {limit}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Filter Users
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
            />
          </div>

          {/* Role Filter */}
          <select
            value={role}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          {/* Active Status Filter */}
          <select
            value={isActive === undefined ? "" : isActive ? "true" : "false"}
            onChange={(e) => handleActiveFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Items Per Page */}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(search || role || isActive !== undefined) && (
          <button
            onClick={() => {
              setSearch("");
              setRole("");
              setIsActive(undefined);
              setPage(1);
            }}
            className="mt-3 text-xs font-semibold text-primary hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-sm text-muted-foreground">
              Loading users...
            </span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-red-500">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Failed to load users</span>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Users className="w-12 h-12 mb-3 text-muted-foreground/30" />
            <p className="text-base font-semibold text-foreground">
              No users found
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort("email")}
                    >
                      Email{" "}
                      {sortBy === "email" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      Joined{" "}
                      {sortBy === "createdAt" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user: IUser) => (
                    <tr
                      key={user._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {user.profileImage ? (
                            <Image
                              src={user.profileImage}
                              alt={user.name}
                              width={36}
                              height={36}
                              className="rounded-full border border-border"
                            />
                          ) : (
                            <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                              {user.name?.[0]?.toUpperCase() || (
                                <User className="w-4 h-4" />
                              )}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-semibold text-foreground">
                              {user.name}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              ID: {user._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground/70" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-600 border border-purple-500/20">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            <Shield className="w-3.5 h-3.5" />
                            Customer
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
                            <ShieldOff className="w-3.5 h-3.5" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted rounded-lg transition-colors border border-border"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-5 py-4 bg-card border-t border-border">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-semibold text-foreground">
                      {(pagination.currentPage - 1) * limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-foreground">
                      {Math.min(
                        pagination.currentPage * limit,
                        pagination.totalItems
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-foreground">
                      {pagination.totalItems}
                    </span>{" "}
                    users
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(pagination.totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          (pageNum >= page - 1 && pageNum <= page + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                page === pageNum
                                  ? "bg-primary text-primary-foreground"
                                  : "border border-border hover:bg-muted text-muted-foreground"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === page - 2 ||
                          pageNum === page + 2
                        ) {
                          return (
                            <span
                              key={pageNum}
                              className="px-1 text-xs text-muted-foreground"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={!pagination.hasNextPage}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
