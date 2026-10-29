"use client";

import React, { useEffect, useState } from "react";
import { useGetProfileQuery } from "../services/api";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCredentials, logout } from "../store/features/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LZLoader from "./LZLoader";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const [authChecked, setAuthChecked] = useState(false);

  // Read NextAuth session status
  const { data: session, status: sessionStatus } = useSession();

  // Sync NextAuth OAuth credentials immediately when available
  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.backendToken) {
      if (!user || !token || token !== session.backendToken) {
        dispatch(
          setCredentials({
            user: session.user,
            token: session.backendToken,
          })
        );
      }
      setAuthChecked(true);
    }
  }, [sessionStatus, session, user, token, dispatch]);

  // Fetch profile from backend; skip while NextAuth is loading to prevent false 401
  const { data, error, isLoading, isSuccess, isError } = useGetProfileQuery(
    undefined,
    {
      skip: sessionStatus === "loading",
    }
  );

  useEffect(() => {
    if (data && data.data) {
      dispatch(
        setCredentials({
          user: data.data,
        })
      );
      setAuthChecked(true);
    } else if (error) {
      const errorData = error as { status?: number };
      if (errorData?.status === 401 || errorData?.status === 403) {
        // Only clear credentials if not actively authenticated via OAuth
        if (sessionStatus === "unauthenticated") {
          dispatch(logout());
        }
      }
      setAuthChecked(true);
    }
  }, [data, error, dispatch, sessionStatus]);

  useEffect(() => {
    if (isSuccess || isError) {
      setAuthChecked(true);
    }
  }, [isSuccess, isError]);

  // Redirect handling
  useEffect(() => {
    // Skip public routes
    if (
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/" ||
      pathname.startsWith("/designs") ||
      pathname === "/pricing" ||
      pathname === "/about" ||
      pathname === "/contact" ||
      pathname.startsWith("/categories")
    ) {
      setAuthChecked(true);
      return;
    }

    // Wait until both NextAuth and backend profile check have resolved
    if (sessionStatus === "loading" || (!authChecked && isLoading)) {
      return;
    }

    const isProtectedRoute =
      pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

    const effectiveUser = user || (sessionStatus === "authenticated" ? session?.user : null);

    if (isProtectedRoute && !effectiveUser) {
      router.push("/login");
    } else if (
      pathname.startsWith("/admin") &&
      effectiveUser &&
      effectiveUser.role !== "admin" &&
      effectiveUser.role !== "super_admin"
    ) {
      router.push("/");
    }
  }, [pathname, user, session, sessionStatus, authChecked, isLoading, router]);

  // Logged-in users should not view login or register
  const effectiveUser = user || (sessionStatus === "authenticated" ? session?.user : null);
  if (effectiveUser && (pathname === "/login" || pathname === "/register")) {
    router.push("/");
    return null;
  }

  // Clean, lightweight loading indicator for protected routes
  if (
    (sessionStatus === "loading" || (isLoading && !effectiveUser)) &&
    pathname !== "/login" &&
    pathname !== "/register" &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))
  ) {
    return <LZLoader label="Authenticating" />;
  }

  return <>{children}</>;
};
