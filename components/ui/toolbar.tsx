import { Search, SearchIcon } from "lucide-react";

type TableToolbarProps = {
    searchValue: string;
    onSearchChange: (v: string) => void;
    status: string;
    onStatusChange: (v: string) => void;
    range: string;
    onRangeChange: (v: string) => void;
};

export function TableToolbar({
    searchValue,
    onSearchChange,
    status,
    onStatusChange,
    range,
    onRangeChange,
}: TableToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200  py-4 lg:py-8">
            {/* Search */}
            <div className="w-full relative max-w-[460px]">
                <input
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search invoice number, client, or amount..."
                    className="w-full rounded-lg border border-neutral-300 bg-white px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <SearchIcon size={18} className="text-primary" />
                </span>
            </div>
            <div className="self-end flex items-center gap-3">

                {/* Status */}
                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="rounded-lg bg-white border border-neutral-300 px-3 py-2 text-sm"
                >
                    <option value="all">Status: All</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                </select>

                {/* Range */}
                <select
                    value={range}
                    onChange={(e) => onRangeChange(e.target.value)}
                    className="rounded-lg bg-white border border-neutral-300 px-3 py-2 text-sm"
                >
                    <option value="30">Last 30 Days</option>
                    <option value="7">Last 7 Days</option>
                    <option value="90">Last 90 Days</option>
                </select>

                {/* Filter icon */}
                <button className="rounded-md border bg-white border-neutral-300 p-2 text-neutral-600 hover:bg-neutral-100">
                    ⚙️
                </button>
            </div>
        </div>
    );
}
