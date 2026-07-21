"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRedirect, importRedirectsFromCSV } from "@/server/actions/redirects";

export function RedirectActions() {
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [error, setError] = useState("");
  const [importResult, setImportResult] = useState("");

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await createRedirect({
      fromPath: fd.get("fromPath") as string,
      toPath: fd.get("toPath") as string,
      statusCode: Number(fd.get("statusCode")) || 301,
      active: true,
    });
    if (!res.success) {
      setError(res.error ?? "Failed");
    } else {
      setShowForm(false);
      (e.target as HTMLFormElement).reset();
    }
  }

  async function handleImport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setImportResult("");
    const fd = new FormData(e.currentTarget);
    const csv = fd.get("csv") as string;
    const res = await importRedirectsFromCSV(csv);
    setImportResult(
      `Imported ${res.imported} redirects.${res.errors.length > 0 ? ` Errors: ${res.errors.join(", ")}` : ""}`
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button size="sm" onClick={() => { setShowForm(!showForm); setShowImport(false); }}>
          Add Redirect
        </Button>
        <Button size="sm" variant="outline" onClick={() => { setShowImport(!showImport); setShowForm(false); }}>
          Import CSV
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
          {error && <div className="w-full text-sm text-red-600">{error}</div>}
          <div>
            <Label htmlFor="fromPath">From Path</Label>
            <Input id="fromPath" name="fromPath" placeholder="/old-path" required className="w-48" />
          </div>
          <div>
            <Label htmlFor="toPath">To Path</Label>
            <Input id="toPath" name="toPath" placeholder="/new-path" required className="w-48" />
          </div>
          <div>
            <Label htmlFor="statusCode">Status</Label>
            <select id="statusCode" name="statusCode" className="mt-1 rounded-md border px-3 py-2 text-sm" defaultValue="301">
              <option value="301">301</option>
              <option value="302">302</option>
              <option value="307">307</option>
              <option value="308">308</option>
            </select>
          </div>
          <Button type="submit" size="sm">Add</Button>
        </form>
      )}

      {showImport && (
        <form onSubmit={handleImport} className="rounded-lg border bg-white p-4">
          <Label htmlFor="csv">CSV (from,to,status)</Label>
          <textarea
            id="csv"
            name="csv"
            rows={5}
            className="mt-1 w-full rounded-md border px-3 py-2 font-mono text-xs"
            placeholder={"from,to,status\n/old-page,/new-page,301"}
            required
          />
          {importResult && <p className="mt-2 text-sm text-green-600">{importResult}</p>}
          <Button type="submit" size="sm" className="mt-2">Import</Button>
        </form>
      )}
    </div>
  );
}
