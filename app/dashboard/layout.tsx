'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

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

    return <div>{children}</div>; // dashboard pages
}
