import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import ClientsTable from "@/components/ui/clients/ClientsTable";

export default async function CustomersPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const clients = await prisma.client.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { invoices: true } },
            invoices: {
                select: { total: true, status: true },
            },
        },
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p
                        className="font-mono text-[10px] uppercase tracking-widest mb-1"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Clients
                    </p>
                    <h1 className="font-display text-3xl" style={{ color: "var(--text-primary)" }}>
                        Customers
                    </h1>
                </div>
            </div>

            {clients.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No clients yet"
                    description="Clients are saved automatically when you create an invoice."
                />
            ) : (
                <ClientsTable clients={clients} />
            )}
        </div>
    );
}