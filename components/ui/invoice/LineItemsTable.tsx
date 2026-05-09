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
            <table className="w-full border-collapse">
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
                            style={{
                                borderBottom: i < items.length - 1 ? "0.5px solid var(--border)" : "none",
                            }}
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
        </div>
    );
}