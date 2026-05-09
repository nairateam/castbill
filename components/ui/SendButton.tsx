"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    invoiceId: string;
    clientEmail: string;
    currentStatus: string;
}

export default function SendInvoiceButton({
    invoiceId,
    clientEmail,
    currentStatus,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const router = useRouter();

    if (currentStatus === "PAID") return null;

    async function handleSend() {
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch(`/api/invoice/${invoiceId}/send`, {
                method: "POST",
            });

            const data = await res.json();

            if (!res.ok) {
                setResult({ type: "error", message: data.error || "Something went wrong" });
            } else {
                setResult({ type: "success", message: data.message });
                router.refresh(); // re-fetches server component
            }
        } catch {
            setResult({ type: "error", message: "Network error. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                onClick={handleSend}
                disabled={loading}
                className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
                {loading ? "Sending…" : `✉ Send to ${clientEmail}`}
            </button>

            {result && (
                <p
                    className={`text-xs ${result.type === "success" ? "text-emerald-400" : "text-red-400"
                        }`}
                >
                    {result.message}
                </p>
            )}
        </div>
    );
}