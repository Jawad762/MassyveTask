"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { api } from "@/axios";

export const nonProtectedRoutes = ["/auth/login", "/auth/register"];

const useAuth = () => {
  const user = useAppSelector((state) => state.main.user);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      if (nonProtectedRoutes.includes(pathname)) {
        setIsAuthenticated(true);
      } else if (!user) {
        setIsAuthenticated(false);
      } else {
        await api.get("/auth/check");
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  return { isAuthenticated, loading };
};

export default useAuth;
