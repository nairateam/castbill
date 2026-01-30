'use client';

import Button from "@/components/Button";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DashboardLayout from './layout';

export default function DashboardPage() {
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error(error.message);
            return;
        }
        toast.success("Logged out");
        router.push("/login");
    };

    return (
        <DashboardLayout>
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
        </DashboardLayout>
    );
}
