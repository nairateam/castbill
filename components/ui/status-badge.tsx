import { cn, getStatusStyles } from "@/lib/utils";

type StatusBadgeProps = {
    status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase",
                getStatusStyles(status)
            )}
        >
            {status}
        </span>
    );
}
