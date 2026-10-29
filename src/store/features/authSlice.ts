import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id?: string; // Optional for backward compatibility
  id?: string; // OAuth returns id instead of _id
  name: string;
  email: string;
  role: string;
  profileImage?: string | null;
  authProvider?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getInitialToken = (): string | null => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      null
    );
  }
  return null;
};

const getInitialUser = (): User | null => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
  }
  return null;
};

const initialToken = getInitialToken();
const initialUser = getInitialUser();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!(initialToken || initialUser),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token?: string }>
    ) => {
      state.user = action.payload.user;
      if (action.payload.token) {
        state.token = action.payload.token;
      }
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
