"use client";

import { useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    description?: string;
    children?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    loadingLabel?: string;
    variant?: "danger" | "default";
}

export function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title,
    description,
    children,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    loading = false,
    loadingLabel = "Processing...",
    variant = "danger",
}: ConfirmModalProps) {
    // Lock body scroll while open
    useEffect(() => {
        if (!open) return;

        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape" && !loading) {
                onClose();
            }
        }

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open, loading, onClose]);

    if (!open) return null;

    async function handleConfirm() {
        await onConfirm();
        onClose();
    }

    const confirmBg =
        variant === "danger"
            ? "var(--color-danger, #c0392b)"
            : "var(--accent)";

    return createPortal(
        <div
            onClick={() => {
                if (!loading) onClose();
            }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "var(--bg-raised)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.875rem",
                    boxShadow: "var(--shadow-lg)",
                    width: "100%",
                    maxWidth: 400,
                    padding: "24px",
                }}
            >
                <h2
                    id="confirm-modal-title"
                    style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        margin: "0 0 8px",
                    }}
                >
                    {title}
                </h2>

                {description && (
                    <p
                        style={{
                            fontSize: 13,
                            color: "var(--text-muted)",
                            margin: "0 0 20px",
                            lineHeight: 1.6,
                        }}
                    >
                        {description}
                    </p>
                )}

                {children && (
                    <div style={{ marginBottom: 20 }}>
                        {children}
                    </div>
                )}

                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "flex-end",
                    }}
                >
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            fontSize: 13,
                            padding: "7px 16px",
                            borderRadius: "0.5rem",
                            border: "1px solid var(--border)",
                            background: "transparent",
                            color: "var(--text-muted)",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                                "var(--bg-subtle)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                                "transparent";
                        }}
                    >
                        {cancelLabel}
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        style={{
                            fontSize: 13,
                            fontWeight: 500,
                            padding: "7px 16px",
                            borderRadius: "0.5rem",
                            border: "none",
                            background: confirmBg,
                            color: "#fff",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1,
                            transition: "opacity 0.1s",
                        }}
                    >
                        {loading ? loadingLabel : confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}