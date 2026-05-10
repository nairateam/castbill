"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatAmount } from "@/lib/currency";
import { InvoiceStatus } from "@prisma/client";
import { Eye, FileDown, FileText, MoreHorizontal, SlidersHorizontal, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverItem, PopoverSeparator, PopoverTrigger } from "@/components/ui/Popover";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useMutation } from "@/hooks/useMutation";
import { EmptyState } from "../EmptyState";

type Invoice = {
    id: string;
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    total: number;
    currency: string;
    status: InvoiceStatus;
    createdAt: Date | string;
};

type Props = {
    invoices: Invoice[];
    onClearFilters?: () => void;
};

function RowActions({ invoice }: { invoice: Invoice }) {
    const [confirming, setConfirming] = useState(false);

    const del = useMutation({
        mutationFn: () => fetch(`/api/invoice/${invoice.id}`, { method: "DELETE" }),
        successMessage: "Invoice deleted.",
        errorMessage: "Failed to delete invoice.",
        onSuccess: () => setConfirming(false),
        onError: () => setConfirming(false),
    });

    return (
        <>
            <div className="flex items-center justify-end gap-1">
                <a
                    href={`/api/invoice/${invoice.id}/pdf`}
                    download
                    aria-label="Download PDF"
                    style={{ color: "var(--accent)" }}
                    className="flex items-center justify-center rounded-md p-1.5 transition-opacity hover:opacity-70"
                >
                    <FileDown size={15} />
                </a>

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
                                href={`/invoice/${invoice.id}`}
                                className="flex w-full items-center gap-2.5"
                                style={{ color: "var(--text-primary)", textDecoration: "none" }}
                            >
                                <Eye size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                                View invoice
                            </Link>
                        </PopoverItem>
                        <PopoverSeparator />
                        <PopoverItem variant="danger" onClick={() => setConfirming(true)}>
                            <Trash2 size={14} style={{ flexShrink: 0 }} />
                            Delete
                        </PopoverItem>
                    </PopoverContent>
                </Popover>
            </div >

            <ConfirmModal
                open={confirming}
                onClose={() => setConfirming(false)}
                onConfirm={del.mutate}
                loading={del.isLoading}
                title="Delete invoice?"
                description={`Invoice #${invoice.invoiceNumber} will be permanently deleted and cannot be recovered.`}
                confirmLabel="Delete invoice"
            />
        </>
    );
}

export default function InvoiceTable({ invoices, onClearFilters }: Props) {
    if (invoices.length === 0) {
        return onClearFilters ? (
            <EmptyState
                icon={SlidersHorizontal}
                title="No invoices match your filters"
                description="Try adjusting your search or status filter to find what you're looking for."
                action={{ type: "button", onClick: onClearFilters, label: "Clear filters" }}
            />
        ) : (
            <EmptyState
                icon={FileText}
                title="No invoices yet"
                description="Create your first invoice and it'll show up here."
                action={{ type: "link", href: "/invoice/new", label: "Create invoice" }}
            />
        );
    }

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
                        {["Invoice", "Client", "Amount", "Status", "Date", "Actions"].map((h) => (
                            <th
                                key={h}
                                className="text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap px-5 py-3"
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
                    {invoices.map((invoice) => (
                        <tr
                            key={invoice.id}
                            className="transition-colors hover:bg-[var(--bg-subtle)]"
                            style={{ borderBottom: "1px solid var(--border)" }}
                        >
                            <td className="px-5 py-3.5 font-mono text-sm font-medium whitespace-nowrap" style={{ color: "var(--accent)" }}>
                                #{invoice.invoiceNumber}
                            </td>
                            <td className="px-5 py-3.5 max-w-[200px]">
                                <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                    {invoice.clientName}
                                </p>
                                <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                                    {invoice.clientEmail}
                                </p>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-sm whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
                                {formatAmount(invoice.total, invoice.currency)}
                            </td>
                            <td className="px-5 py-3.5">
                                <StatusBadge status={invoice.status} />
                            </td>
                            <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                                {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </td>
                            <td className="px-5 py-3.5">
                                <RowActions invoice={invoice} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="sm:hidden divide-y" style={{ borderColor: "var(--border)" }}>
                {invoices.map((invoice) => (
                    <div
                        key={invoice.id}
                        className="px-4 py-3.5 transition-colors hover:bg-[var(--bg-subtle)]"
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                    <span className="font-mono text-xs font-medium" style={{ color: "var(--accent)" }}>
                                        #{invoice.invoiceNumber}
                                    </span>
                                    <StatusBadge status={invoice.status} />
                                </div>
                                <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                    {invoice.clientName}
                                </p>
                                <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                                    {invoice.clientEmail}
                                </p>
                            </div>
                            <RowActions invoice={invoice} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                                {formatAmount(invoice.total, invoice.currency)}
                            </span>
                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}