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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center p-8 bg-card rounded-xl border border-border max-w-md w-full">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-base font-semibold text-foreground">Failed to load user</p>
          <Link
            href="/admin/users"
            className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
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
            <span className="text-foreground font-semibold">User Details</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            User Profile
          </h1>
        </div>

        <Link href="/admin/users">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </button>
        </Link>
      </div>

      {/* User Profile Card */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-muted/50 border-b border-border" />

        <div className="p-5 sm:p-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 mb-6">
            <div className="flex items-end gap-4">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.name}
                  width={96}
                  height={96}
                  className="rounded-full border-4 border-card"
                />
              ) : (
                <div className="w-24 h-24 bg-primary/10 border-4 border-card rounded-full flex items-center justify-center text-primary font-bold text-2xl">
                  {user.name?.[0]?.toUpperCase() || <User className="w-10 h-10" />}
                </div>
              )}

              <div className="mb-1">
                <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="self-start sm:self-auto">
              {user.isActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
                  <XCircle className="w-3.5 h-3.5" />
                  Inactive
                </span>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted/30 p-4 rounded-xl border border-border">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                User ID
              </div>
              <div className="text-sm font-mono font-medium text-foreground truncate">
                {user._id}
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-xl border border-border">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Role
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {user.role === "admin" ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Administrator
                    </span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      Customer
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-xl border border-border">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Account Created
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground mt-0.5">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatDate(user.createdAt)}
                </span>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-xl border border-border">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Last Updated
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground mt-0.5">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatDate(user.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Account Status Info */}
          <div className="bg-muted/30 p-4 sm:p-5 rounded-xl border border-border">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
              Account Status Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    user.isActive ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  Account is{" "}
                  <span className="font-semibold text-foreground">
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    user.isDeleted ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  Account is{" "}
                  <span className="font-semibold text-foreground">
                    {user.isDeleted ? "Deleted" : "Active (Not Deleted)"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Admin Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg transition-colors">
            Edit User
          </button>
          <button className="px-4 py-2 bg-background border border-border hover:bg-muted text-foreground text-sm font-semibold rounded-lg transition-colors">
            {user.isActive ? "Deactivate Account" : "Activate Account"}
          </button>
          <button className="px-4 py-2 bg-background border border-border hover:bg-red-500/10 text-red-500 text-sm font-semibold rounded-lg transition-colors">
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}
