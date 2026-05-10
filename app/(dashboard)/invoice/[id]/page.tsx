import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InvoiceActions } from "@/components/ui/invoice/InvoiceActions";
import PartyCard from "@/components/ui/invoice/PartyCard";
import LineItemsTable from "@/components/ui/invoice/LineItemsTable";
import TotalsBlock from "@/components/ui/invoice/TotalsBlock";
import Image from "next/image";

export default async function InvoiceDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: { items: true },
    });

    if (!invoice || invoice.userId !== session.user.id) notFound();

    const statusStyles: Record<string, { bg: string; color: string }> = {
        DRAFT: { bg: "var(--bg-subtle)", color: "var(--text-muted)" },
        SENT: { bg: "var(--highlight)", color: "var(--highlight-fg)" },
        PAID: { bg: "var(--success-bg, rgba(58,125,110,0.12))", color: "var(--success, #3a7d6e)" },
    };
    const badge = statusStyles[invoice.status] ?? statusStyles.DRAFT;

    return (
        <div className="sm:px-8 py-6 sm:py-10 max-w-3xl mx-auto">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
            `}</style>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8">
                <div>
                    {invoice.senderLogoUrl && (
                        <div className="mb-4">
                            <Image
                                src={invoice.senderLogoUrl}
                                alt="Company logo"
                                width={80}
                                height={80}
                                className="object-contain rounded"
                            />
                        </div>
                    )}
                    <p
                        className="font-mono text-[9px] tracking-widest uppercase mb-2"
                        style={{ color: "var(--text-faint)" }}
                    >
                        Invoice
                    </p>
                    <h1
                        className="text-3xl sm:text-4xl mb-3"
                        style={{ fontFamily: "'DM Serif Display', serif", color: "var(--text-primary)" }}
                    >
                        #{invoice.invoiceNumber}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] tracking-wider font-medium"
                            style={{ background: badge.bg, color: badge.color }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: "currentColor", opacity: 0.7 }}
                            />
                            {invoice.status.charAt(0) + invoice.status.slice(1).toLowerCase()}
                        </span>
                        <span
                            className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border"
                            style={{ color: "var(--text-faint)", borderColor: "var(--border-strong)" }}
                        >
                            {invoice.currency}
                        </span>
                        {invoice.dueDate && (
                            <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                                Due {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                                    month: "short", day: "numeric", year: "numeric",
                                })}
                            </span>
                        )}
                    </div>
                </div>

                <div className="sm:flex-shrink-0">
                    <InvoiceActions
                        invoiceId={invoice.id}
                        clientEmail={invoice.clientEmail}
                        status={invoice.status}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <PartyCard
                    label="From"
                    name={invoice.senderName}
                    email={invoice.senderEmail}
                    phone={invoice.senderPhone}
                    address={invoice.senderAddress}
                    vatNumber={invoice.senderVatNumber}
                />
                <PartyCard
                    label="Bill To"
                    name={invoice.clientName}
                    email={invoice.clientEmail}
                    phone={invoice.clientPhone}
                    address={invoice.clientAddress}
                />
            </div>

            <LineItemsTable items={invoice.items} currency={invoice.currency} />

            <div className="mb-6">
                <TotalsBlock
                    subtotal={invoice.subtotal}
                    tax={invoice.tax ?? 0}
                    taxRate={invoice.tax && invoice.subtotal ? (invoice.tax / invoice.subtotal) * 100 : 0}
                    discount={invoice.discount ?? 0}
                    total={invoice.total}
                    currency={invoice.currency}
                />
            </div>

            {invoice.notes && (
                <div
                    className="rounded-xl p-4 border"
                    style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
                >
                    <p
                        className="font-mono text-[9px] tracking-widest uppercase mb-2"
                        style={{ color: "var(--text-faint)" }}
                    >
                        Notes
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {invoice.notes}
                    </p>
                </div>
            )}
        </div>
    );
}