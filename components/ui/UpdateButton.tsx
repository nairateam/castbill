"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const config: Record<string, { label: string; classes: string }> = {
    SENT: { label: "Mark as Sent", classes: "bg-blue-600 hover:bg-blue-500 text-white" },
    PAID: { label: "Mark as Paid", classes: "bg-emerald-600 hover:bg-emerald-500 text-white" },
};

export default function UpdateStatusButton({
    invoiceId,
    nextStatus,
}: {
    invoiceId: string;
    nextStatus: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/invoice/${invoiceId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            });
            if (!res.ok) throw new Error("Failed to update");
            toast.success(`Invoice marked as ${nextStatus.toLowerCase()}.`);
            router.refresh();
        } catch {
            toast.error("Failed to update status.");
        } finally {
            setLoading(false);
        }
    };

    const { label, classes } = config[nextStatus];

    return (
        <button
            onClick={handleUpdate}
            disabled={loading}
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${classes}`}
        >
            {loading ? "Updating..." : label}
        </button>
    );
}