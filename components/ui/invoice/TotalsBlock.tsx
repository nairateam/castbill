import { formatAmount } from "@/lib/currency";

type Props = {
    subtotal: number;
    tax: number;
    taxRate?: number;
    discount: number;
    total: number;
    currency: string;
};

export default function TotalsBlock({ subtotal, tax, taxRate, discount, total, currency }: Props) {
    const rows = [
        { label: "Subtotal", value: subtotal },
        { label: taxRate !== undefined ? `Tax (${taxRate}%)` : "Tax", value: tax },
        { label: "Discount", value: -discount },
    ];

    return (
        <div className="flex justify-end">
            <div className="w-60">
                {rows.map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-1 text-xs" style={{ color: "var(--text-muted)" }}>
                        <span>{label}</span>
                        <span className="font-mono">
                            {value < 0 ? "−" : ""}{formatAmount(value, currency)}
                        </span>
                    </div>
                ))}
                <div
                    className="flex justify-between pt-3 mt-1 border-t items-baseline"
                    style={{ borderColor: "var(--border-strong)" }}
                >
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Total Due</span>
                    <span className="font-mono text-xl font-semibold" style={{ color: "var(--accent)" }}>
                        {formatAmount(Math.max(0, total), currency)}
                    </span>
                </div>
            </div>
        </div>
    );
}