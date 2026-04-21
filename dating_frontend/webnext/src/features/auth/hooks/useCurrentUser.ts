"use client";

import { useEffect, useState } from "react";
import api from "@/shared/lib/api";

export const useCurrentUser = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const hasToken = document.cookie.includes("access");

    if (!hasToken) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    api.get("/auth/me/")
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  return { loading, isAuthenticated };
};