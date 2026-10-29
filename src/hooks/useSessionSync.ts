/**
 * Session Sync Hook
 *
 * Synchronizes NextAuth OAuth session state with the Redux store.
 * Ensures backend JWT token received from Google/GitHub OAuth is stored
 * in Redux so all RTK Query API calls include the proper Authorization header.
 */

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, logout } from "@/store/features/authSlice";

export function useSessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (status === "authenticated" && session?.backendToken) {
      // Sync NextAuth session to Redux if not yet authenticated or token differs
      if (!isAuthenticated || !user) {
        dispatch(
          setCredentials({
            user: session.user,
            token: session.backendToken,
          })
        );
      }
    } else if (
      status === "unauthenticated" &&
      isAuthenticated &&
      (user?.authProvider === "google" || user?.authProvider === "github")
    ) {
      // Clear Redux if the OAuth session expired or user signed out of OAuth
      // Does not interfere with local password logins
      dispatch(logout());
    }
  }, [session, status, dispatch, isAuthenticated, user]);

  return { session, status };
}
