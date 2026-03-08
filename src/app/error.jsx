"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="error-page">
      <h1>Something went wrong</h1>
      <p>An unexpected error occurred while rendering the page.</p>
      <pre className="error-stack">{error?.message}</pre>
      <button type="button" onClick={() => reset?.()}>
        Try again
      </button>
    </div>
  );
}
