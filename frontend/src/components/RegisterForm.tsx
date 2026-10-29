import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Phone, Calendar, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, isLoading, serverStatus } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mob: "",
    age: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Strict validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMessage("Full Name, Email, and Password are required fields.");
      return;
    }

    if (formData.password.length < 4) {
      setErrorMessage("Password must be at least 4 characters long.");
      return;
    }

    if (formData.age && (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120)) {
      setErrorMessage("Please enter a valid age between 1 and 120.");
      return;
    }

    const res = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      mob: formData.mob,
      age: formData.age ? Number(formData.age) : undefined,
    });

    if (!res.success) {
      setErrorMessage(res.error || "Registration rejected by backend.");
    } else {
      setSuccessMessage(res.message || "Record created in database. Entering system...");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
          New User Registration
        </div>
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Create Account
        </h2>
        <p className="text-xs text-secondary mt-1">
          Store record directly in PostgreSQL via the REST registration endpoint.
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
            <strong className="font-semibold block">Registration Rejected</strong>
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

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-secondary mb-1">
            Full Name <span className="text-status-error">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Sarah Connor"
              required
              className="w-full pl-9 pr-3 py-2 bg-surface border border-border-subtle focus:border-border-strong text-primary placeholder-muted rounded-sm text-xs font-mono transition-colors"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-secondary mb-1">
            Email Address <span className="text-status-error">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sarah@example.com"
              required
              autoComplete="email"
              className="w-full pl-9 pr-3 py-2 bg-surface border border-border-subtle focus:border-border-strong text-primary placeholder-muted rounded-sm text-xs font-mono transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-secondary mb-1">
            Password <span className="text-status-error">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 4 characters"
              required
              autoComplete="new-password"
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

        {/* Phone & Age grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Mobile Phone */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-secondary mb-1">
              Mobile Phone <span className="text-[10px] text-muted">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                <Phone className="h-4 w-4" />
              </div>
              <input
                type="tel"
                name="mob"
                value={formData.mob}
                onChange={handleChange}
                placeholder="+1 555-0199"
                className="w-full pl-9 pr-3 py-2 bg-surface border border-border-subtle focus:border-border-strong text-primary placeholder-muted rounded-sm text-xs font-mono transition-colors"
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-secondary mb-1">
              Age <span className="text-[10px] text-muted">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                type="number"
                name="age"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="28"
                className="w-full pl-9 pr-3 py-2 bg-surface border border-border-subtle focus:border-border-strong text-primary placeholder-muted rounded-sm text-xs font-mono transition-colors"
              />
            </div>
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
              <span>Transmitting...</span>
            </>
          ) : (
            <>
              <span>Register Record</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-5 text-center text-xs text-secondary">
        Already registered?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary font-semibold underline underline-offset-4 decoration-border-strong hover:opacity-80 transition-opacity"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
