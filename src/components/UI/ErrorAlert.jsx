import { AlertCircle, XCircle, AlertTriangle, X } from "lucide-react";

/**
 * Standardized Error Alert Component
 * Consistent error UI across all tools
 */
export default function ErrorAlert({
  type = "error",
  title,
  message,
  onDismiss,
  action,
  className = "",
}) {
  const styles = {
    error: {
      container: "border-red-500/50 bg-red-500/10",
      icon: "text-red-400",
      title: "text-red-200",
      message: "text-red-300/80",
      IconComponent: XCircle,
    },
    warning: {
      container: "border-yellow-500/50 bg-yellow-500/10",
      icon: "text-yellow-400",
      title: "text-yellow-200",
      message: "text-yellow-300/80",
      IconComponent: AlertTriangle,
    },
    info: {
      container: "border-blue-500/50 bg-blue-500/10",
      icon: "text-blue-400",
      title: "text-blue-200",
      message: "text-blue-300/80",
      IconComponent: AlertCircle,
    },
  };

  const style = styles[type] || styles.error;
  const Icon = style.IconComponent;

  return (
    <div
      className={`border rounded-xl p-4 ${style.container} ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.icon}`} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-medium text-sm mb-1 ${style.title}`}>
              {title}
            </h4>
          )}
          <p className={`text-sm ${style.message}`}>{message}</p>

          {/* Action Button */}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-3 text-sm font-medium underline hover:no-underline transition-all"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-white/40 hover:text-white/60 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Inline Error (for form fields, etc.)
 */
export function InlineError({ message, className = "" }) {
  return (
    <div className={`flex items-center gap-2 text-red-400 text-sm ${className}`}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

/**
 * Error Toast (for notifications)
 * Note: This is a simple version. For production, use a toast library like react-hot-toast
 */
export function ErrorToast({ message, onClose }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-slide-up">
      <div className="bg-[#0f1419] border border-red-500/50 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.6)] p-4">
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-200 flex-1">{message}</p>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
