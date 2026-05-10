"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CURRENCIES, CurrencyCode, getSymbol } from "@/lib/currency";
import TotalsBlock from "@/components/ui/invoice/TotalsBlock";
import FormCard from "@/components/ui/invoice/FormCard";
import PartyFields from "@/components/ui/invoice/PartyFields";
import { Client, useClients } from "@/hooks/useClients";
import ClientSelector from "@/components/ui/invoice/ClientSelector";
import { Save, SendHorizontal, User, Building2 } from "lucide-react";

type Item = { description: string; quantity: number; rate: number };
type SenderType = "INDIVIDUAL" | "COMPANY";
const emptyItem = (): Item => ({ description: "", quantity: 1, rate: 0 });

export default function NewInvoicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState<"draft" | "send" | null>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);
    const [senderType, setSenderType] = useState<SenderType>("INDIVIDUAL");

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

    const { clients } = useClients();
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [saveClient, setSaveClient] = useState(false);

    const applyProfile = (profile: any, type: SenderType) => {
        if (type === "COMPANY") {
            setSenderName(profile.companyName || profile.name || "");
        } else {
            setSenderName(profile.name || "");
        }
        setSenderEmail(profile.email || "");
        setSenderPhone(profile.phone || "");
        setSenderAddress(profile.address || "");
    };

    useEffect(() => {
        fetch("/api/profile")
            .then((r) => r.json())
            .then(({ profile }) => {
                setHasProfile(!!profile);
                if (!profile) return;
                setProfileData(profile);
                const type = profile.type as SenderType;
                setSenderType(type);
                applyProfile(profile, type);
                if (profile.defaultCurrency) setCurrency(profile.defaultCurrency);
                if (profile.defaultTaxRate) setTaxRate(profile.defaultTaxRate);
            })
            .catch(() => setHasProfile(false));
    }, []);

    const handleSenderTypeSwitch = (type: SenderType) => {
        setSenderType(type);
        if (profileData) applyProfile(profileData, type);
    };

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

    const validateDraft = () => {
        if (!senderName) { toast.error("At least add your name to save a draft."); return false; }
        return true;
    };

    const validateFull = () => {
        if (!senderName || !senderEmail) { toast.error("Sender details are required."); return false; }
        if (!clientName || !clientEmail) { toast.error("Client details are required."); return false; }
        if (items.some((i) => !i.description || i.quantity <= 0 || i.rate <= 0)) {
            toast.error("All items need a description, quantity and rate.");
            return false;
        }
        return true;
    };

    const handleClientSelect = (client: Client | null) => {
        setSelectedClientId(client?.id ?? null);
        if (client) {
            setClientName(client.name);
            setClientEmail(client.email);
            setClientPhone(client.phone ?? "");
            setClientAddress(client.address ?? "");
        } else {
            setClientName("");
            setClientEmail("");
            setClientPhone("");
            setClientAddress("");
        }
    };

    const createInvoice = async () => {
        let clientId = selectedClientId;

        if (!selectedClientId && saveClient && clientName && clientEmail) {
            const clientRes = await fetch("/api/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: clientName,
                    email: clientEmail,
                    phone: clientPhone || undefined,
                    address: clientAddress || undefined,
                }),
            });
            const clientData = await clientRes.json();
            clientId = clientData.client?.id ?? null;
        }

        const res = await fetch("/api/invoice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                senderName, senderEmail,
                senderPhone: senderPhone || undefined,
                senderAddress: senderAddress || undefined,
                senderLogoUrl: senderType === "COMPANY" ? profileData?.logoUrl || undefined : undefined,
                senderVatNumber: senderType === "COMPANY" ? profileData?.vatNumber || undefined : undefined,
                clientName, clientEmail,
                clientPhone: clientPhone || undefined,
                clientAddress: clientAddress || undefined,
                clientId: clientId || undefined,
                items, taxRate, discount, currency,
                dueDate: dueDate || undefined,
                notes: notes || undefined,
            }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create invoice");
        return data.invoice;
    };

    const handleDraft = async () => {
        if (!validateDraft()) return;
        setLoading("draft");
        try {
            const invoice = await createInvoice();
            toast.success("Draft saved!");
            router.push(`/invoice/${invoice.id}`);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(null);
        }
    };

    const handleCreateAndSend = async () => {
        if (!validateFull()) return;
        setLoading("send");
        try {
            const invoice = await createInvoice();
            const sendRes = await fetch(`/api/invoice/${invoice.id}/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: clientEmail }),
            });
            const sendData = await sendRes.json();
            if (!sendRes.ok) throw new Error(sendData.error || "Invoice created but failed to send.");
            toast.success(`Invoice created and sent to ${clientEmail}!`);
            router.push(`/invoice/${invoice.id}`);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(null);
        }
    };

    const inputCls = [
        "w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors",
        "bg-[var(--bg-raised)] border border-[var(--border-strong)]",
        "text-[var(--text-primary)] placeholder:text-[var(--text-faint)]",
        "focus:border-[var(--accent2)] focus:ring-2 focus:ring-[var(--accent2)]/10",
    ].join(" ");

    const labelCls = "block text-xs font-medium text-[var(--text-muted)] mb-1.5";

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

            {hasProfile === false && (
                <a
                    href="/account"
                    className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-lg border mb-6 transition-colors hover:border-[var(--accent2)]"
                    style={{
                        borderColor: "var(--border-strong)",
                        background: "var(--bg-raised)",
                        color: "var(--text-muted)",
                    }}
                >
                    <span style={{ color: "var(--accent2)" }}>→</span>
                    Set up your profile to auto-fill invoices faster
                </a>
            )
            }

            <FormCard tag="From — You">
                <div
                    className="rounded-lg p-1 flex gap-1 mb-4 w-fit"
                    style={{ background: "var(--bg-raised)", border: "1px solid var(--border-strong)" }}
                >
                    {(["INDIVIDUAL", "COMPANY"] as SenderType[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => handleSenderTypeSwitch(t)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                            style={
                                senderType === t
                                    ? { background: "var(--accent)", color: "var(--accent-fg)" }
                                    : { color: "var(--text-muted)" }
                            }
                        >
                            {t === "INDIVIDUAL" ? <User size={12} /> : <Building2 size={12} />}
                            {t === "INDIVIDUAL" ? "Individual" : "Company"}
                        </button>
                    ))}
                </div>

                <PartyFields
                    label="From — You"
                    name={senderName} onName={setSenderName}
                    email={senderEmail} onEmail={setSenderEmail}
                    phone={senderPhone} onPhone={setSenderPhone}
                    address={senderAddress} onAddress={setSenderAddress}
                    inputCls={inputCls}
                    labelCls={labelCls}
                    namePlaceholder={senderType === "COMPANY" ? "Acme Ltd." : "Ada Obi"}
                />

                {senderType === "COMPANY" && profileData?.vatNumber && (
                    <p className="mt-2 text-xs font-mono" style={{ color: "var(--text-faint)" }}>
                        VAT / RC: {profileData.vatNumber}
                    </p>
                )}
            </FormCard>

            <FormCard tag="Bill To — Client">
                <ClientSelector
                    clients={clients}
                    onSelect={handleClientSelect}
                    selectedId={selectedClientId}
                    inputCls={inputCls}
                    labelCls={labelCls}
                    saveClient={saveClient}
                    onSaveClientChange={setSaveClient}
                />
                <PartyFields
                    label="Bill To — Client"
                    name={clientName} onName={setClientName}
                    email={clientEmail} onEmail={setClientEmail}
                    phone={clientPhone} onPhone={setClientPhone}
                    address={clientAddress} onAddress={setClientAddress}
                    inputCls={inputCls}
                    labelCls={labelCls}
                />
            </FormCard>

            <FormCard tag="Line Items">
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
            </FormCard>

            <FormCard tag="Adjustments & Notes">
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
            </FormCard>

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

            <div className="flex gap-3">
                <button
                    onClick={handleDraft}
                    disabled={loading !== null}
                    className="flex-1 py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    style={{
                        background: "transparent",
                        border: "1px solid var(--border-strong)",
                        color: "var(--text-muted)",
                    }}
                >
                    <Save size={15} />
                    {loading === "draft" ? "Saving…" : "Save as Draft"}
                </button>
                <button
                    onClick={handleCreateAndSend}
                    disabled={loading !== null}
                    className="flex-1 py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                >
                    <SendHorizontal size={15} />
                    {loading === "send" ? "Sending…" : "Create & Send"}
                </button>
            </div>
        </div >
    );
}