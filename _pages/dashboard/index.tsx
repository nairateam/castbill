'use client'

import Button from "@/components/Button";
import DashboardTable from "./DashboardTable";
import Stats from "./Stats";
import { useInvoiceDrawerContext } from "@/components/invoice/DrawerProvider";
import { Plus } from "lucide-react";

const Dashboard = () => {
    const { openCreate } = useInvoiceDrawerContext();
    return (
        <div className='flex flex-col flex-1'>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <span>
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <p className="text-gray-600">Manage your billings & invoices accross all clients.</p>
                </span>
                <Button onClick={openCreate} className="hidden md:inline-flex" size="md"><Plus /> Create Invoice</Button>
            </div>
            <Stats />
            <DashboardTable />
        </div>
    );
};

export default Dashboard;