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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-[#0a0a0a] dark:via-[#0f0f0f] dark:to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto p-4 sm:p-5 space-y-6">
        {/* Header */}
        <div className="bg-card/95 dark:bg-[#141414]/95 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-primary/20 p-5 sm:p-6 border border-border/70 dark:border-[#1e1e1e] relative overflow-hidden">
          {/* Premium Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary/70 via-primary to-primary/90 dark:from-primary/40 dark:via-primary/60 dark:to-primary/50 rounded-xl shadow-lg dark:shadow-primary/30">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary/70 via-primary to-primary/90 dark:from-primary/40 dark:via-primary/60 dark:to-primary/50 bg-clip-text text-transparent">
                  Users Management
                </h1>
                <p className="text-muted-foreground/80 dark:text-muted-foreground/60 mt-1 text-sm">
                  Manage all platform users, roles, and permissions
                </p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/70 via-emerald-500 to-emerald-500/90 dark:from-emerald-500/40 dark:via-emerald-500/60 dark:to-emerald-500/50 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 dark:hover:from-emerald-500 dark:hover:to-emerald-600 transition-all duration-200 shadow-xl dark:shadow-emerald-500/20 hover:shadow-2xl"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Stats */}
          {pagination && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              <div className="bg-gradient-to-br from-primary/10 to-primary/15 dark:from-primary/10 dark:to-primary/5 p-4 sm:p-5 rounded-xl border border-primary/30 dark:border-primary/20 backdrop-blur-sm hover:shadow-lg dark:hover:shadow-primary/10 transition-all">
                <div className="text-sm text-primary dark:text-primary/90 font-medium mb-1">
                  Total Users
                </div>
                <div className="text-3xl font-bold text-foreground dark:text-foreground">
                  {pagination.totalItems}
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/15 dark:from-purple-500/10 dark:to-purple-500/5 p-4 sm:p-5 rounded-xl border border-purple-500/30 dark:border-purple-500/20 backdrop-blur-sm hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all">
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
                  Current Page
                </div>
                <div className="text-3xl font-bold text-foreground dark:text-foreground">
                  {pagination.currentPage} / {pagination.totalPages}
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/15 dark:from-emerald-500/10 dark:to-emerald-500/5 p-4 sm:p-5 rounded-xl border border-emerald-500/30 dark:border-emerald-500/20 backdrop-blur-sm hover:shadow-lg dark:hover:shadow-emerald-500/10 transition-all">
                <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                  Active Filters
                </div>
                <div className="text-3xl font-bold text-foreground dark:text-foreground">
                  {[search, role, isActive !== undefined].filter(Boolean)
                    .length || "None"}
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/15 dark:from-amber-500/10 dark:to-amber-500/5 p-4 sm:p-5 rounded-xl border border-amber-500/30 dark:border-amber-500/20 backdrop-blur-sm hover:shadow-lg dark:hover:shadow-amber-500/10 transition-all">
                <div className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">
                  Per Page
                </div>
                <div className="text-3xl font-bold text-foreground dark:text-foreground">
                  {limit}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-card/95 dark:bg-[#141414]/95 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-primary/20 p-4 sm:p-5 border border-border/70 dark:border-[#1e1e1e] relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent dark:from-primary/5 dark:via-transparent dark:to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="p-1.5 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <Filter className="w-5 h-5 text-primary dark:text-primary/90" />
            </div>
            <h2 className="text-lg font-semibold text-foreground dark:text-foreground">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 dark:text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border/70 dark:border-[#1e1e1e] rounded-xl focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/60 focus:border-primary dark:focus:border-primary/60 outline-none transition-all bg-muted/30 dark:bg-[#141414]/80 backdrop-blur-sm hover:bg-muted/50 dark:hover:bg-[#141414]/90 text-foreground dark:text-foreground placeholder:text-muted-foreground/60"
              />
            </div>

            {/* Role Filter */}
            <select
              value={role}
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="px-4 py-2.5 border border-border/70 dark:border-[#1e1e1e] rounded-xl focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/60 focus:border-primary dark:focus:border-primary/60 outline-none transition-all bg-muted/30 dark:bg-[#141414]/80 backdrop-blur-sm hover:bg-muted/50 dark:hover:bg-[#141414]/90 text-foreground dark:text-foreground"
            >
              <option value="" className="bg-card dark:bg-[#141414]">All Roles</option>
              <option value="customer" className="bg-card dark:bg-[#141414]">Customer</option>
              <option value="admin" className="bg-card dark:bg-[#141414]">Admin</option>
            </select>

            {/* Active Status Filter */}
            <select
              value={isActive === undefined ? "" : isActive ? "true" : "false"}
              onChange={(e) => handleActiveFilter(e.target.value)}
              className="px-4 py-2.5 border border-border/70 dark:border-[#1e1e1e] rounded-xl focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/60 focus:border-primary dark:focus:border-primary/60 outline-none transition-all bg-muted/30 dark:bg-[#141414]/80 backdrop-blur-sm hover:bg-muted/50 dark:hover:bg-[#141414]/90 text-foreground dark:text-foreground"
            >
              <option value="" className="bg-card dark:bg-[#141414]">All Status</option>
              <option value="true" className="bg-card dark:bg-[#141414]">Active</option>
              <option value="false" className="bg-card dark:bg-[#141414]">Inactive</option>
            </select>

            {/* Items Per Page */}
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-4 py-2.5 border border-border/70 dark:border-[#1e1e1e] rounded-xl focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/60 focus:border-primary dark:focus:border-primary/60 outline-none transition-all bg-muted/30 dark:bg-[#141414]/80 backdrop-blur-sm hover:bg-muted/50 dark:hover:bg-[#141414]/90 text-foreground dark:text-foreground"
            >
              <option value="5" className="bg-card dark:bg-[#141414]">5 per page</option>
              <option value="10" className="bg-card dark:bg-[#141414]">10 per page</option>
              <option value="20" className="bg-card dark:bg-[#141414]">20 per page</option>
              <option value="50" className="bg-card dark:bg-[#141414]">50 per page</option>
              <option value="100" className="bg-card dark:bg-[#141414]">100 per page</option>
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
              className="mt-4 text-sm text-primary hover:text-primary font-medium transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-card/95 dark:bg-[#141414]/95 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-primary/20 border border-border/70 dark:border-[#1e1e1e] overflow-hidden relative">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent dark:from-primary/5 dark:via-transparent dark:to-transparent pointer-events-none" />
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20 relative z-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="ml-3 text-muted-foreground dark:text-muted-foreground/80">Loading users...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20 text-red-500 dark:text-red-400 relative z-10">
              <AlertCircle className="w-6 h-6 mr-2" />
              Failed to load users
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground dark:text-muted-foreground/80 relative z-10">
              <Users className="w-16 h-16 mb-4 text-muted-foreground/30 dark:text-muted-foreground/20" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto relative z-10">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-muted/30 to-muted/20 dark:from-[#141414]/80 dark:to-[#0f0f0f]/60 border-b border-border/70 dark:border-[#1e1e1e]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wider">
                        User
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wider cursor-pointer hover:text-primary dark:hover:text-primary/90 transition-colors"
                        onClick={() => handleSort("email")}
                      >
                        Email{" "}
                        {sortBy === "email" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wider">
                        Status
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground dark:text-muted-foreground/80 uppercase tracking-wider cursor-pointer hover:text-primary dark:hover:text-primary/90 transition-colors"
                        onClick={() => handleSort("createdAt")}
                      >
                        Joined{" "}
                        {sortBy === "createdAt" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 dark:divide-[#1e1e1e]">
                    {users.map((user: IUser) => (
                      <tr
                        key={user._id}
                        className="hover:bg-muted/40 dark:hover:bg-[#141414]/70 transition-all group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {user.profileImage ? (
                              <Image
                                src={user.profileImage}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="rounded-full ring-2 ring-border/50 dark:ring-[#1e1e1e] group-hover:ring-primary/50 dark:group-hover:ring-primary/40 transition-all"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-primary/60 to-primary/90 dark:from-primary/40 dark:to-primary/70 rounded-full flex items-center justify-center ring-2 ring-border/50 dark:ring-[#1e1e1e] group-hover:ring-primary/50 dark:group-hover:ring-primary/40 transition-all">
                                <User className="w-5 h-5 text-white" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-foreground dark:text-foreground">
                                {user.name}
                              </div>
                              <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/60">
                                ID: {user._id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-muted-foreground dark:text-muted-foreground/80">
                            <Mail className="w-4 h-4 text-muted-foreground/60 dark:text-muted-foreground/50" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.role === "admin" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-500/15 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 dark:border-purple-500/40">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/15 dark:bg-primary/20 text-primary dark:text-primary/90 border border-primary/30 dark:border-primary/40">
                              <Shield className="w-3.5 h-3.5" />
                              Customer
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 dark:border-emerald-500/40">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/15 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30 dark:border-red-500/40">
                              <ShieldOff className="w-3.5 h-3.5" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                            <Calendar className="w-4 h-4 text-muted-foreground/60 dark:text-muted-foreground/50" />
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link
                            href={`/admin/users/${user._id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary dark:text-primary/90 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-xl transition-all border border-primary/20 dark:border-primary/30 hover:border-primary/40 dark:hover:border-primary/50"
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
                <div className="px-6 py-4 bg-muted/30 dark:bg-[#141414]/60 backdrop-blur-sm border-t border-border/70 dark:border-[#1e1e1e]">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="text-sm text-muted-foreground dark:text-muted-foreground/80">
                      Showing{" "}
                      <span className="font-medium text-foreground dark:text-foreground">
                        {(pagination.currentPage - 1) * limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium text-foreground dark:text-foreground">
                        {Math.min(
                          pagination.currentPage * limit,
                          pagination.totalItems
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-foreground dark:text-foreground">
                        {pagination.totalItems}
                      </span>{" "}
                      users
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="p-2 rounded-xl border border-border/70 dark:border-[#1e1e1e] hover:bg-muted/50 dark:hover:bg-[#141414]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md dark:hover:shadow-primary/10"
                      >
                        <ChevronLeft className="w-5 h-5 text-muted-foreground dark:text-muted-foreground/80" />
                      </button>

                      <div className="flex items-center gap-1">
                        {[...Array(pagination.totalPages)].map((_, idx) => {
                          const pageNum = idx + 1;
                          // Show first page, last page, current page, and pages around current
                          if (
                            pageNum === 1 ||
                            pageNum === pagination.totalPages ||
                            (pageNum >= page - 1 && pageNum <= page + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                  page === pageNum
                                    ? "bg-primary/90 dark:bg-primary/80 text-white shadow-lg dark:shadow-primary/30"
                                    : "border border-border/70 dark:border-[#1e1e1e] hover:bg-muted/50 dark:hover:bg-[#141414]/80 text-muted-foreground dark:text-muted-foreground/80 hover:text-foreground dark:hover:text-foreground"
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
                                className="px-2 text-muted-foreground dark:text-muted-foreground/60"
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
                        className="p-2 rounded-xl border border-border/70 dark:border-[#1e1e1e] hover:bg-muted/50 dark:hover:bg-[#141414]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md dark:hover:shadow-primary/10"
                      >
                        <ChevronRight className="w-5 h-5 text-muted-foreground dark:text-muted-foreground/80" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}


