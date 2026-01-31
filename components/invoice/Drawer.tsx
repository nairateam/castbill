"use client";

import { DrawerShell } from "./DrawerShell";
import { useInvoiceDrawerContext } from "./DrawerProvider";

export function InvoiceDrawer() {
    const { open, close, mode } = useInvoiceDrawerContext();

    return (
        <DrawerShell open={open} onClose={close}>
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="border-b p-6">
                    <h2 className="text-lg font-semibold">
                        {mode === "create" ? "Create Invoice" : "Edit Invoice"}
                    </h2>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Sections go here later */}
                </div>

                {/* Footer */}
                <div className="border-t p-6 flex justify-end gap-3">
                    <button onClick={close}>Cancel</button>
                    <button className="bg-[#01796F] text-white px-4 py-2 rounded">
                        Save Invoice
                    </button>
                </div>
            </div>
        </DrawerShell>
    );
}
