/**
 * Session Sync Hook
 *
 * Syncs NextAuth OAuth session with Redux store.
 * Call this hook in your root layout or app component.
 *
 * When user logs in with Google/GitHub (OAuth):
 * 1. NextAuth stores session
 * 2. This hook reads session
 * 3. Extracts YOUR backend token
 * 4. Stores in Redux (same as regular login)
 * 5. All API calls use YOUR token automatically
 *
 * When user logs in with email/password (local):
 * - Redux stores user data directly (no NextAuth session)
 * - This hook does NOT interfere with local auth
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
    if (
      status === "authenticated" &&
      session?.backendToken &&
      !isAuthenticated
    ) {
      // Sync NextAuth session to Redux (for OAuth users)
      dispatch(
        setCredentials({
          user: session.user,
          token: session.backendToken
        })
      );
    } else if (
      status === "unauthenticated" &&
      isAuthenticated &&
      user?.authProvider !== "local"
    ) {
      // Only clear Redux if the user was authenticated via OAuth
      // Don't clear for regular email/password users (authProvider === "local")
      dispatch(logout());
    }
  }, [session, status, dispatch, isAuthenticated, user]);

  return { session, status };
}
