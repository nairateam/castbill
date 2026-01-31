import Button from "@/components/Button";
import { Plus } from "lucide-react";
import Dashboard from "@/_pages/dashboard";
import { useInvoiceDrawerContext } from "@/components/invoice/DrawerProvider";

export default function DashboardPage() {
    return (
        <div className="w-auto">
            <Dashboard />
        </div>
    );
}
