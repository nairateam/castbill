import { useState } from "react";

type DrawerMode = "create" | "edit";

export function useInvoiceDrawer() {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<DrawerMode>("create");
    const [invoiceId, setInvoiceId] = useState<string | null>(null);

    const openCreate = () => {
        setMode("create");
        setInvoiceId(null);
        setOpen(true);
    };

    const openEdit = (id: string) => {
        setMode("edit");
        setInvoiceId(id);
        setOpen(true);
    };

    const close = () => setOpen(false);

    return {
        open,
        mode,
        invoiceId,
        openCreate,
        openEdit,
        close,
    };
}
