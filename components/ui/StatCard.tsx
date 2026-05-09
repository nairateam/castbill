import { LucideIcon } from "lucide-react";

type Props = {
    label: string;
    value: string;
    icon: LucideIcon;
    accent?: boolean;
    mono?: boolean;
};

export default function StatCard({ label, value, icon: Icon, accent = false, mono = false }: Props) {
    return (
        <div
            style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
            }}
            className="relative overflow-hidden rounded-xl p-5"
        >
            {accent && (
                <div
                    style={{ background: "var(--accent)", opacity: 0.15 }}
                    className="absolute inset-x-0 top-0 h-0.5"
                />
            )}
            <div className="flex items-start justify-between mb-3">
                <p
                    className="text-[11px] uppercase tracking-widest font-medium"
                    style={{ color: "var(--text-muted)" }}
                >
                    {label}
                </p>
                <div
                    style={{
                        background: accent ? "var(--warning-bg)" : "var(--bg-overlay)",
                        color: accent ? "var(--accent)" : "var(--text-muted)",
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                </div>
            </div>
            <p
                className={`text-2xl font-semibold ${mono ? "font-mono" : ""}`}
                style={{ color: accent ? "var(--accent)" : "var(--text-primary)" }}
            >
                {value}
            </p>
        </div>
    );
}