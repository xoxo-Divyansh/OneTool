"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { InlineSpinner } from "@/components/UI/LoadingSpinner";
import ErrorAlert from "@/components/UI/ErrorAlert";

export default function RegisterForm() {
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    setLoading(true);
    setError("");

    try {
      await register({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      });
      globalThis.location.assign("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-card">
      <div className="auth-icon-wrap">
        <span className="auth-icon" aria-hidden="true">
          OT
        </span>
      </div>

      <h2 className="auth-title">
        Create account
      </h2>

      {error && (
        <ErrorAlert
          type="error"
          message={error}
          onDismiss={() => setError("")}
        />
      )}

      <input
        name="name"
        placeholder="Full name"
        required
        autoComplete="name"
        className="auth-input"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        autoComplete="email"
        className="auth-input"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        autoComplete="new-password"
        className="auth-input"
      />

      <button
        disabled={loading}
        className="auth-submit-btn flex items-center justify-center gap-2"
      >
        {loading && <InlineSpinner />}
        {loading ? "Creating..." : "Register"}
      </button>

      <p className="auth-switch-text">
        Already have an account?{" "}
        <Link href="/auth/login" className="auth-switch-link">
          Login
        </Link>
      </p>
    </form>
  );
}
