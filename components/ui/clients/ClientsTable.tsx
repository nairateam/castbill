"use client";

import { useState } from "react";
import { formatAmount } from "@/lib/currency";
import { MoreHorizontal, Trash2, FileText } from "lucide-react";
import { Popover, PopoverContent, PopoverItem, PopoverSeparator, PopoverTrigger } from "@/components/ui/Popover";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useMutation } from "@/hooks/useMutation";
import Link from "next/link";

type Client = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    createdAt: Date | string;
    _count: { invoices: number };
    invoices: { total: number; status: string }[];
};

function ClientActions({ client }: { client: Client }) {
    const [confirming, setConfirming] = useState(false);

    const del = useMutation({
        mutationFn: () => fetch(`/api/clients/${client.id}`, { method: "DELETE" }),
        successMessage: "Client deleted.",
        errorMessage: "Failed to delete client.",
        onSuccess: () => setConfirming(false),
        onError: () => setConfirming(false),
    });

    return (
        <>
            <div className="flex items-center justify-end gap-1">
                <Popover>
                    <PopoverTrigger
                        aria-label="More actions"
                        style={{
                            color: "var(--text-muted)",
                            background: "transparent",
                            border: "1px solid transparent",
                            borderRadius: "0.375rem",
                            padding: "6px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            transition: "all 0.15s",
                        }}
                        className="hover:bg-[var(--bg-subtle)] hover:!text-[var(--text-primary)]"
                    >
                        <MoreHorizontal size={15} />
                    </PopoverTrigger>

                    <PopoverContent align="end" sideOffset={6}>
                        <PopoverItem>
                            <Link
                                href={`/invoice/new?clientId=${client.id}`}
                                className="flex w-full items-center gap-2.5"
                                style={{ color: "var(--text-primary)", textDecoration: "none" }}
                            >
                                <FileText size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                                New invoice
                            </Link>
                        </PopoverItem>
                        <PopoverSeparator />
                        <PopoverItem variant="danger" onClick={() => setConfirming(true)}>
                            <Trash2 size={14} style={{ flexShrink: 0 }} />
                            Delete
                        </PopoverItem>
                    </PopoverContent>
                </Popover>
            </div>

            <ConfirmModal
                open={confirming}
                onClose={() => setConfirming(false)}
                onConfirm={del.mutate}
                loading={del.isLoading}
                title="Delete client?"
                description={`${client.name} will be permanently deleted. Their invoices will not be affected.`}
                confirmLabel="Delete client"
            />
        </>
    );
}

export default function ClientsTable({ clients }: { clients: Client[] }) {
    return (
        <div
            style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
            }}
            className="overflow-hidden rounded-xl"
        >
            <table className="hidden sm:table w-full border-collapse">
                <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-subtle)" }}>
                        {["Client", "Contact", "Invoices", "Total Billed", "Joined", "Actions"].map((h) => (
                            <th
                                key={h}
                                className="text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap px-5 py-3 text-left"
                                style={{
                                    color: "var(--text-muted)",
                                    textAlign: h === "Actions" ? "right" : "left",
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => {
                        const totalBilled = client.invoices.reduce((sum, i) => sum + i.total, 0);
                        const paidTotal = client.invoices
                            .filter((i) => i.status === "PAID")
                            .reduce((sum, i) => sum + i.total, 0);

                        return (
                            <tr
                                key={client.id}
                                className="transition-colors hover:bg-[var(--bg-subtle)]"
                                style={{ borderBottom: "1px solid var(--border)" }}
                            >
                                <td className="px-5 py-3.5">
                                    <div
                                        className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold mb-0 mr-3 inline-flex"
                                        style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                                    >
                                        {client.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                        {client.name}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>{client.email}</p>
                                    {client.phone && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{client.phone}</p>}
                                </td>
                                <td className="px-5 py-3.5 text-sm" style={{ color: "var(--text-primary)" }}>
                                    {client._count.invoices}
                                </td>
                                <td className="px-5 py-3.5">
                                    <p className="font-mono text-sm" style={{ color: "var(--text-primary)" }}>
                                        {formatAmount(totalBilled, "NGN")}
                                    </p>
                                    {paidTotal > 0 && (
                                        <p className="font-mono text-xs" style={{ color: "var(--success, #3a7d6e)" }}>
                                            {formatAmount(paidTotal, "NGN")} paid
                                        </p>
                                    )}
                                </td>
                                <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                                    {new Date(client.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </td>
                                <td className="px-5 py-3.5">
                                    <ClientActions client={client} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="sm:hidden divide-y" style={{ borderColor: "var(--border)" }}>
                {clients.map((client) => {
                    const totalBilled = client.invoices.reduce((sum, i) => sum + i.total, 0);
                    return (
                        <div
                            key={client.id}
                            className="px-4 py-3.5 transition-colors hover:bg-[var(--bg-subtle)]"
                        >
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <div
                                            className="flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold shrink-0"
                                            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                                        >
                                            {client.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                            {client.name}
                                        </p>
                                    </div>
                                    <p className="truncate text-xs ml-9" style={{ color: "var(--text-muted)" }}>
                                        {client.email}
                                    </p>
                                </div>
                                <ClientActions client={client} />
                            </div>
                            <div className="flex items-center justify-between mt-2 ml-9">
                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                    {client._count.invoices} invoice{client._count.invoices !== 1 ? "s" : ""}
                                </span>
                                <span className="font-mono text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                                    {formatAmount(totalBilled, "NGN")}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}