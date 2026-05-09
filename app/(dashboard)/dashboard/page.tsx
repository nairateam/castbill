import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { TrendingUp, Clock, FileEdit, Hash } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { formatAmount } from "@/lib/currency";
import InvoiceTable from "@/components/ui/invoice/InvoiceTable";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const invoices = await prisma.invoice.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: { items: true },
    });

    const totalRevenue = invoices
        .filter((i) => i.status === "PAID")
        .reduce((sum, i) => sum + i.total, 0);

    const outstanding = invoices
        .filter((i) => i.status === "SENT")
        .reduce((sum, i) => sum + i.total, 0);

    const draft = invoices.filter((i) => i.status === "DRAFT").length;

    const stats = [
        { label: "Total Invoices", value: invoices.length.toString(), icon: Hash, mono: false, accent: false },
        { label: "Revenue Collected", value: formatAmount(totalRevenue, "NGN"), icon: TrendingUp, mono: true, accent: true },
        { label: "Outstanding", value: formatAmount(outstanding, "NGN"), icon: Clock, mono: true, accent: false },
        { label: "Drafts", value: draft.toString(), icon: FileEdit, mono: false, accent: false },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p
                        className="font-mono text-[10px] uppercase tracking-widest mb-1"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Overview
                    </p>
                    <h1 className="font-display text-3xl" style={{ color: "var(--text-primary)" }}>
                        Your Invoices
                    </h1>
                </div>
                <Link
                    href="/invoice/new"
                    style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 shadow-sm"
                >
                    <span className="text-base leading-none">+</span>
                    New Invoice
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <InvoiceTable invoices={invoices} />
        </div>
    );
}