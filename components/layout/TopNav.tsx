"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { useSession } from "next-auth/react";
import { Search, Bell, ChevronDown, Settings, LogOut, User, Moon, Sun, Command, X } from "lucide-react";

const BREADCRUMB_MAP: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/analytics": "Analytics",
    "/dashboard/customers": "Customers",
    "/dashboard/orders": "Orders",
    "/dashboard/projects": "Projects",
    "/dashboard/reports": "Reports",
    "/dashboard/notifications": "Notifications",
    "/dashboard/settings": "Settings",
    "/dashboard/help": "Help & Support",
};

function getInitials(name?: string | null, email?: string | null): string {
    if (name) {
        const parts = name.trim().split(/\s+/);
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : name.slice(0, 2).toUpperCase();
    }
    return email ? email.slice(0, 2).toUpperCase() : "??";
}

export default function TopNav() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { theme, toggle } = useTheme();
    const isDark = theme === "dark";

    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const pageLabel = BREADCRUMB_MAP[pathname] ?? "Dashboard";

    const userName = session?.user?.name ?? session?.user?.email ?? "User";
    const userEmail = session?.user?.email ?? "";
    const initials = getInitials(session?.user?.name, session?.user?.email);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen((v) => !v); }
            if (e.key === "Escape") { setSearchOpen(false); setSearchValue(""); }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    return (
        <header
            style={{ background: "var(--topnav-bg)", borderBottom: "1px solid var(--topnav-border)" }}
            className="relative z-10 flex h-16 shrink-0 items-center justify-between px-4 sm:px-6"
        >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                <span style={{ color: "var(--text-muted)" }}>Dashboard</span>
                {pageLabel !== "Overview" && (
                    <>
                        <span style={{ color: "var(--border-strong)" }}>/</span>
                        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{pageLabel}</span>
                    </>
                )}
                {pageLabel === "Overview" && (
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Overview</span>
                )}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">

                {/* Search */}
                <div className="relative">
                    {searchOpen ? (
                        <div
                            style={{ background: "var(--bg-subtle)", borderColor: "var(--accent)", color: "var(--text-primary)" }}
                            className="flex items-center gap-2 rounded-lg border px-3 py-1.5 shadow-sm sm:w-64"
                        >
                            <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search anything..."
                                style={{ background: "transparent", color: "var(--text-primary)" }}
                                className="flex-1 text-sm outline-none placeholder:text-[var(--text-faint)]"
                            />
                            <button
                                onClick={() => { setSearchOpen(false); setSearchValue(""); }}
                                style={{ color: "var(--text-muted)" }}
                                className="hover:opacity-70 transition-opacity"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setSearchOpen(true)}
                            style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors hover:border-[var(--border-strong)]"
                        >
                            <Search className="h-4 w-4" />
                            <span className="hidden sm:inline">Search...</span>
                            <kbd
                                style={{ border: "1px solid var(--border)", background: "var(--bg-raised)", color: "var(--text-faint)" }}
                                className="hidden items-center gap-0.5 rounded px-1.5 text-[10px] font-medium sm:flex"
                            >
                                <Command className="h-2.5 w-2.5" />K
                            </kbd>
                        </button>
                    )}
                </div>

                {/* Theme toggle */}
                <button
                    onClick={toggle}
                    style={{ color: "var(--text-muted)" }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-overlay)]"
                    aria-label="Toggle theme"
                >
                    {mounted && (isDark
                        ? <Sun className="h-[18px] w-[18px]" />
                        : <Moon className="h-[18px] w-[18px]" />
                    )}
                </button>

                {/* Notifications — bell only, no hardcoded data */}
                <div ref={notifRef} className="relative">
                    <button
                        onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
                        style={{ color: "var(--text-muted)" }}
                        className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-overlay)]"
                        aria-label="Notifications"
                    >
                        <Bell className="h-[18px] w-[18px]" />
                    </button>

                    {notifOpen && (
                        <div
                            style={{ background: "var(--bg-raised)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
                            className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-xl"
                        >
                            <div style={{ borderBottom: "1px solid var(--border)" }} className="px-4 py-3">
                                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Notifications</h3>
                            </div>
                            <div className="px-4 py-6 text-center">
                                <p className="text-xs" style={{ color: "var(--text-faint)" }}>No notifications yet</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="mx-1 h-5 w-px" style={{ background: "var(--border)" }} />

                {/* Profile */}
                <div ref={profileRef} className="relative">
                    <button
                        onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-[var(--bg-overlay)]"
                    >
                        <div
                            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                        >
                            {initials}
                        </div>
                        <div className="hidden text-left sm:block">
                            <p className="text-[13px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                                {userName}
                            </p>
                            <p className="text-[11px] leading-tight" style={{ color: "var(--text-muted)" }}>
                                {userEmail}
                            </p>
                        </div>
                        <ChevronDown
                            className={`hidden h-3.5 w-3.5 sm:block transition-transform ${profileOpen ? "rotate-180" : ""}`}
                            style={{ color: "var(--text-faint)" }}
                        />
                    </button>

                    {profileOpen && (
                        <div
                            style={{ background: "var(--bg-raised)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
                            className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl"
                        >
                            <div style={{ borderBottom: "1px solid var(--border)" }} className="px-4 py-3">
                                <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{userName}</p>
                                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{userEmail}</p>
                            </div>
                            <ul className="py-1.5">
                                {[
                                    { icon: User, label: "My Profile", href: "/dashboard/profile" },
                                    { icon: Settings, label: "Account Settings", href: "/dashboard/settings" },
                                ].map(({ icon: Icon, label, href }) => (
                                    <li key={label}>
                                        <a
                                            href={href}
                                            style={{ color: "var(--text-secondary)" }}
                                            className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] transition-colors hover:bg-[var(--bg-subtle)]"
                                        >
                                            <Icon className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div style={{ borderTop: "1px solid var(--border)" }} className="py-1.5">
                                <button
                                    onClick={() => { /* signOut() */ }}
                                    style={{ color: "var(--danger)" }}
                                    className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] transition-colors hover:bg-[var(--danger-bg)]"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}