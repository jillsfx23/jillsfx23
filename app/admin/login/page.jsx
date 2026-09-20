"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // If a session already exists, skip the form.
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) router.replace("/admin");
    });
  }, [router]);

  if (!isSupabaseConfigured) {
    return (
      <div className="shell">
        <div className="config-warning">
          <h1>Supabase is not connected</h1>
          <p>Create a file called .env.local in the project root with these two lines:</p>
          <code>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</code>
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key</code>
          <p>Then restart the dev server.</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    const supabase = getSupabaseBrowser();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setBusy(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.replace("/admin");
  }

  return (
    <div className="shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Admin access</h1>
        <p className="sub">Sign in to manage the portfolio.</p>

        {error && <div className="notice error">{error}</div>}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn full" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p style={{ marginTop: "1.5rem", fontSize: "0.8rem" }}>
          <Link className="back-link" href="/">
            ← Back to site
          </Link>
        </p>
      </form>
    </div>
  );
}
