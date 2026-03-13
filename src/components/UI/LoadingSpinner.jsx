/**
 * Reusable Loading Spinner Component
 * Use for tool execution, data fetching, etc.
 */
export default function LoadingSpinner({ size = "md", message, className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-white/20 border-t-emerald-400 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-sm text-white/60 animate-pulse">{message}</p>
      )}
    </div>
  );
}

/**
 * Inline Loading Spinner (for buttons, etc.)
 */
export function InlineSpinner({ className = "" }) {
  return (
    <div
      className={`inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

/**
 * Full Page Loading Overlay
 */
export function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#0f1419] border border-white/10 rounded-2xl p-8 shadow-[0_24px_48px_rgba(0,0,0,0.6)]">
        <LoadingSpinner size="lg" message={message} />
      </div>
    </div>
  );
}
