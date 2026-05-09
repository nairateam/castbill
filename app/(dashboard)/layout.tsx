

import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden">

            {/* Sidebar */}
            <Sidebar />

            {/* Right Side */}
            <div className="flex flex-1 flex-col">

                {/* Top Navigation */}
                <TopNav />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}