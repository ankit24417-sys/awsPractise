import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { api, API_BASE_URL } from "../services/api";
import type { User } from "../types";
import { UserDetailModal } from "./UserDetailModal";
import {
  Users,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  Search,
  Database,
  CheckCircle,
  Activity,
  ArrowUpRight
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const { user, refreshCurrentUser, serverStatus } = useAuth();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [syncingProfile, setSyncingProfile] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(new Date().toLocaleTimeString());
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch all users from backend API
  const loadAllUsers = useCallback(async () => {
    setLoadingUsers(true);
    setFetchError(null);
    try {
      const data = await api.getAllUsers();
      setAllUsers(data);
      setLastRefreshedAt(new Date().toLocaleTimeString());
    } catch (err: any) {
      setFetchError(err.message || "Failed to load users from backend");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    loadAllUsers();
  }, [loadAllUsers]);

  const handleSyncProfile = async () => {
    setSyncingProfile(true);
    await refreshCurrentUser();
    setSyncingProfile(false);
  };

  // Filter users by search query
  const filteredUsers = allUsers.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.mob && u.mob.toLowerCase().includes(q)) ||
      String(u.id).includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Swiss Minimalist Header Banner */}
      <div className="border border-border-subtle bg-surface p-6 sm:p-8 rounded-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-surface-subtle border border-border-subtle text-primary font-mono text-[10px] tracking-widest uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse" />
              <span>Session Authenticated · ID #{user?.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-primary">
              {user?.name || "User Dashboard"}
            </h1>
            <p className="text-xs sm:text-sm text-secondary font-mono max-w-2xl leading-relaxed">
              Active PostgreSQL session mapped to <code className="text-primary font-bold">/user/{user?.id}</code>. State and directory records synchronize with the live Express server.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSyncProfile}
              disabled={syncingProfile}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm bg-surface-subtle hover:bg-surface-hover text-primary text-xs font-mono uppercase tracking-wider border border-border-subtle transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${syncingProfile ? "animate-spin" : ""}`} />
              <span>{syncingProfile ? "Syncing..." : "Sync Profile"}</span>
            </button>
            <button
              onClick={loadAllUsers}
              disabled={loadingUsers}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm bg-primary text-canvas hover:opacity-90 text-xs font-mono uppercase tracking-wider font-semibold border border-transparent transition-opacity disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${loadingUsers ? "animate-spin" : ""}`} />
              <span>Query /allUsers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Current User Profile & API Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card (2 columns on lg) */}
        <div className="lg:col-span-2 rounded-sm border border-border-subtle bg-surface p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-sm bg-primary text-canvas flex items-center justify-center font-mono font-bold text-xs">
                <UserIcon className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight text-primary uppercase font-mono">
                  Current User Identity
                </h2>
                <p className="text-[11px] text-muted font-mono">
                  Queried via <code className="text-primary">GET /user/{user?.id}</code>
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm bg-status-success-bg text-status-success border border-status-success-border">
              Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-sm bg-surface-subtle border border-border-subtle">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                <UserIcon className="h-3 w-3" />
                <span>Full Name</span>
              </div>
              <div className="text-sm font-semibold text-primary">{user?.name}</div>
            </div>

            <div className="p-3 rounded-sm bg-surface-subtle border border-border-subtle">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                <Mail className="h-3 w-3" />
                <span>Email Address</span>
              </div>
              <div className="text-xs font-mono font-semibold text-primary truncate">{user?.email}</div>
            </div>

            <div className="p-3 rounded-sm bg-surface-subtle border border-border-subtle">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                <Phone className="h-3 w-3" />
                <span>Mobile Contact</span>
              </div>
              <div className="text-xs font-mono font-semibold text-primary">
                {user?.mob || <span className="text-muted italic font-normal">Null</span>}
              </div>
            </div>

            <div className="p-3 rounded-sm bg-surface-subtle border border-border-subtle">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                <Calendar className="h-3 w-3" />
                <span>Age Attribute</span>
              </div>
              <div className="text-sm font-semibold text-primary">
                {user?.age ? `${user.age} years` : <span className="text-muted italic font-normal">Null</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Backend API Telemetry Card */}
        <div className="rounded-sm border border-border-subtle bg-surface p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-primary">
                  System Telemetry
                </h3>
              </div>
              <div
                className={`px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider border ${
                  serverStatus === "online"
                    ? "bg-status-success-bg text-status-success border-status-success-border"
                    : "bg-status-error-bg text-status-error border-status-error-border"
                }`}
              >
                {serverStatus}
              </div>
            </div>

            <div className="mt-3 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-sm bg-surface-subtle border border-border-subtle">
                <span className="text-secondary text-[11px]">API Host:</span>
                <span className="font-semibold text-primary text-[11px] truncate">{API_BASE_URL}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-sm bg-surface-subtle border border-border-subtle">
                <span className="text-secondary text-[11px]">Database:</span>
                <span className="font-semibold text-primary text-[11px] flex items-center gap-1">
                  <Database className="h-3 w-3" /> PostgreSQL (Prisma)
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-sm bg-surface-subtle border border-border-subtle">
                <span className="text-secondary text-[11px]">Last Sync:</span>
                <span className="text-primary text-[11px]">{lastRefreshedAt}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border-subtle">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted mb-2">
              Verified REST Routes
            </p>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
              <div className="px-2 py-1 rounded-sm bg-surface-subtle text-primary border border-border-subtle flex items-center justify-between">
                <span>POST /login</span>
                <CheckCircle className="h-2.5 w-2.5 text-status-success" />
              </div>
              <div className="px-2 py-1 rounded-sm bg-surface-subtle text-primary border border-border-subtle flex items-center justify-between">
                <span>POST /register</span>
                <CheckCircle className="h-2.5 w-2.5 text-status-success" />
              </div>
              <div className="px-2 py-1 rounded-sm bg-surface-subtle text-primary border border-border-subtle flex items-center justify-between">
                <span>GET /allUsers</span>
                <CheckCircle className="h-2.5 w-2.5 text-status-success" />
              </div>
              <div className="px-2 py-1 rounded-sm bg-surface-subtle text-primary border border-border-subtle flex items-center justify-between">
                <span>GET /user/:id</span>
                <CheckCircle className="h-2.5 w-2.5 text-status-success" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registered Users Directory Section */}
      <div className="rounded-sm border border-border-subtle bg-surface p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-primary">
                PostgreSQL Directory
              </h2>
              <span className="px-2 py-0.5 rounded-sm bg-surface-subtle text-primary border border-border-subtle text-[10px] font-mono">
                {allUsers.length} Records
              </span>
            </div>
            <p className="text-xs text-secondary mt-1 font-mono">
              Live records queried via <code className="text-primary font-semibold">GET /allUsers</code>.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email..."
              className="w-full pl-8 pr-3 py-1.5 bg-surface border border-border-subtle focus:border-border-strong rounded-sm text-primary placeholder-muted text-xs font-mono transition-colors"
            />
          </div>
        </div>

        {/* Directory State */}
        {fetchError ? (
          <div className="p-3 rounded-sm bg-status-error-bg border border-status-error-border text-status-error text-xs font-mono">
            Error loading directory: {fetchError}
          </div>
        ) : loadingUsers ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary animate-spin" />
            <p className="text-xs font-mono text-muted uppercase tracking-wider">
              Querying GET /allUsers...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-muted font-mono text-xs">
            No records matched query.
          </div>
        ) : (
          <div className="overflow-x-auto border border-border-subtle rounded-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle text-secondary font-mono text-[10px] uppercase tracking-widest border-b border-border-subtle">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">ID</th>
                  <th className="py-2.5 px-4 font-semibold">Name</th>
                  <th className="py-2.5 px-4 font-semibold">Email</th>
                  <th className="py-2.5 px-4 font-semibold">Mobile</th>
                  <th className="py-2.5 px-4 font-semibold">Age</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredUsers.map((item) => {
                  const isCurrent = item.id === user?.id;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-surface-subtle transition-colors ${
                        isCurrent ? "bg-surface-subtle/60" : ""
                      }`}
                    >
                      <td className="py-2.5 px-4 font-mono text-muted tabular-nums">
                        #{item.id}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-sm bg-surface-subtle border border-border-subtle flex items-center justify-center font-mono font-bold text-primary text-[10px]">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-primary flex items-center gap-1.5">
                            {item.name}
                            {isCurrent && (
                              <span className="px-1 py-0.2 rounded-xs bg-primary text-canvas text-[9px] font-mono uppercase tracking-widest font-bold">
                                You
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-secondary">
                        {item.email}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-muted">
                        {item.mob || <span className="italic">—</span>}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-secondary tabular-nums">
                        {item.age ? `${item.age} yrs` : <span className="text-muted italic">—</span>}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedUserId(item.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-sm border border-border-subtle bg-surface hover:bg-primary hover:text-canvas text-secondary text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                          title="Inspect raw backend record"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect User Modal */}
      <UserDetailModal
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  );
};
