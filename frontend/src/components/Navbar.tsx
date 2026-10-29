import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { API_BASE_URL } from "../services/api";
import { RefreshCw, LogOut, Sun, Moon, Database } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout, serverStatus, serverMessage, checkServer } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-surface/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand / Logo - Swiss Grid Minimal Mark */}
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 bg-primary text-canvas flex items-center justify-center font-mono font-black text-xs tracking-tighter rounded-sm shadow-sm select-none">
            CH
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-sm tracking-tight text-primary">
              NEXUS
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-muted hidden sm:inline">
              SWISS·AUTH
            </span>
          </div>
          <span className="hidden md:inline-block font-mono text-[11px] text-muted border-l border-border-subtle pl-3">
            {API_BASE_URL}
          </span>
        </div>

        {/* Server Status, Theme Toggle & User Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Server Health Badge - Swiss Status Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-mono border transition-colors ${
              serverStatus === "online"
                ? "bg-status-success-bg text-status-success border-status-success-border"
                : serverStatus === "offline"
                ? "bg-status-error-bg text-status-error border-status-error-border"
                : "bg-status-warning-bg text-status-warning border-status-warning-border"
            }`}
            title={`Status: ${serverMessage}`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                serverStatus === "online"
                  ? "bg-status-success animate-pulse"
                  : serverStatus === "offline"
                  ? "bg-status-error"
                  : "bg-status-warning"
              }`}
            />
            <span className="hidden sm:inline uppercase tracking-wider text-[10px]">
              {serverStatus === "online" ? "Online" : serverStatus === "offline" ? "Offline" : "Connecting"}
            </span>
            <button
              onClick={() => checkServer()}
              className="text-muted hover:text-primary p-0.5 rounded-sm transition-transform active:rotate-180"
              title="Ping backend"
              aria-label="Refresh backend status"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-sm border border-border-subtle bg-surface hover:bg-surface-subtle text-secondary hover:text-primary transition-colors"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          {/* User actions */}
          {user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-border-subtle">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-primary leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-muted font-mono truncate max-w-[140px]">
                  {user.email}
                </span>
              </div>

              <div className="h-7 w-7 rounded-sm bg-surface-subtle border border-border-subtle flex items-center justify-center font-mono font-bold text-primary text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-surface hover:bg-surface-subtle text-secondary hover:text-primary border border-border-subtle text-xs font-medium transition-colors"
                title="Log Out"
                aria-label="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-[11px] font-mono uppercase tracking-wider">Exit</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-muted px-2.5 py-1 rounded-sm border border-border-subtle bg-surface-subtle">
              <Database className="h-3 w-3" />
              <span>POSTGRESQL·REST</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
