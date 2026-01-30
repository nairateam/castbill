'use client';

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { toast } from "sonner";

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                toast.error("You must be logged in");
                router.replace("/login");
            } else {
                setLoading(false);
            }
        };

        checkSession();
    }, [router]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            toast.error(error.message);
            return;
        }

        toast.success("Logged out");
        router.push("/login");
    };

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="p-10">
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <Button
                variant="outline"
                className="mt-6"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </div>
    );
}
