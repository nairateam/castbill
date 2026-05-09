type Field = {
    label: string;
    type: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
};

export default function AuthForm({
    fields,
    error,
    loading,
    submitLabel,
    onSubmit,
    footer,
}: {
    fields: Field[];
    error?: string;
    loading: boolean;
    submitLabel: string;
    onSubmit: () => void;
    footer?: React.ReactNode;
}) {
    return (
        <div>
            <div className="space-y-4 mb-6">
                {fields.map((field) => (
                    <div key={field.label}>
                        <label
                            className="text-xs mb-1.5 block"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder={field.placeholder}
                            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                            className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                            style={{
                                background: "var(--bg-subtle)",
                                border: "1px solid var(--border-strong)",
                                color: "var(--text-primary)",
                            }}
                        />
                    </div>
                ))}
            </div>

            {error && (
                <div
                    className="mb-4 px-3 py-2.5 rounded-lg text-xs"
                    style={{
                        background: "var(--danger-bg)",
                        border: "1px solid var(--danger)",
                        color: "var(--danger)",
                    }}
                >
                    {error}
                </div>
            )}

            <button
                onClick={onSubmit}
                disabled={loading}
                className="w-full font-semibold py-2.5 rounded-lg transition-colors text-sm mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
                {loading ? "Please wait..." : submitLabel}
            </button>

            {footer && (
                <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
                    {footer}
                </p>
            )}
        </div>
    );
}