"use client"; 
// Marks this component as a Client Component in Next.js

import Link from "next/link"; // Client-side navigation
import { useAuth } from "@/hooks/useAuth";  // Custom authentication hook
import { useState } from "react"; // React state management
import { InlineSpinner } from "@/components/UI/LoadingSpinner";
import ErrorAlert from "@/components/UI/ErrorAlert";


export default function LoginForm() {

  // Access login function from auth context
  const { login } = useAuth();

  // Local UI states
  const [loading, setLoading] = useState(false); // controls button loading state
  const [error, setError] = useState(null); // stores login error message

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault(); // prevent page reload
    
    setError(null);
    setLoading(true);

    // Extract form values
    const form = new FormData(e.currentTarget);

    try {
      // Call login function with form data
      await login({
        email: form.get("email"),
        password: form.get("password"),
      });

      // Use a full navigation so auth cookies are definitely applied
      // before hitting protected server routes.
      window.location.assign("/dashboard");

    } catch (err) {
      // Show error message if login fails
      setError(err.message || "Unable to login");

    } finally {
      // Reset loading state
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-card">

      {/* App logo / initials */}
      <div className="auth-icon-wrap">
        <span className="auth-icon" aria-hidden="true">
          OT
        </span>
      </div>

      {/* Login heading */}
      <h2 className="auth-title">
        Welcome back
      </h2>

      {/* Error message display */}
      {error && (
        <ErrorAlert
          type="error"
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Email input */}
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        autoComplete="email"
        className="auth-input"
      />

      {/* Password input */}
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        autoComplete="current-password"
        className="auth-input"
      />

      {/* Submit button with loading state */}
      <button
        disabled={loading}
        className="auth-submit-btn flex items-center justify-center gap-2"
        type="submit"
      >
        {loading && <InlineSpinner />}
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* Link to registration page */}
      <p className="auth-switch-text">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="auth-switch-link">
          Register
        </Link>
      </p>

    </form>
  );
}
