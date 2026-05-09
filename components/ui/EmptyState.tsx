import Link from "next/link";
import { LucideIcon } from "lucide-react";

type Action =
    | { type: "link"; href: string; label: string }
    | { type: "button"; onClick: () => void; label: string };

interface Props {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: Action;
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
    return (
        <div
            style={{ border: "1px dashed var(--border-strong)", color: "var(--text-muted)" }}
            className="rounded-2xl py-24 flex flex-col items-center justify-center text-center px-6"
        >
            {Icon && (
                <div
                    style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                    className="mb-4 flex items-center justify-center rounded-xl p-3"
                >
                    <Icon size={22} style={{ color: "var(--text-muted)" }} />
                </div>
            )}

            <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                {title}
            </p>

            {description && (
                <p className="text-xs mb-5 max-w-xs" style={{ color: "var(--text-muted)" }}>
                    {description}
                </p>
            )}

            {action && (
                action.type === "link" ? (
                    <Link
                        href={action.href}
                        style={{ color: "var(--accent)" }}
                        className="text-sm hover:underline underline-offset-4"
                    >
                        {action.label} →
                    </Link>
                ) : (
                    <button
                        onClick={action.onClick}
                        style={{ color: "var(--accent)" }}
                        className="text-sm hover:underline underline-offset-4"
                    >
                        {action.label}
                    </button>
                )
            )}
        </div>
    );
}