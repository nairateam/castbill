"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileDown, Send, CreditCard, Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useMutation } from "@/hooks/useMutation";
import { InvoiceStatus } from "@prisma/client";

interface Props {
    invoiceId: string;
    clientEmail: string;
    status: InvoiceStatus;
}

const STATUS_LABEL: Partial<Record<InvoiceStatus, string>> = {
    SENT: "Mark as sent",
    PAID: "Mark as paid",
};

export function InvoiceActions({ invoiceId, clientEmail, status }: Props) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmSend, setConfirmSend] = useState(false);
    const [email, setEmail] = useState(clientEmail);
    const router = useRouter();

    const nextStatus: InvoiceStatus | null =
        status === "DRAFT" ? "SENT"
            : status === "SENT" ? "PAID"
                : null;

    const send = useMutation({
        mutationFn: () =>
            fetch(`/api/invoice/${invoiceId}/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            }),
        successMessage: `Invoice sent to ${email}.`,
        errorMessage: "Failed to send invoice.",
    });

    const updateStatus = useMutation({
        mutationFn: () =>
            fetch(`/api/invoice/${invoiceId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            }),
        successMessage: `Invoice marked as ${nextStatus?.toLowerCase()}.`,
        errorMessage: "Failed to update status.",
    });

    const del = useMutation({
        mutationFn: () =>
            fetch(`/api/invoice/${invoiceId}`, { method: "DELETE" }),
        successMessage: "Invoice deleted.",
        errorMessage: "Failed to delete invoice.",
        onSuccess: () => router.push("/dashboard"),
        onError: () => setConfirmDelete(false),
    });

    return (
        <>
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* PDF download */}
                <a
                    href={`/api/invoice/${invoiceId}/pdf`}
                    download
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors hover:bg-[var(--bg-subtle)]"
                    style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}
                >
                    <FileDown size={13} />
                    PDF
                </a>

                {/* Send — only when DRAFT */}
                {status === "DRAFT" && (
                    <button
                        onClick={() => setConfirmSend(true)}
                        disabled={send.isLoading}
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors hover:bg-[var(--bg-subtle)]"
                        style={{
                            borderColor: "var(--border-strong)",
                            color: "var(--text-muted)",
                        }}
                    >
                        <Send size={13} />
                        Send
                    </button>
                )}

                {/* Advance status — DRAFT→SENT or SENT→PAID */}
                {nextStatus && (
                    <button
                        onClick={() => updateStatus.mutate()}
                        disabled={updateStatus.isLoading}
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-colors"
                        style={{
                            background: "var(--accent)",
                            color: "var(--accent-fg, #fff)",
                            opacity: updateStatus.isLoading ? 0.7 : 1,
                        }}
                    >
                        <CreditCard size={13} />
                        {updateStatus.isLoading ? "Updating…" : STATUS_LABEL[nextStatus]}
                    </button>
                )}

                {/* Delete */}
                <button
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors hover:bg-[var(--bg-subtle)]"
                    style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}
                >
                    <Trash2 size={13} />
                    Delete
                </button>
            </div>

            <ConfirmModal
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={del.mutate}
                loading={del.isLoading}
                title="Delete invoice?"
                description="This invoice will be permanently deleted and cannot be recovered."
                confirmLabel="Delete invoice"
            />
            <ConfirmModal
                open={confirmSend}
                onClose={() => setConfirmSend(false)}
                onConfirm={send.mutate}
                loading={send.isLoading}
                loadingLabel="Sending..."
                title="Send invoice?"
                description="Confirm or edit the recipient email before sending."
                confirmLabel="Send invoice"
                variant="default"
            >
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@email.com"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                    style={{
                        background: "var(--bg)",
                        borderColor: "var(--border)",
                        color: "var(--text-primary)",
                    }}
                />
            </ConfirmModal>
        </>
    );
}