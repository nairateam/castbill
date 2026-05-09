export default function AuthLayout({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <span className="font-display text-2xl" style={{ color: "var(--text-primary)" }}>
                        CastBill<span style={{ color: "var(--accent)" }}>.</span>
                    </span>
                </div>

                <div
                    className="rounded-2xl p-8"
                    style={{
                        background: "var(--bg-raised)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <h1 className="font-display text-2xl mb-1" style={{ color: "var(--text-primary)" }}>{title}</h1>
                    <p className="text-sm mb-7" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
                    {children}
                </div>
            </div>
        </div>
    );
}