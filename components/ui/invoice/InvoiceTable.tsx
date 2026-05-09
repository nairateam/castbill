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
                {/* PDF — always visible */}
                <a
                    href={`/api/invoice/${invoice.id}/pdf`}
                    download
                    aria-label="Download PDF"
                    style={{ color: "var(--accent)" }}
                    className="flex items-center justify-center rounded-md p-1.5 transition-opacity hover:opacity-70"
                >
                    <FileDown size={15} />
                </a>

                {/* More actions */}
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

                        <PopoverItem
                            variant="danger"
                            onClick={() => setConfirming(true)}
                        >
                            <Trash2 size={14} style={{ flexShrink: 0 }} />
                            Delete
                        </PopoverItem>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Confirm modal — outside the popover so it isn't clipped */}
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
            {/* Header */}
            <div
                style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-subtle)" }}
                className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-x-4 px-5 py-3"
            >
                {["Invoice", "Client", "Amount", "Status", "Date", ""].map((h) => (
                    <span
                        key={h}
                        className="text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: "var(--text-muted)" }}
                    >
                        {h}
                    </span>
                ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-[var(--border)]" style={{ borderColor: "var(--border)" }}>
                {invoices.map((invoice) => (
                    <div
                        key={invoice.id}
                        className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-x-4 px-5 py-3.5 transition-colors hover:bg-[var(--bg-subtle)]"
                    >
                        <span className="font-mono text-sm font-medium" style={{ color: "var(--accent)" }}>
                            #{invoice.invoiceNumber}
                        </span>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                {invoice.clientName}
                            </p>
                            <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                                {invoice.clientEmail}
                            </p>
                        </div>

                        <span className="font-mono text-sm" style={{ color: "var(--text-primary)" }}>
                            {formatAmount(invoice.total, invoice.currency)}
                        </span>

                        <StatusBadge status={invoice.status} />

                        <span className="text-sm whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                            {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>

                        <RowActions invoice={invoice} />
                    </div>
                ))}
            </div>
        </div>
    );
}