"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseClient";

export default function AuthRecoveryRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check the recovery token BEFORE creating the Supabase client.
    const hash = window.location.hash;

    if (hash.includes("access_token=")) {
      window.location.replace("/admin/reset-password");
      return;
    }

    const supabase = getSupabaseBrowser();

    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        window.location.replace("/admin/reset-password");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}