type Props = {
    label: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
};

export default function PartyCard({ label, name, email, phone, address }: Props) {
    return (
        <div
            className="rounded-xl p-4 border"
            style={{ background: "var(--bg-raised)", borderColor: "var(--border-strong)" }}
        >
            <p
                className="font-mono text-[9px] tracking-widest uppercase mb-2"
                style={{ color: "var(--text-faint)" }}
            >
                {label}
            </p>
            <p className="text-sm font-medium mb-0.5" style={{ color: "var(--text-primary)" }}>
                {name}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{email}</p>
            {phone && <p className="text-xs" style={{ color: "var(--text-faint)" }}>{phone}</p>}
            {address && <p className="text-xs" style={{ color: "var(--text-faint)" }}>{address}</p>}
        </div>
    );
}