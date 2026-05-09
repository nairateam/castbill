"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-30 lg:relative lg:flex
                ${mobileOpen ? "flex" : "hidden lg:flex"}
            `}>
                <Sidebar onClose={() => setMobileOpen(false)} />
            </div>

            <div className="flex flex-1 flex-col min-w-0">
                <TopNav onMenuClick={() => setMobileOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}