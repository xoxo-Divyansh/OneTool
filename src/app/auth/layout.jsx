import "./auth.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-glow auth-glow-left" />
      <div className="auth-glow auth-glow-right" />
      <div className="auth-grid-overlay" />

      <div className="auth-content">{children}</div>
    </div>
  );
}
