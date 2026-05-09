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
            {/* Fields */}
            <div className="space-y-4 mb-6">
                {fields.map((field) => (
                    <div key={field.label}>
                        <label className="text-xs text-zinc-400 mb-1.5 block">
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder={field.placeholder}
                            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                            className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/50 transition-colors"
                        />
                    </div>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 px-3 py-2.5 bg-red-950/50 border border-red-800/40 rounded-lg text-red-300 text-xs">
                    {error}
                </div>
            )}

            {/* Submit */}
            <button
                onClick={onSubmit}
                disabled={loading}
                className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold py-2.5 rounded-lg transition-colors text-sm mb-5"
            >
                {loading ? "Please wait..." : submitLabel}
            </button>

            {/* Footer */}
            {footer && (
                <p className="text-center text-xs text-zinc-500">{footer}</p>
            )}
        </div>
    );
}