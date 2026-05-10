"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { CURRENCIES, CurrencyCode } from "@/lib/currency";
import { Building2, User, Upload, Loader2 } from "lucide-react";
import Image from "next/image";

type ProfileType = "INDIVIDUAL" | "COMPANY";

interface Profile {
    type: ProfileType;
    name: string;
    email: string;
    phone: string;
    address: string;
    companyName: string;
    vatNumber: string;
    logoUrl: string;
    defaultCurrency: CurrencyCode;
    defaultTaxRate: number;
}

const empty: Profile = {
    type: "INDIVIDUAL",
    name: "", email: "", phone: "", address: "",
    companyName: "", vatNumber: "", logoUrl: "",
    defaultCurrency: "NGN", defaultTaxRate: 0,
};

export default function AccountPage() {
    const [profile, setProfile] = useState<Profile>(empty);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/profile")
            .then((r) => r.json())
            .then(({ profile }) => {
                if (profile) setProfile(profile);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const set = (field: keyof Profile, value: string | number) =>
        setProfile((prev) => ({ ...prev, [field]: value }));

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const form = new FormData();
        form.append("file", file);

        try {
            const res = await fetch("/api/profile/logo", { method: "POST", body: form });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            set("logoUrl", data.url);
            toast.success("Logo uploaded!");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success("Profile saved!");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    const inputCls = [
        "w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors",
        "bg-[var(--bg-raised)] border border-[var(--border-strong)]",
        "text-[var(--text-primary)] placeholder:text-[var(--text-faint)]",
        "focus:border-[var(--accent2)] focus:ring-2 focus:ring-[var(--accent2)]/10",
    ].join(" ");

    const labelCls = "block text-xs font-medium text-[var(--text-muted)] mb-1.5";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin" style={{ color: "var(--text-faint)" }} />
            </div>
        );
    }

    return (
        <div className="sm:px-8 py-6 sm:py-10 max-w-2xl mx-auto">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

            <div className="mb-8">
                <h1
                    className="text-3xl sm:text-4xl mb-1"
                    style={{ fontFamily: "'DM Serif Display', serif", color: "var(--text-primary)" }}
                >
                    Account<span style={{ color: "var(--accent2)" }}>.</span>
                </h1>
                <p className="text-xs font-mono" style={{ color: "var(--text-faint)" }}>
                    This info pre-fills the "From" section on every new invoice
                </p>
            </div>

            <div
                className="rounded-xl p-1 flex gap-1 mb-6 w-fit"
                style={{ background: "var(--bg-raised)", border: "1px solid var(--border-strong)" }}
            >
                {(["INDIVIDUAL", "COMPANY"] as ProfileType[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => set("type", t)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        style={
                            profile.type === t
                                ? { background: "var(--accent)", color: "var(--accent-fg)" }
                                : { color: "var(--text-muted)" }
                        }
                    >
                        {t === "INDIVIDUAL" ? <User size={14} /> : <Building2 size={14} />}
                        {t === "INDIVIDUAL" ? "Individual" : "Company"}
                    </button>
                ))}
            </div>

            {profile.type === "COMPANY" && (
                <div
                    className="rounded-xl p-5 mb-4 border space-y-4"
                    style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
                >
                    <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                        Company Details
                    </p>

                    <div>
                        <label className={labelCls}>Company Logo</label>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-16 h-16 rounded-lg border flex items-center justify-center overflow-hidden flex-shrink-0"
                                style={{ borderColor: "var(--border-strong)", background: "var(--bg-raised)" }}
                            >
                                {profile.logoUrl ? (
                                    <Image src={profile.logoUrl} alt="Logo" width={64} height={64} className="object-contain" />
                                ) : (
                                    <Building2 size={24} style={{ color: "var(--text-faint)" }} />
                                )}
                            </div>

                            <div>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoUpload}
                                />
                                <button
                                    onClick={() => fileRef.current?.click()}
                                    disabled={uploading}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50"
                                    style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}
                                >
                                    {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                                    {uploading ? "Uploading…" : "Upload logo"}
                                </button>
                                <p className="text-[10px] mt-1" style={{ color: "var(--text-faint)" }}>
                                    PNG or JPG, shown on invoice header
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Company Name</label>
                            <input
                                className={inputCls}
                                value={profile.companyName}
                                onChange={(e) => set("companyName", e.target.value)}
                                placeholder="Acme Ltd."
                            />
                        </div>
                        <div>
                            <label className={labelCls}>VAT / RC Number</label>
                            <input
                                className={inputCls}
                                value={profile.vatNumber}
                                onChange={(e) => set("vatNumber", e.target.value)}
                                placeholder="RC-123456"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div
                className="rounded-xl p-5 mb-4 border space-y-4"
                style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
            >
                <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                    {profile.type === "COMPANY" ? "Primary Contact" : "Your Details"}
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Full Name</label>
                        <input
                            className={inputCls}
                            value={profile.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="Ada Obi"
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Email</label>
                        <input
                            type="email"
                            className={inputCls}
                            value={profile.email}
                            onChange={(e) => set("email", e.target.value)}
                            placeholder="ada@example.com"
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Phone</label>
                        <input
                            className={inputCls}
                            value={profile.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            placeholder="+234 800 000 0000"
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Address</label>
                        <input
                            className={inputCls}
                            value={profile.address}
                            onChange={(e) => set("address", e.target.value)}
                            placeholder="123 Lagos St."
                        />
                    </div>
                </div>
            </div>

            <div
                className="rounded-xl p-5 mb-6 border space-y-4"
                style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
            >
                <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                    Invoice Defaults
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Default Currency</label>
                        <select
                            className={inputCls}
                            value={profile.defaultCurrency}
                            onChange={(e) => set("defaultCurrency", e.target.value)}
                        >
                            {CURRENCIES.map((c) => (
                                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Default Tax Rate (%)</label>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            step={0.5}
                            className={inputCls}
                            value={profile.defaultTaxRate}
                            onChange={(e) => set("defaultTaxRate", parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
                {saving ? <Loader2 size={15} className="animate-spin" /> : null}
                {saving ? "Saving…" : "Save Profile"}
            </button>
        </div>
    );
}