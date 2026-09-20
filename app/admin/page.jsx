"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setChecked(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!data?.session) {
        router.replace("/admin/login");
        return;
      }
      setSession(data.session);
      setChecked(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!newSession) router.replace("/admin/login");
      else setSession(newSession);
    });

    return () => sub?.subscription?.unsubscribe();
  }, [router]);

  if (!isSupabaseConfigured) {
    return (
      <div className="shell">
        <div className="config-warning">
          <h1>Supabase is not connected</h1>
          <p>Add your keys to .env.local and restart the dev server.</p>
          <code>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</code>
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key</code>
        </div>
      </div>
    );
  }

  if (!checked || !session) {
    return (
      <div className="shell admin-wrap">
        <p style={{ color: "var(--ash)" }}>Checking your session…</p>
      </div>
    );
  }

  return <AdminDashboard session={session} />;
}
