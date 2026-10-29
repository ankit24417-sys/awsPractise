import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import type { User } from "../types";
import { X, Loader2, UserCheck, Mail, Phone, Calendar, Hash, Code, AlertCircle } from "lucide-react";

interface UserDetailModalProps {
  userId: number | null;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ userId, onClose }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUserData(null);
      return;
    }

    setLoading(true);
    setError(null);
    api.getUser(userId)
      .then((data) => {
        setUserData(data);
      })
      .catch((err: any) => {
        setError(err.message || "Failed to fetch user details from backend");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (!userId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface border border-border-strong rounded-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Architectural Swiss Divider */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle bg-surface-subtle">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary" />
            <h3 id="modal-title" className="text-xs font-mono uppercase tracking-wider font-bold text-primary">
              Record Inspector · GET /user/{userId}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
            aria-label="Close record modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <p className="text-xs font-mono text-muted uppercase tracking-wider">
                Querying /user/{userId}...
              </p>
            </div>
          ) : error ? (
            <div className="p-3 rounded-sm bg-status-error-bg border border-status-error-border text-status-error text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">API Error Response</strong>
                <p className="mt-0.5 font-mono text-[11px]">{error}</p>
              </div>
            </div>
          ) : userData ? (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-sm bg-surface-subtle border border-border-subtle">
                <div className="h-11 w-11 rounded-sm bg-primary text-canvas flex items-center justify-center font-mono font-bold text-base select-none">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-bold text-primary tracking-tight">{userData.name}</h4>
                  <p className="text-xs text-secondary font-mono">{userData.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-xs bg-surface border border-border-subtle text-muted">
                    Database ID: #{userData.id}
                  </span>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-sm bg-surface-subtle border border-border-subtle">
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                    <Mail className="h-3 w-3" />
                    <span>Email</span>
                  </div>
                  <div className="font-mono text-xs text-primary truncate">{userData.email}</div>
                </div>

                <div className="p-2.5 rounded-sm bg-surface-subtle border border-border-subtle">
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                    <Phone className="h-3 w-3" />
                    <span>Mobile</span>
                  </div>
                  <div className="font-mono text-xs text-primary">
                    {userData.mob || <span className="text-muted italic">Null</span>}
                  </div>
                </div>

                <div className="p-2.5 rounded-sm bg-surface-subtle border border-border-subtle">
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                    <Calendar className="h-3 w-3" />
                    <span>Age</span>
                  </div>
                  <div className="font-mono text-xs text-primary">
                    {userData.age ? `${userData.age} yrs` : <span className="text-muted italic">Null</span>}
                  </div>
                </div>

                <div className="p-2.5 rounded-sm bg-surface-subtle border border-border-subtle">
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                    <Hash className="h-3 w-3" />
                    <span>Primary Key</span>
                  </div>
                  <div className="font-mono text-xs text-primary">{userData.id}</div>
                </div>
              </div>

              {/* Raw JSON Payload */}
              <div>
                <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-muted mb-1.5">
                  <Code className="h-3 w-3" />
                  <span>Raw API Response Payload (JSON)</span>
                </div>
                <pre className="p-3 rounded-sm bg-canvas border border-border-subtle text-[11px] font-mono text-primary overflow-x-auto leading-relaxed">
                  {JSON.stringify(userData, null, 2)}
                </pre>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-border-subtle bg-surface-subtle flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-sm bg-surface hover:bg-surface-hover border border-border-subtle text-primary text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
