"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseClient";

export default function AuthRecoveryRedirect() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    if (!supabase) return;

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