"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSupabaseBrowser,
  isSupabaseConfigured,
} from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    if (!supabase) {
      setError("Supabase is not connected.");
      return;
    }

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setError(error.message);
        return;
      }

      if (!data?.session) {
        setError(
          "This password reset link is invalid or expired. Please request a new one."
        );
        return;
      }

      setReady(true);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);

    const supabase = getSupabaseBrowser();

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setBusy(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage("Password updated successfully. Redirecting to Admin Login...");

    await supabase.auth.signOut();

    setTimeout(() => {
      router.replace("/admin/login");
    }, 1500);
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="shell">
        <div className="config-warning">
          <h1>Supabase is not connected</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Set new password</h1>
        <p className="sub">Create a new password for your admin account.</p>

        {error && <div className="notice error">{error}</div>}

        {message && <div className="notice">{message}</div>}

        <div className="field">
          <label htmlFor="password">New password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!ready || busy}
          />
        </div>

        <div className="field">
          <label htmlFor="confirmPassword">Confirm new password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!ready || busy}
          />
        </div>

        <button
          className="btn full"
          type="submit"
          disabled={!ready || busy}
        >
          {busy ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}