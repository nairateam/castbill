import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, TrendingUp, Clock, FileEdit } from "lucide-react";
import InvoicesClient from "@/components/InvoiceClient";
import StatCard from "@/components/ui/StatCard";
import { formatAmount } from "@/lib/currency";

export default async function InvoicesPage() {
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

    const drafts = invoices.filter((i) => i.status === "DRAFT").length;

    const stats = [
        { label: "All Invoices", value: invoices.length.toString(), icon: FileText, accent: false, mono: false },
        { label: "Revenue Collected", value: formatAmount(totalRevenue, "NGN"), icon: TrendingUp, accent: true, mono: true },
        { label: "Outstanding", value: formatAmount(outstanding, "NGN"), icon: Clock, accent: false, mono: true },
        { label: "Drafts", value: drafts.toString(), icon: FileEdit, accent: false, mono: false },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p
                        className="font-mono text-[10px] uppercase tracking-widest mb-1"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Invoices
                    </p>
                    <h1 className="font-display text-3xl" style={{ color: "var(--text-primary)" }}>
                        All Invoices
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

            <InvoicesClient invoices={invoices} />
        </div>
    );
}