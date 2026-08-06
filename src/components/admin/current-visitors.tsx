"use client";

import { useEffect, useState } from "react";

interface Visitor {
  path: string;
  lastSeen: string;
  userAgent: string | null;
}

interface CurrentVisitorsData {
  count: number;
  visitors: Visitor[];
}

export function CurrentVisitors({ labels }: { labels: { currentVisitors: string; path: string; lastSeen: string; noActiveVisitors: string; onlineNow: string } }) {
  const [data, setData] = useState<CurrentVisitorsData | null>(null);

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const res = await fetch("/api/analytics/current");
        if (res.ok && active) {
          setData(await res.json());
        }
      } catch {
        // ignore
      }
    }

    poll();
    const interval = setInterval(poll, 15_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (!data) return null;

  function parseUA(ua: string | null) {
    if (!ua) return "Unknown";
    if (ua.includes("Mobile")) return "Mobile";
    if (ua.includes("Tablet")) return "Tablet";
    return "Desktop";
  }

  return (
    <div className="rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
        </span>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {labels.currentVisitors}
        </h3>
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
          {data.count} {labels.onlineNow}
        </span>
      </div>

      {data.visitors.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">{labels.noActiveVisitors}</p>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-gray-500 dark:border-gray-600 dark:text-gray-400">
              <tr>
                <th className="pb-1.5 pr-3 font-medium">{labels.path}</th>
                <th className="pb-1.5 pr-3 font-medium">Device</th>
                <th className="pb-1.5 font-medium">{labels.lastSeen}</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {data.visitors.map((v, i) => (
                <tr key={i}>
                  <td className="py-1.5 pr-3 font-mono text-gray-700 dark:text-gray-300">
                    {v.path}
                  </td>
                  <td className="py-1.5 pr-3 text-gray-600 dark:text-gray-400">
                    {parseUA(v.userAgent)}
                  </td>
                  <td className="py-1.5 text-gray-500 dark:text-gray-400">
                    {new Date(v.lastSeen).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
