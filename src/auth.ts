/**
 * NextAuth v4 Configuration for Google & GitHub OAuth
 *
 * This handles OAuth authentication and securely syncs with the backend.
 * The backend JWT token is preserved and used for all authenticated API requests.
 *
 * Flow:
 * 1. User clicks "Continue with Google" or "Continue with GitHub"
 * 2. NextAuth redirects to provider with PKCE/state protection
 * 3. User authorizes, provider redirects back to /api/auth/callback/[provider]
 * 4. signIn callback securely forwards user data to backend POST /api/auth/oauth
 * 5. Backend finds/creates user, validates active status, and returns JWT token
 * 6. JWT token is encrypted into NextAuth session
 * 7. SessionSync hook and AuthWrapper populate Redux with backend token
 */

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

const clean = (val?: string): string =>
  val && typeof val === "string" ? val.trim() : "";

const googleClientId =
  clean(process.env.GOOGLE_CLIENT_ID) ||
  clean(process.env.AUTH_GOOGLE_ID) ||
  clean(process.env.GOOGLE_ID);

const googleClientSecret =
  clean(process.env.GOOGLE_CLIENT_SECRET) ||
  clean(process.env.AUTH_GOOGLE_SECRET) ||
  clean(process.env.GOOGLE_SECRET);

const githubClientId =
  clean(process.env.GITHUB_CLIENT_ID) ||
  clean(process.env.AUTH_GITHUB_ID) ||
  clean(process.env.GITHUB_ID);

const githubClientSecret =
  clean(process.env.GITHUB_CLIENT_SECRET) ||
  clean(process.env.AUTH_GITHUB_SECRET) ||
  clean(process.env.GITHUB_SECRET);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId || "google_client_id_placeholder",
      clientSecret: googleClientSecret || "google_client_secret_placeholder",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      checks: ["pkce", "state"],
    }),
    GitHubProvider({
      clientId: githubClientId || "github_client_id_placeholder",
      clientSecret: githubClientSecret || "github_client_secret_placeholder",
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
      checks: ["state"],
      userinfo: {
        url: "https://api.github.com/user",
        async request({ tokens }) {
          const profile = await fetch("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              "User-Agent": "LZ-Fly-App",
            },
          }).then((res) => res.json());

          // If user's primary email on GitHub is private, fetch from /user/emails
          if (!profile.email && tokens.access_token) {
            try {
              const res = await fetch("https://api.github.com/user/emails", {
                headers: {
                  Authorization: `Bearer ${tokens.access_token}`,
                  "User-Agent": "LZ-Fly-App",
                },
              });
              if (res.ok) {
                const emails = await res.json();
                if (Array.isArray(emails)) {
                  const primary =
                    emails.find((e: any) => e.primary && e.verified) ||
                    emails.find((e: any) => e.verified) ||
                    emails[0];
                  if (primary?.email) {
                    profile.email = primary.email;
                  }
                }
              }
            } catch (err) {
              console.error("Failed to fetch private GitHub email:", err);
            }
          }
          return profile;
        },
      },
    }),
  ],

  useSecureCookies: false,

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
        maxAge: 900,
      },
    },
    state: {
      name: `next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
        maxAge: 900,
      },
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    /**
     * Called after successful OAuth authentication with Google/GitHub
     * Syncs user with backend /api/auth/oauth
     */
    async signIn({ user, account, profile }) {
      try {
        if (!account || !account.provider) {
          console.error("❌ OAuth Error: Missing account credentials");
          return false;
        }

        let userEmail =
          user.email ||
          (profile as any)?.email ||
          ((profile as any)?.emails && (profile as any)?.emails[0]?.value);

        // Fallback for private GitHub emails if still not found
        if (!userEmail && account.provider === "github") {
          const login = (profile as any)?.login || user.name || "user";
          userEmail = `${account.providerAccountId}+${login}@users.noreply.github.com`;
        }

        if (!userEmail) {
          console.error("❌ OAuth Error: No verified email address returned by provider", {
            provider: account.provider,
          });
          return false;
        }

        const oauthData = {
          name:
            user.name ||
            (profile as any)?.name ||
            (profile as any)?.login ||
            userEmail.split("@")[0],
          email: userEmail,
          image:
            user.image ||
            (profile as any)?.avatar_url ||
            (profile as any)?.picture ||
            null,
          provider: account.provider,
          providerId: account.providerAccountId,
        };

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(`${apiUrl}/auth/oauth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(oauthData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error("❌ Backend OAuth sync failed:", {
            status: response.status,
            error: errorData?.message || response.statusText,
          });
          return false;
        }

        const data = await response.json();

        if (!data.success || !data.data?.token) {
          console.error("❌ Invalid response from backend OAuth sync:", data);
          return false;
        }

        // Attach backend token and backend user info to user object
        (user as any).backendToken = data.data.token;
        (user as any).backendUser = data.data.user;

        return true;
      } catch (error) {
        console.error("❌ OAuth sign-in exception:", error);
        return false;
      }
    },

    /**
     * Encrypts backend token & user data into the NextAuth JWT
     */
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.backendToken = (user as any).backendToken;
        token.backendUser = (user as any).backendUser;
      }

      if (trigger === "update" && session) {
        if (session.user) token.backendUser = session.user;
        if (session.backendToken) token.backendToken = session.backendToken;
      }

      return token;
    },

    /**
     * Exposes backendToken and user data to the client session
     */
    async session({ session, token }) {
      if (token.backendUser) {
        session.user = token.backendUser as any;
      }
      if (token.backendToken) {
        session.backendToken = token.backendToken as string;
      }

      return session;
    },

    /**
     * Controls callback URL redirects safely
     */
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        return baseUrl;
      }
      return baseUrl;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret:
    clean(process.env.NEXTAUTH_SECRET) ||
    clean(process.env.AUTH_SECRET) ||
    "lz_fly_super_secure_nextauth_encryption_secret_key_32bytes_long",

  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
