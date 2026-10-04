"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseClient";

export default function AuthRecoveryRedirect() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    if (!supabase) return;

    let redirected = false;

    const goToReset = () => {
      if (redirected) return;
      redirected = true;

      router.replace("/admin/reset-password");
    };

    // Listen for Supabase password recovery
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        goToReset();
      }
    });

    // Check the current URL for a recovery link
    const checkRecoveryUrl = async () => {
      const hash = window.location.hash;
      const search = window.location.search;

      const isRecovery =
        hash.includes("type=recovery") ||
        search.includes("type=recovery") ||
        search.includes("code=");

      if (!isRecovery) return;

      // Give Supabase a moment to process the recovery session
      await new Promise((resolve) => setTimeout(resolve, 500));

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        goToReset();
      }
    };

    checkRecoveryUrl();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}