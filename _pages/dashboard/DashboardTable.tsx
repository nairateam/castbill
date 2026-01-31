"use client";

import { useState } from "react";
import { Table, type TableColumn } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MoreHorizontal } from "lucide-react";
import { Invoice } from "@/types";
import { invoices } from "@/data/invoices";

export default function DashboardTable() {
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 5;

    const total = invoices.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    const paginatedInvoices = invoices.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const columns: TableColumn<Invoice>[] = [
        {
            key: "invoice",
            header: "Invoice #",
            render: (row) => (
                <span className="font-medium text-neutral-900">
                    {row.invoiceNumber}
                </span>
            ),
        },
        {
            key: "date",
            header: "Issue Date",
            render: (row) => (
                <span className="font-medium text-neutral-500">
                    {row.dates.issuedAt}
                </span>
            ),
        },
        {
            key: "client",
            header: "Client",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                        {row.billTo.name?.[0]}
                    </div>
                    <div>
                        <p className="font-medium text-neutral-900">
                            {row.billTo.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                            {row.billTo.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "amount",
            header: "Amount",
            align: "right",
            render: (row) => (
                <span className="font-semibold text-neutral-900">
                    ₦{row.totals.grandTotal}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: () => <StatusBadge status="Pending" />,
        },
        {
            key: "actions",
            header: "",
            align: "right",
            render: () => (
                <button className="text-neutral-400 hover:text-neutral-700">
                    <MoreHorizontal size={18} />
                </button>
            ),
        },
    ];

    return (
        <div className="my-8">
            <Table
                columns={columns}
                data={paginatedInvoices}
                emptyText="No invoices found"
                pagination={{
                    meta: {
                        page,
                        pageSize: PAGE_SIZE,
                        total,
                        totalPages,
                    },
                    onPageChange: setPage,
                }}
            />
        </div>
    );
}
