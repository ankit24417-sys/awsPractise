import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/Navbar";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { Dashboard } from "./components/Dashboard";
import { Database, Lock, Code2, Globe, Shield } from "lucide-react";

const MainContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Swiss Typographic Architecture */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-surface-subtle border border-border-subtle text-primary font-mono text-[10px] tracking-widest uppercase font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>PostgreSQL · Express · Dynamic REST System</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-primary leading-[1.08]">
              Dynamic User Identity &amp; Record Control
            </h1>
            <p className="text-sm sm:text-base text-secondary font-mono leading-relaxed max-w-xl">
              100% dynamic architecture. No static mocks. All account mutations and authentication sessions execute direct queries on the live PostgreSQL backend.
            </p>
          </div>

          {/* Feature Grid - Swiss Modular Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-sm bg-surface border border-border-subtle flex items-start gap-3">
              <div className="h-7 w-7 rounded-sm bg-surface-subtle border border-border-subtle flex items-center justify-center text-primary shrink-0 font-mono text-xs font-bold">
                <Database className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-primary">
                  Prisma ORM
                </h2>
                <p className="text-xs text-secondary mt-1 font-mono leading-normal">
                  Strict schema mapping for credentials, contact numbers, and numeric age.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-sm bg-surface border border-border-subtle flex items-start gap-3">
              <div className="h-7 w-7 rounded-sm bg-surface-subtle border border-border-subtle flex items-center justify-center text-primary shrink-0 font-mono text-xs font-bold">
                <Code2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-primary">
                  Live REST API
                </h2>
                <p className="text-xs text-secondary mt-1 font-mono leading-normal">
                  HTTP routes with precise status headers: 200 OK, 201 Created, 401 Unauthorized, 409 Conflict.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-sm bg-surface border border-border-subtle flex items-start gap-3">
              <div className="h-7 w-7 rounded-sm bg-surface-subtle border border-border-subtle flex items-center justify-center text-primary shrink-0 font-mono text-xs font-bold">
                <Lock className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-primary">
                  State Verification
                </h2>
                <p className="text-xs text-secondary mt-1 font-mono leading-normal">
                  Real-time uniqueness checks on emails and credential matching.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-sm bg-surface border border-border-subtle flex items-start gap-3">
              <div className="h-7 w-7 rounded-sm bg-surface-subtle border border-border-subtle flex items-center justify-center text-primary shrink-0 font-mono text-xs font-bold">
                <Globe className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-primary">
                  Live Telemetry
                </h2>
                <p className="text-xs text-secondary mt-1 font-mono leading-normal">
                  Health-check polling ensures direct insight into backend reachability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Card */}
        <div className="lg:col-span-5">
          <div className="rounded-sm border border-border-subtle bg-surface p-6 sm:p-7 shadow-sm">
            {/* Tab Selector - Swiss Toggle Segment */}
            <div className="grid grid-cols-2 p-1 mb-6 rounded-sm bg-surface-subtle border border-border-subtle text-xs font-mono uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`py-1.5 px-3 rounded-xs font-bold transition-all cursor-pointer ${
                  authMode === "login"
                    ? "bg-primary text-canvas shadow-xs"
                    : "text-secondary hover:text-primary"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`py-1.5 px-3 rounded-xs font-bold transition-all cursor-pointer ${
                  authMode === "register"
                    ? "bg-primary text-canvas shadow-xs"
                    : "text-secondary hover:text-primary"
                }`}
              >
                Register
              </button>
            </div>

            {/* Form Rendering */}
            {authMode === "login" ? (
              <LoginForm onSwitchToRegister={() => setAuthMode("register")} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setAuthMode("login")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-canvas text-primary flex flex-col selection:bg-primary selection:text-canvas transition-colors">
          <Navbar />
          <main className="flex-1">
            <MainContent />
          </main>
          <footer className="border-t border-border-subtle py-4 text-xs font-mono text-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span>NEXUS AUTH · SWISS MINIMALIST INTERFACE</span>
              </div>
              <div className="text-[11px] text-secondary">
                REST PORT 3000 · VITE REACT 18
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
