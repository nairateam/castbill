"use client";

import { useState } from "react";
import { Client } from "@/hooks/useClients";
import { Users, Plus, Check } from "lucide-react";

type Props = {
    clients: Client[];
    onSelect: (client: Client | null) => void;
    selectedId: string | null;
    inputCls: string;
    labelCls: string;
    saveClient: boolean;
    onSaveClientChange: (v: boolean) => void;
};

export default function ClientSelector({
    clients,
    onSelect,
    selectedId,
    inputCls,
    labelCls,
    saveClient,
    onSaveClientChange,
}: Props) {
    const [mode, setMode] = useState<"select" | "new">(clients.length > 0 ? "select" : "new");

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const client = clients.find((c) => c.id === e.target.value) ?? null;
        onSelect(client);
    };

    return (
        <div className="mb-4">
            {clients.length > 0 && (
                <div
                    className="flex rounded-lg overflow-hidden mb-4 border"
                    style={{ borderColor: "var(--border-strong)" }}
                >
                    <button
                        type="button"
                        onClick={() => { setMode("select"); onSelect(null); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium transition-colors"
                        style={{
                            background: mode === "select" ? "var(--accent)" : "var(--bg-raised)",
                            color: mode === "select" ? "var(--accent-fg)" : "var(--text-muted)",
                        }}
                    >
                        <Users size={13} />
                        Existing Client
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMode("new"); onSelect(null); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium transition-colors"
                        style={{
                            background: mode === "new" ? "var(--accent)" : "var(--bg-raised)",
                            color: mode === "new" ? "var(--accent-fg)" : "var(--text-muted)",
                        }}
                    >
                        <Plus size={13} />
                        New Client
                    </button>
                </div>
            )}

            {mode === "select" && clients.length > 0 && (
                <div>
                    <label className={labelCls}>Select client</label>
                    <select
                        className={inputCls}
                        value={selectedId ?? ""}
                        onChange={handleSelect}
                    >
                        <option value="">— Choose a client —</option>
                        {clients.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name} ({c.email})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {mode === "new" && (
                <label
                    className="flex items-center gap-2 cursor-pointer mt-1"
                    style={{ color: "var(--text-muted)" }}
                >
                    <div
                        onClick={() => onSaveClientChange(!saveClient)}
                        className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                        style={{
                            background: saveClient ? "var(--accent)" : "transparent",
                            borderColor: saveClient ? "var(--accent)" : "var(--border-strong)",
                        }}
                    >
                        {saveClient && <Check size={10} color="white" />}
                    </div>
                    <span className="text-xs">Save this client for future invoices</span>
                </label>
            )}
        </div>
    );
}