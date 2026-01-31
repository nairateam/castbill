import clsx from "clsx";

type Props = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export function TablePagination({
    page,
    totalPages,
    onPageChange,
}: Props) {
    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages: (number | "...")[] = [];

        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);

        if (page > 3) pages.push("...");

        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (page < totalPages - 2) pages.push("...");

        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 bg-primary/2">
            <p className="text-sm text-neutral-600">
                Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </p>

            <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    className="px-3 py-1 text-sm font-medium text-neutral-600 rounded border border-neutral-600 disabled:opacity-50"
                >
                    Previous
                </button>

                {getPages().map((item, index) =>
                    item === "..." ? (
                        <span
                            key={index}
                            className="px-2 text-neutral-400"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={item}
                            onClick={() => onPageChange(item)}
                            className={clsx(
                                "px-3 py-1 text-sm rounded border",
                                item === page
                                    ? "bg-primary text-white border-neutral-100"
                                    : "hover:bg-neutral-100 border-neutral-500"
                            )}
                        >
                            {item}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="px-3 py-1 text-neutral-600 text-sm font-medium rounded border border-neutral-500 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
