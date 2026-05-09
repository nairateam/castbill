"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { InvoiceStatus } from "@prisma/client";
import InvoiceTable from "./ui/invoice/InvoiceTable";

type Invoice = {
    id: string;
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    currency: string;
    total: number;
    status: InvoiceStatus;
    createdAt: Date | string;
};

type SortField = "invoiceNumber" | "clientName" | "total" | "createdAt";
type SortDir = "asc" | "desc";

const STATUS_FILTERS = ["ALL", "DRAFT", "SENT", "PAID", "OVERDUE"] as const;

export default function InvoicesClient({ invoices }: { invoices: Invoice[] }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    const filtered = useMemo(() => {
        let list = [...invoices];

        if (statusFilter !== "ALL") {
            list = list.filter((i) => i.status === statusFilter);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (i) =>
                    i.invoiceNumber.toLowerCase().includes(q) ||
                    i.clientName.toLowerCase().includes(q) ||
                    i.clientEmail.toLowerCase().includes(q)
            );
        }

        return list;
    }, [invoices, search, statusFilter]);

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div
                    style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 sm:w-72"
                >
                    <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search invoices or clients..."
                        style={{ background: "transparent", color: "var(--text-primary)" }}
                        className="flex-1 text-sm outline-none placeholder:text-[var(--text-faint)]"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="text-[10px] transition-opacity hover:opacity-60"
                            style={{ color: "var(--text-muted)" }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Status filter tabs */}
                <div
                    style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                    className="flex items-center rounded-lg p-1 gap-0.5"
                >
                    {STATUS_FILTERS.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            style={{
                                background: statusFilter === s ? "var(--bg-raised)" : "transparent",
                                color: statusFilter === s ? "var(--text-primary)" : "var(--text-muted)",
                                boxShadow: statusFilter === s ? "var(--shadow-sm)" : "none",
                            }}
                            className="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
                        >
                            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Result count */}
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Showing{" "}
                <span style={{ color: "var(--text-primary)" }} className="font-semibold">
                    {filtered.length}
                </span>{" "}
                of {invoices.length} invoices
            </p>

            {/* Table — handles its own empty state */}
            <InvoiceTable invoices={filtered}
                onClearFilters={
                    filtered.length === 0 && invoices.length > 0
                        ? () => { setSearch(""); setStatusFilter("ALL"); }
                        : undefined
                }
            />

            {/* Clear filters — only when filtered down with no results */}
            {filtered.length === 0 && invoices.length > 0 && (
                <div className="text-center pt-2">
                    <button
                        onClick={() => { setSearch(""); setStatusFilter("ALL"); }}
                        style={{ color: "var(--accent)" }}
                        className="text-sm hover:underline underline-offset-4"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}