'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import LeftSidebar from "@/components/Sidebar";
import { InvoiceDrawerProvider } from "@/components/invoice/DrawerProvider";
import { InvoiceDrawer } from "@/components/invoice/Drawer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();

            if (!data.session) {
                router.replace("/login"); // redirect if no session
            } else {
                setLoading(false); // user is logged in
            }
        };

        checkSession();
    }, [router]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    return (
        <div>
            <SidebarProvider>
                <InvoiceDrawerProvider>
                    <LeftSidebar />
                    <main className="max-w-7xl mx-auto w-full p-6">
                        {children}
                    </main>
                    <InvoiceDrawer />
                </InvoiceDrawerProvider>
            </SidebarProvider>
        </div>
    );


}
