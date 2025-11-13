"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogIn, UserPlus } from "lucide-react";

export const AuthButtons: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/register");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        onClick={handleLogin}
        className="text-foreground hover:bg-muted rounded-xl font-bold transition-all"
        size="sm"
      >
        <LogIn className="w-4 h-4 mr-2" />
        Login
      </Button>
      <Button
        onClick={handleSignup}
        className="bg-primary hover:bg-primary/90 text-secondary rounded-xl font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        size="sm"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Sign Up
      </Button>
    </div>
  );
};
