"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    LayoutDashboard,
    FileText,
    Users,
    Receipt,
    Settings,
    HelpCircle,
    ChevronLeft,
} from "lucide-react";

const NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Invoices", icon: FileText, href: "/invoice" },
    { label: "Customers", icon: Users, href: "/dashboard/customers" },
    { label: "Expenses", icon: Receipt, href: "/dashboard/expenses" },
];

const BOTTOM_ITEMS = [
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
    { label: "Help & Support", icon: HelpCircle, href: "/dashboard/help" },
];

function getInitials(name?: string | null, email?: string | null): string {
    if (name) {
        const parts = name.trim().split(/\s+/);
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : name.slice(0, 2).toUpperCase();
    }
    return email ? email.slice(0, 2).toUpperCase() : "??";
}

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [collapsed, setCollapsed] = useState(false);

    const userName = session?.user?.name ?? session?.user?.email ?? "User";
    const userEmail = session?.user?.email ?? "";
    const initials = getInitials(session?.user?.name, session?.user?.email);

    const NavLink = ({ item }: { item: typeof NAV_ITEMS[number] }) => {
        const Icon = item.icon;
        const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
        return (
            <Link
                href={item.href}
                title={collapsed ? item.label : undefined}
                style={{
                    background: isActive ? "var(--sidebar-active)" : "transparent",
                    color: isActive ? "var(--sidebar-fg-active)" : "var(--sidebar-fg)",
                }}
                className={`group relative flex items-center gap-3 rounded-lg py-2 text-sm font-medium
                    transition-all duration-150 hover:bg-white/10
                    ${collapsed ? "justify-center px-2" : "px-3"}`}
            >
                {isActive && (
                    <span
                        style={{ background: "var(--accent)" }}
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
                    />
                )}
                <Icon
                    className="h-[18px] w-[18px] shrink-0"
                    style={{ color: isActive ? "var(--accent)" : "var(--sidebar-fg)", opacity: isActive ? 1 : 0.7 }}
                    strokeWidth={isActive ? 2.2 : 1.8}
                />
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
            </Link>
        );
    };

    return (
        <aside
            style={{
                background: "var(--sidebar-bg)",
                borderRight: "1px solid var(--sidebar-border)",
                width: collapsed ? "70px" : "240px",
                transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
            }}
            className="relative z-30 flex h-full flex-col shrink-0"
        >
            {/* Logo */}
            <div
                style={{ borderBottom: "1px solid var(--sidebar-border)" }}
                className={`flex h-16 shrink-0 items-center px-4 ${collapsed ? "justify-center" : "justify-between"}`}
            >
                <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
                    <div
                        style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-display text-base font-bold shadow-sm"
                    >
                        CB
                    </div>
                    {!collapsed && (
                        <span className="font-display text-lg tracking-tight" style={{ color: "var(--sidebar-fg-active)" }}>
                            CastBill<span style={{ color: "var(--accent)" }}>.</span>
                        </span>
                    )}
                </Link>

                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(true)}
                        style={{ color: "var(--sidebar-fg)" }}
                        className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white/10"
                        aria-label="Collapse sidebar"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Expand toggle when collapsed */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    style={{
                        background: "var(--sidebar-bg)",
                        border: "1px solid var(--sidebar-border)",
                        color: "var(--sidebar-fg)",
                    }}
                    className="absolute -right-3 top-[72px] z-40 flex h-6 w-6 items-center justify-center rounded-full shadow-md hover:text-white transition-colors"
                    aria-label="Expand sidebar"
                >
                    <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
                </button>
            )}

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-3 py-4">
                {!collapsed && (
                    <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: "var(--sidebar-fg)", opacity: 0.5 }}>
                        Main Menu
                    </p>
                )}

                {NAV_ITEMS.map((item) => <NavLink key={item.href} item={item} />)}

                <div className="my-3" style={{ borderTop: "1px solid var(--sidebar-border)" }} />

                {!collapsed && (
                    <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: "var(--sidebar-fg)", opacity: 0.5 }}>
                        System
                    </p>
                )}

                {BOTTOM_ITEMS.map((item) => <NavLink key={item.href} item={item} />)}
            </nav>

            {/* User profile */}
            <div style={{ borderTop: "1px solid var(--sidebar-border)" }} className="shrink-0 p-3">
                {!collapsed ? (
                    <Link
                        href="/dashboard/settings"
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/10"
                    >
                        <div
                            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm"
                        >
                            {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-semibold" style={{ color: "var(--sidebar-fg-active)" }}>
                                {userName}
                            </p>
                            <p className="truncate text-[11px]" style={{ color: "var(--sidebar-fg)", opacity: 0.6 }}>
                                {userEmail}
                            </p>
                        </div>
                        <Settings className="h-4 w-4 shrink-0" style={{ color: "var(--sidebar-fg)", opacity: 0.4 }} />
                    </Link>
                ) : (
                    <div className="flex justify-center">
                        <Link href="/dashboard/settings" title={userName}>
                            <div
                                style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold hover:opacity-90 transition-opacity"
                            >
                                {initials}
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    );
}