"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CURRENCIES, CurrencyCode, getSymbol } from "@/lib/currency";
import TotalsBlock from "@/components/ui/invoice/TotalsBlock";

type Item = { description: string; quantity: number; rate: number };
const emptyItem = (): Item => ({ description: "", quantity: 1, rate: 0 });

export default function NewInvoicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [senderName, setSenderName] = useState("");
    const [senderEmail, setSenderEmail] = useState("");
    const [senderPhone, setSenderPhone] = useState("");
    const [senderAddress, setSenderAddress] = useState("");

    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientAddress, setClientAddress] = useState("");

    const [items, setItems] = useState<Item[]>([emptyItem()]);
    const [taxRate, setTaxRate] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [dueDate, setDueDate] = useState("");
    const [notes, setNotes] = useState("");
    const [currency, setCurrency] = useState<CurrencyCode>("NGN");

    const sym = getSymbol(currency);

    const updateItem = (i: number, field: keyof Item, value: string) => {
        setItems((prev) =>
            prev.map((item, idx) =>
                idx === i
                    ? { ...item, [field]: field === "description" ? value : parseFloat(value) || 0 }
                    : item
            )
        );
    };

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount - discount;

    const handleSubmit = async () => {
        if (!senderName || !senderEmail) return toast.error("Sender details are required.");
        if (!clientName || !clientEmail) return toast.error("Client details are required.");
        if (items.some((i) => !i.description || i.quantity <= 0 || i.rate <= 0))
            return toast.error("All items need a description, quantity and rate.");

        setLoading(true);
        try {
            const res = await fetch("/api/invoice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderName, senderEmail,
                    senderPhone: senderPhone || undefined,
                    senderAddress: senderAddress || undefined,
                    clientName, clientEmail,
                    clientPhone: clientPhone || undefined,
                    clientAddress: clientAddress || undefined,
                    items, taxRate, discount, currency,
                    dueDate: dueDate || undefined,
                    notes: notes || undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create invoice");

            toast.success("Invoice created!");
            router.push(`/invoice/${data.invoice.id}`);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputCls = [
        "w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors",
        "bg-[var(--bg-raised)] border border-[var(--border-strong)]",
        "text-[var(--text-primary)] placeholder:text-[var(--text-faint)]",
        "focus:border-[var(--accent2)] focus:ring-2 focus:ring-[var(--accent2)]/10",
    ].join(" ");

    const labelCls = "block text-xs font-medium text-[var(--text-muted)] mb-1.5";

    const sectionTagCls = [
        "inline-block font-mono text-[9px] tracking-widest uppercase",
        "bg-[var(--highlight)] text-[var(--highlight-fg)]",
        "px-2 py-0.5 rounded mb-4",
    ].join(" ");

    const cardCls = "rounded-xl p-4 sm:p-5 mb-4 border bg-[var(--bg-raised)] border-[var(--border-strong)]";

    return (
        <div className="sm:px-8 py-6 sm:py-10 max-w-3xl mx-auto">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
                input[type="date"]::-webkit-calendar-picker-indicator { opacity: .4; cursor: pointer; }
            `}</style>

            <div className="mb-6 sm:mb-8">
                <h1
                    className="text-3xl sm:text-4xl mb-1"
                    style={{ fontFamily: "'DM Serif Display', serif", color: "var(--text-primary)" }}
                >
                    New Invoice<span style={{ color: "var(--accent2)" }}>.</span>
                </h1>
                <p className="text-xs font-mono" style={{ color: "var(--text-faint)" }}>
                    Fill in the details below to generate an invoice
                </p>
            </div>

            <section className={cardCls}>
                <div className={sectionTagCls}>From — You</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Name <span style={{ color: "var(--accent2)" }}>*</span></label>
                        <input className={inputCls} value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your name or company" />
                    </div>
                    <div>
                        <label className={labelCls}>Email <span style={{ color: "var(--accent2)" }}>*</span></label>
                        <input type="email" className={inputCls} value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder="you@company.com" />
                    </div>
                    <div>
                        <label className={labelCls}>Phone</label>
                        <input className={inputCls} value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} placeholder="+234 801 234 5678" />
                    </div>
                    <div>
                        <label className={labelCls}>Address</label>
                        <input className={inputCls} value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} placeholder="123 Main St, City" />
                    </div>
                </div>
            </section>

            <section className={cardCls}>
                <div className={sectionTagCls}>Bill To — Client</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Name <span style={{ color: "var(--accent2)" }}>*</span></label>
                        <input className={inputCls} value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client name or company" />
                    </div>
                    <div>
                        <label className={labelCls}>Email <span style={{ color: "var(--accent2)" }}>*</span></label>
                        <input type="email" className={inputCls} value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@company.com" />
                    </div>
                    <div>
                        <label className={labelCls}>Phone</label>
                        <input className={inputCls} value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+234 801 234 5678" />
                    </div>
                    <div>
                        <label className={labelCls}>Address</label>
                        <input className={inputCls} value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="123 Client St, City" />
                    </div>
                </div>
            </section>

            <section className={cardCls}>
                <div className={sectionTagCls}>Line Items</div>

                <div className="hidden sm:grid grid-cols-12 gap-3 px-1 mb-2">
                    {(["Description", "Qty", "Rate", "Amount", ""] as const).map((h, i) => (
                        <span
                            key={i}
                            className={`font-mono text-[9px] tracking-widest uppercase col-span-${["5", "2", "2", "2", "1"][i]}`}
                            style={{ color: "var(--text-faint)", textAlign: i >= 3 ? "right" : "left" }}
                        >
                            {h}
                        </span>
                    ))}
                </div>

                <div className="space-y-3">
                    {items.map((item, i) => (
                        <div key={i} className="relative">
                            <div className="sm:hidden space-y-2 p-3 rounded-lg border" style={{ borderColor: "var(--border-strong)", background: "var(--bg)" }}>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                                        Item {i + 1}
                                    </span>
                                    {items.length > 1 && (
                                        <button
                                            onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                                            className="text-sm transition-colors hover:text-[var(--danger)]"
                                            style={{ color: "var(--text-faint)" }}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                <input
                                    className={inputCls}
                                    value={item.description}
                                    onChange={(e) => updateItem(i, "description", e.target.value)}
                                    placeholder="Description"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className={labelCls}>Qty</label>
                                        <input
                                            type="number" min={1}
                                            className={`${inputCls} text-center`}
                                            value={item.quantity}
                                            onChange={(e) => updateItem(i, "quantity", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Rate ({sym})</label>
                                        <input
                                            type="number" min={0} step={0.01}
                                            className={inputCls}
                                            value={item.rate}
                                            onChange={(e) => updateItem(i, "rate", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <span className="font-mono text-sm font-medium" style={{ color: "var(--accent2)" }}>
                                        {sym}{(item.quantity * item.rate).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="hidden sm:grid grid-cols-12 gap-3 items-center">
                                <input
                                    className={`col-span-5 ${inputCls}`}
                                    value={item.description}
                                    onChange={(e) => updateItem(i, "description", e.target.value)}
                                    placeholder="Service or product"
                                />
                                <input
                                    type="number" min={1}
                                    className={`col-span-2 ${inputCls} text-center`}
                                    value={item.quantity}
                                    onChange={(e) => updateItem(i, "quantity", e.target.value)}
                                />
                                <input
                                    type="number" min={0} step={0.01}
                                    className={`col-span-2 ${inputCls}`}
                                    value={item.rate}
                                    onChange={(e) => updateItem(i, "rate", e.target.value)}
                                />
                                <div className="col-span-2 text-right font-mono text-sm font-medium" style={{ color: "var(--accent2)" }}>
                                    {sym}{(item.quantity * item.rate).toFixed(2)}
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    {items.length > 1 && (
                                        <button
                                            onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                                            className="w-7 h-7 flex items-center justify-center rounded text-lg leading-none transition-colors hover:text-[var(--danger)]"
                                            style={{ color: "var(--text-faint)" }}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setItems((prev) => [...prev, emptyItem()])}
                    className="mt-3 flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed transition-colors hover:text-[var(--accent2)] hover:border-[var(--accent2)]"
                    style={{ color: "var(--text-muted)", borderColor: "var(--border-strong)" }}
                >
                    + Add line item
                </button>
            </section>

            <section className={cardCls}>
                <div className={sectionTagCls}>Adjustments & Notes</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className={labelCls}>Currency</label>
                        <select
                            className={inputCls}
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                        >
                            {CURRENCIES.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.symbol} {c.code}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Tax Rate (%)</label>
                        <input type="number" min={0} max={100} step={0.5} className={inputCls} value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div>
                        <label className={labelCls}>Discount ({sym})</label>
                        <input type="number" min={0} step={0.01} className={inputCls} value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div>
                        <label className={labelCls}>Due Date</label>
                        <input type="date" className={inputCls} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                </div>
                <div className="border-t mb-4" style={{ borderColor: "var(--border)" }} />
                <div>
                    <label className={labelCls}>Notes</label>
                    <textarea
                        className={`${inputCls} resize-none`}
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Payment terms, bank details, thank you note…"
                    />
                </div>
            </section>

            <div
                className="rounded-xl p-4 sm:p-5 mb-5 border"
                style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
            >
                <TotalsBlock
                    subtotal={subtotal}
                    tax={taxAmount}
                    taxRate={taxRate}
                    discount={discount}
                    total={total}
                    currency={currency}
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
                {loading ? "Creating…" : "Create Invoice →"}
            </button>
        </div>
    );
}