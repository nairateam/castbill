import React from "react";

type InvoiceStatus = "DRAFT" | "SENT" | "PAID";

interface StatusBadgeProps {
    status: InvoiceStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const baseStyles =
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border";

    const styles: Record<InvoiceStatus, string> = {
        DRAFT:
            "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
        SENT:
            "bg-amber-500/10 text-amber-400 border-amber-500/20",
        PAID:
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };

    const label: Record<InvoiceStatus, string> = {
        DRAFT: "Draft",
        SENT: "Sent",
        PAID: "Paid",
    };

    return (
        <span className={`${baseStyles} ${styles[status]}`}>
            {label[status]}
        </span>
    );
}