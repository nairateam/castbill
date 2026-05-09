import { formatAmount } from "@/lib/currency";

type Item = {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
};

type Props = {
    items: Item[];
    currency: string;
};

export default function LineItemsTable({ items, currency }: Props) {
    return (
        <div
            className="rounded-xl overflow-hidden mb-5 border"
            style={{ borderColor: "var(--border-strong)" }}
        >
            {/* Desktop table */}
            <table className="hidden sm:table w-full border-collapse">
                <thead>
                    <tr style={{ background: "var(--bg-subtle)", borderBottom: "0.5px solid var(--border-strong)" }}>
                        {["Description", "Qty", "Rate", "Amount"].map((h) => (
                            <th
                                key={h}
                                className="px-4 py-2.5 font-mono text-[9px] tracking-widest uppercase font-normal"
                                style={{
                                    color: "var(--text-faint)",
                                    textAlign: h === "Description" ? "left" : "right",
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => (
                        <tr
                            key={item.id}
                            style={{ borderBottom: i < items.length - 1 ? "0.5px solid var(--border)" : "none" }}
                        >
                            <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                                {item.description}
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                                {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                                {formatAmount(item.rate, currency)}
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                                {formatAmount(item.amount, currency)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Mobile cards */}
            <div className="sm:hidden">
                <div
                    className="px-4 py-2.5"
                    style={{ background: "var(--bg-subtle)", borderBottom: "0.5px solid var(--border-strong)" }}
                >
                    <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: "var(--text-faint)" }}>
                        Line Items
                    </span>
                </div>
                {items.map((item, i) => (
                    <div
                        key={item.id}
                        className="px-4 py-3"
                        style={{ borderBottom: i < items.length - 1 ? "0.5px solid var(--border)" : "none" }}
                    >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p className="text-sm flex-1" style={{ color: "var(--text-secondary)" }}>
                                {item.description}
                            </p>
                            <span className="font-mono text-sm font-medium shrink-0" style={{ color: "var(--text-primary)" }}>
                                {formatAmount(item.amount, currency)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                                Qty: {item.quantity}
                            </span>
                            <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                                ×
                            </span>
                            <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                                {formatAmount(item.rate, currency)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}