import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login, isLoading, serverStatus } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage("Both email and password are required.");
      return;
    }

    const res = await login({ email, password });
    if (!res.success) {
      setErrorMessage(res.error || "Failed to log in.");
    } else {
      setSuccessMessage(res.message || "Authentication verified.");
    }
  };

  const handleSelectDemoUser = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
          Identity Verification
        </div>
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Sign In
        </h2>
        <p className="text-xs text-secondary mt-1">
          Authenticate with registered credentials in the PostgreSQL database.
        </p>
      </div>

      {serverStatus === "offline" && (
        <div className="mb-4 p-3 rounded-sm bg-status-warning-bg border border-status-warning-border text-status-warning text-xs flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong className="font-semibold block">Server Unreachable</strong>
            The API at localhost:3000 is not responding. Ensure the backend process is running.
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 rounded-sm bg-status-error-bg border border-status-error-border text-status-error text-xs flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong className="font-semibold block">Authentication Error</strong>
            {errorMessage}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-sm bg-status-success-bg border border-status-success-border text-status-success text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-secondary mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              autoComplete="email"
              className="w-full pl-9 pr-3 py-2 bg-surface border border-border-subtle focus:border-border-strong text-primary placeholder-muted rounded-sm text-xs font-mono transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-secondary mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full pl-9 pr-9 py-2 bg-surface border border-border-subtle focus:border-border-strong text-primary placeholder-muted rounded-sm text-xs font-mono transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-primary transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2.5 px-4 bg-primary text-canvas hover:opacity-90 active:scale-[0.99] font-mono uppercase tracking-widest text-xs font-semibold rounded-sm border border-transparent transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Authenticate</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-5 text-center text-xs text-secondary">
        Need an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-primary font-semibold underline underline-offset-4 decoration-border-strong hover:opacity-80 transition-opacity"
        >
          Create account
        </button>
      </div>

      {/* Quick Fill Demo Records */}
      <div className="mt-6 pt-4 border-t border-border-subtle">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted mb-2">
          Test With Live Database Records
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleSelectDemoUser("alice@example.com", "secretpassword")}
            className="p-2 text-left rounded-sm bg-surface-subtle hover:bg-surface-hover border border-border-subtle text-primary transition-colors font-mono"
          >
            <div className="font-semibold text-xs text-primary truncate">Alice Johnson</div>
            <div className="text-[10px] text-muted truncate">alice@example.com</div>
          </button>
          <button
            type="button"
            onClick={() => handleSelectDemoUser("david.miller@example.com", "mypassword123")}
            className="p-2 text-left rounded-sm bg-surface-subtle hover:bg-surface-hover border border-border-subtle text-primary transition-colors font-mono"
          >
            <div className="font-semibold text-xs text-primary truncate">David Miller</div>
            <div className="text-[10px] text-muted truncate">david.miller@example.com</div>
          </button>
        </div>
      </div>
    </div>
  );
};
