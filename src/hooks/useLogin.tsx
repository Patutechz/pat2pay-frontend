import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import type { NewUserDto } from "../types";

const BASE = "http://localhost:5145";

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(`${BASE}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(
        typeof json === "string" ? json : (json.message ?? "Login failed"),
      );
      return;
    }
    const user: NewUserDto = json;
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "LOGIN", payload: user });
    setIsLoading(false);
  };

  return { login, isLoading, error };
};
