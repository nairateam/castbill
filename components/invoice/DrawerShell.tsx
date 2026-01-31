"use client";

export function DrawerShell({
    open,
    onClose,
    children,
}: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/30"
                onClick={onClose}
            />
            <div className="absolute right-0 top-0 h-full w-[520px] bg-white shadow-xl">
                {children}
            </div>
        </div>
    );
}
