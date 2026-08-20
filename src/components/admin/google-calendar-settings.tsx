"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GoogleCalendarStatus {
  connected: boolean;
  calendarId?: string;
  lastSync?: string;
  tokenExpiry?: string;
}

interface BatchSyncResult {
  total: number;
  created: number;
  updated: number;
  failed: number;
}

interface Props {
  labels: {
    title: string;
    connected: string;
    notConnected: string;
    connectDescription: string;
    connect: string;
    disconnect: string;
    disconnecting: string;
    syncNow: string;
    syncing: string;
    lastSync: string;
    syncComplete: string;
    total: string;
    created: string;
    updated: string;
    failed: string;
    disconnectConfirm: string;
    removeEventsOption: string;
  };
}

export function GoogleCalendarSettings({ labels }: Props) {
  const [status, setStatus] = useState<GoogleCalendarStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [removeEvents, setRemoveEvents] = useState(true);
  const [syncResult, setSyncResult] = useState<BatchSyncResult | null>(null);

  useEffect(() => {
    loadStatus();

    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "google_calendar_connected") {
      toast.success("Google Calendar connected!");
      window.history.replaceState({}, "", window.location.pathname);
    }
    const error = params.get("error");
    if (error) {
      toast.error(decodeURIComponent(error));
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/google-calendar/token");
      const data = await res.json();
      if (data.success) setStatus(data);
      else toast.error(data.error || "Failed to load status");
    } catch {
      toast.error("Failed to load status");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    window.location.href = "/api/google-calendar/auth";
  };

  const handleDisconnect = async () => {
    if (!confirm(labels.disconnectConfirm)) return;
    try {
      setDisconnecting(true);
      const params = removeEvents ? "?removeEvents=true" : "";
      const res = await fetch(`/api/google-calendar/token${params}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ connected: false });
        setSyncResult(null);
        toast.success("Disconnected");
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to disconnect");
    } finally {
      setDisconnecting(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      setSyncResult(null);
      const res = await fetch("/api/google-calendar/sync/batch", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setSyncResult(data.result);
        await loadStatus();
        toast.success(labels.syncComplete);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{labels.title}</h2>

      {status?.connected ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{labels.connected}</p>
          </div>

          {status.lastSync && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {labels.lastSync}:{" "}
              {new Date(status.lastSync).toLocaleString()}
            </p>
          )}

          {syncResult && (
            <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-800 dark:bg-blue-900/20">
              <p className="mb-1 font-medium text-gray-900 dark:text-gray-100">{labels.syncComplete}</p>
              <p className="text-gray-700 dark:text-gray-300">
                {labels.total}: {syncResult.total} | {labels.created}:{" "}
                {syncResult.created} | {labels.updated}: {syncResult.updated}
              </p>
              {syncResult.failed > 0 && (
                <p className="text-red-600 dark:text-red-400">
                  {labels.failed}: {syncResult.failed}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleSync} disabled={syncing}>
              {syncing ? labels.syncing : labels.syncNow}
            </Button>
            <div className="flex items-center gap-3">
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                disabled={disconnecting}
              >
                {disconnecting ? labels.disconnecting : labels.disconnect}
              </Button>
              <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={removeEvents}
                  onChange={(e) => setRemoveEvents(e.target.checked)}
                  disabled={disconnecting}
                  className="rounded"
                />
                {labels.removeEventsOption}
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-400" />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{labels.notConnected}</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {labels.connectDescription}
          </p>
          <Button onClick={handleConnect}>{labels.connect}</Button>
        </div>
      )}
    </div>
  );
}
