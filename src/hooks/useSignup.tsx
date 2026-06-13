import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import type { RegisterDto, NewUserDto } from "../types";

const BASE = "http://localhost:5145";

export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (data: RegisterDto) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(`${BASE}/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      if (typeof json === "string") setError(json);
      else if (Array.isArray(json))
        setError(json.map((e: any) => e.description).join(" "));
      else setError(json.message ?? json.title ?? "Registration failed");
      return;
    }
    const user: NewUserDto = json;
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "LOGIN", payload: user });
    setIsLoading(false);
  };

  return { signup, isLoading, error };
};
