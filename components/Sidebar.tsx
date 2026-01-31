'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";

import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
} from "lucide-react";
import Logo from "./Logo";

const navItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Invoices",
        href: "/dashboard/invoices",
        icon: FileText,
    },
    {
        title: "Customers",
        href: "/dashboard/customers",
        icon: Users,
    },
];

export default function LeftSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            toast.error(error.message);
            return;
        }

        router.replace("/login");
    };

    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader className="px-4 py-5 mb-5">
                <span className="inline-flex items-center gap-0.5 text-2xl font-semibold">
                    <Logo size="sm" />
                    <span className="">
                        Castbill
                        <p className="text-gray-700 text-sm font-normal">Invoice management</p>
                    </span>
                </span>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu className="px-4">
                    {navItems.map((item, index) => {
                        const active = pathname === item.href;

                        return (
                            <SidebarMenuButton
                                key={index}
                                asChild
                                isActive={active}
                                className="
                                    gap-2
                                    data-[active=true]:bg-primary/10
                                    data-[active=true]:text-primary
                                    py-5
                                "
                            >
                                <Link href={item.href}>
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>

                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu className="pt-5 border-t border-t-gray-300">
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/dashboard/settings">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut className="text-red-700 h-4 w-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
