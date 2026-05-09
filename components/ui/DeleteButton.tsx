"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteInvoiceButton({
    invoiceId,
    redirectTo,
}: {
    invoiceId: string;
    redirectTo?: string;
}) {
    const router = useRouter();
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirming) return setConfirming(true);
        setLoading(true);
        try {
            const res = await fetch(`/api/invoice/${invoiceId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Invoice deleted.");
            if (redirectTo) router.push(redirectTo);
            else router.refresh();
        } catch {
            toast.error("Failed to delete invoice.");
        } finally {
            setLoading(false);
            setConfirming(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            onBlur={() => setConfirming(false)}
            disabled={loading}
            className={`text-xs transition-colors ${confirming
                    ? "text-red-400 hover:text-red-300"
                    : "text-zinc-600 hover:text-red-400"
                }`}
        >
            {loading ? "Deleting..." : confirming ? "Confirm?" : "Delete"}
        </button>
    );
}