type Props = {
    tag: string;
    children: React.ReactNode;
};

export default function FormCard({ tag, children }: Props) {
    return (
        <section className="rounded-xl p-4 sm:p-5 mb-4 border bg-[var(--bg-raised)] border-[var(--border-strong)]">
            <span className="inline-block font-mono text-[9px] tracking-widest uppercase bg-[var(--highlight)] text-[var(--highlight-fg)] px-2 py-0.5 rounded mb-4">
                {tag}
            </span>
            {children}
        </section>
    );
}