import React from "react";
import clsx from "clsx";
import { TablePagination } from "./pagination";
import { TableToolbar } from "./toolbar";

export type TableColumn<T> = {
    key: keyof T | string;
    header: string;
    render?: (row: T) => React.ReactNode;
    align?: "left" | "center" | "right";
};

export type PaginationMeta = {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
};

type TableProps<T> = {
    columns: TableColumn<T>[];
    data: T[];
    emptyText?: string;
    toolbar?: boolean; // whether to show the toolbar
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    status?: string;
    onStatusChange?: (status: string) => void;
    range?: [number, number];
    onRangeChange?: (range: [number, number]) => void;
    pagination?: {
        meta: PaginationMeta;
        onPageChange: (page: number) => void;
    };
};


export function Table<T>({
    columns,
    data,
    emptyText = "No records found",
    toolbar = true,
    searchValue,
    onSearchChange,
    status,
    onStatusChange,
    range,
    onRangeChange,
    pagination,
}: TableProps<T>) {
    return (
        <>
            {toolbar && (
                <TableToolbar
                    searchValue={searchValue ?? ""}
                    onSearchChange={onSearchChange ?? (() => { })}
                    status=''
                    onStatusChange={() => { }}
                    range=''
                    onRangeChange={() => { }}
                />
            )}
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-primary/3 text-neutral-500">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={clsx(
                                        "px-6 py-4 text-xs font-semibold uppercase tracking-wider",
                                        col.align === "center" && "text-center",
                                        col.align === "right" && "text-right",
                                        (!col.align || col.align === "left") && "text-left"
                                    )}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-100">
                        {data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-10 text-center text-neutral-500"
                                >
                                    {emptyText}
                                </td>
                            </tr>
                        )}

                        {data.map((row, idx) => (
                            <tr
                                key={idx}
                                className="transition hover:bg-neutral-50"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={String(col.key)}
                                        className={clsx(
                                            "px-6 py-4",
                                            col.align === "center" && "text-center",
                                            col.align === "right" && "text-right"
                                        )}
                                    >
                                        {col.render
                                            ? col.render(row)
                                            : (row as any)[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pagination && (
                    <TablePagination
                        page={pagination.meta.page}
                        totalPages={pagination.meta.totalPages}
                        onPageChange={pagination.onPageChange}
                    />
                )}
            </div>
        </>
    );
}
