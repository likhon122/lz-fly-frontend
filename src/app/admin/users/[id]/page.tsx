"use client";

import { use } from "react";
import { useGetUserQuery } from "@/services/api";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  ShieldCheck,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data, isLoading, error } = useGetUserQuery(id);
  const user = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium">Failed to load user</p>
          <Link
            href="/admin/users"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:text-primary/90"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="hover:text-primary transition-colors">
            Admin
          </Link>
          <span>/</span>
          <Link
            href="/admin/users"
            className="hover:text-primary transition-colors"
          >
            Users
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">User Details</span>
        </div>

        {/* Back Button */}
        <Link href="/admin/users">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-card/90 backdrop-blur-xl border border-border/80 dark:bg-[#141414]/90 rounded-lg hover:bg-primary/10 hover:border-primary/40 transition-all shadow-lg dark:shadow-primary/20">
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </button>
        </Link>

        {/* User Profile Card */}
        <div className="bg-card/95 dark:bg-[#141414]/95 rounded-3xl shadow-2xl dark:shadow-primary/20 border border-border/80 overflow-hidden relative">
          <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 blur-3xl pointer-events-none" />
          {/* Header with gradient */}
          <div className="h-32 bg-gradient-to-r from-primary/70 via-primary to-primary/90 dark:from-primary/40 dark:via-primary/60 dark:to-primary/20"></div>

          <div className="relative px-8 pb-8">
            {/* Profile Image and Basic Info */}
            <div className="flex items-start gap-6 -mt-16 mb-6">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="rounded-full border-4 border-background dark:border-[#0a0a0a] shadow-2xl dark:shadow-primary/30"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-primary/60 via-primary to-primary/90 rounded-full border-4 border-background dark:border-[#0a0a0a] shadow-2xl flex items-center justify-center">
                  <User className="w-16 h-16 text-secondary-foreground" />
                </div>
              )}

              <div className="flex-1 mt-16">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      {user.name}
                    </h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 dark:text-emerald-300">
                      <CheckCircle className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-500/10 text-red-600 border border-red-500/30 dark:text-red-400">
                      <XCircle className="w-4 h-4" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User ID */}
              <div className="bg-gradient-to-br from-white/70 via-white/30 to-white/10 dark:from-[#141414] dark:via-[#0f0f0f] dark:to-[#0a0a0a] p-6 rounded-xl border border-border/70 shadow-lg dark:shadow-primary/10">
                <div className="text-sm text-muted-foreground mb-1 font-medium">
                  User ID
                </div>
                <div className="text-lg font-mono text-foreground">
                  {user._id}
                </div>
              </div>

              {/* Role */}
              <div className="bg-gradient-to-br from-white/70 via-white/30 to-white/10 dark:from-[#141414] dark:via-[#0f0f0f] dark:to-[#0a0a0a] p-6 rounded-xl border border-border/70 shadow-lg dark:shadow-primary/10">
                <div className="text-sm text-muted-foreground mb-1 font-medium">
                  Role
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {user.role === "admin" ? (
                    <>
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span className="text-lg font-semibold text-foreground">
                        Administrator
                      </span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="text-lg font-semibold text-foreground">
                        Customer
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Account Created */}
              <div className="bg-gradient-to-br from-white/70 via-white/30 to-white/10 dark:from-[#141414] dark:via-[#0f0f0f] dark:to-[#0a0a0a] p-6 rounded-xl border border-border/70 shadow-lg dark:shadow-primary/10">
                <div className="text-sm text-muted-foreground mb-1 font-medium">
                  Account Created
                </div>
                <div className="flex items-center gap-2 text-foreground mt-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-base text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>

              {/* Last Updated */}
              <div className="bg-gradient-to-br from-white/70 via-white/30 to-white/10 dark:from-[#141414] dark:via-[#0f0f0f] dark:to-[#0a0a0a] p-6 rounded-xl border border-border/70 shadow-lg dark:shadow-primary/10">
                <div className="text-sm text-muted-foreground mb-1 font-medium">
                  Last Updated
                </div>
                <div className="flex items-center gap-2 text-foreground mt-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-base text-muted-foreground">
                    {formatDate(user.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="mt-6 p-6 bg-gradient-to-br from-primary/15 via-primary/10 to-transparent dark:from-primary/10 dark:via-[#141414] dark:to-[#0a0a0a] rounded-xl border border-primary/30 dark:border-primary/20 shadow-lg dark:shadow-primary/10">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Account Status
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.isActive ? "bg-green-500" : "bg-red-500"
                    } ${user.isActive ? "animate-pulse" : ""}`}
                  />
                  <span className="text-sm text-muted-foreground">
                    Account is{" "}
                    <span className="font-semibold">
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.isDeleted ? "bg-red-500" : "bg-green-500"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground">
                    Account is{" "}
                    <span className="font-semibold">
                      {user.isDeleted ? "Deleted" : "Not Deleted"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="bg-card/95 dark:bg-[#141414]/95 rounded-3xl shadow-2xl dark:shadow-primary/20 border border-border/80 p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 blur-3xl pointer-events-none" />
          <h3 className="relative text-lg font-semibold text-foreground mb-4">
            Admin Actions
          </h3>
          <div className="relative flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-primary/90 text-primary-foreground rounded-lg hover:bg-primary transition-all shadow-lg hover:shadow-primary/30">
              Edit User
            </button>
            <button className="px-4 py-2 bg-amber-500/90 text-secondary-foreground rounded-lg hover:bg-amber-500 transition-all shadow-lg hover:shadow-amber-500/40">
              {user.isActive ? "Deactivate Account" : "Activate Account"}
            </button>
            <button className="px-4 py-2 bg-red-500/90 text-secondary-foreground rounded-lg hover:bg-red-500 transition-all shadow-lg hover:shadow-red-500/40">
              Delete User
            </button>
          </div>
          <p className="relative text-xs text-muted-foreground mt-4">
            Note: Admin actions are not implemented yet. This is a UI preview.
          </p>
        </div>
      </div>
    </div>
  );
}
