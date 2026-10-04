"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseClient";

export default function AuthRecoveryRedirect() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    if (!supabase) return;

    // Handle recovery link already present in the URL
    const hash = window.location.hash;

    if (hash.includes("access_token=")) {
      router.replace("/admin/reset-password");
      return;
    }

    // Also handle PASSWORD_RECOVERY event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        router.replace("/admin/reset-password");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}