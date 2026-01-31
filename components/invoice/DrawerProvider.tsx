"use client";

import { useInvoiceDrawer } from "@/hooks/use-drawer";
import { createContext, useContext } from "react";

const InvoiceDrawerContext = createContext<ReturnType<typeof useInvoiceDrawer> | null>(null);

export function InvoiceDrawerProvider({ children }: { children: React.ReactNode }) {
    const drawer = useInvoiceDrawer();
    return (
        <InvoiceDrawerContext.Provider value={drawer}>
            {children}
        </InvoiceDrawerContext.Provider>
    );
}

export function useInvoiceDrawerContext() {
    const ctx = useContext(InvoiceDrawerContext);
    if (!ctx) throw new Error("InvoiceDrawerProvider missing");
    return ctx;
}
