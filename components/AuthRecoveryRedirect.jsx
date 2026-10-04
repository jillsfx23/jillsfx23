"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseClient";

export default function AuthRecoveryRedirect() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    if (!supabase) return;

    const goToResetPassword = () => {
      window.location.replace("/admin/reset-password");
    };

    // Recovery link opened with access token in URL
    if (window.location.hash.includes("access_token=")) {
      goToResetPassword();
      return;
    }

    // Supabase recovery event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        goToResetPassword();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}