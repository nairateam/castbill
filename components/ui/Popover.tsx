"use client";

import {
    createContext,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { createPortal } from "react-dom";

type Align = "start" | "end" | "center";
type Side = "top" | "bottom";

interface PopoverContextValue {
    open: boolean;
    setOpen: (v: boolean) => void;
    triggerRef: React.RefObject<HTMLButtonElement>;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover() {
    const ctx = useContext(PopoverContext);
    if (!ctx) throw new Error("Popover compound components must be used inside <Popover>");
    return ctx;
}

interface PopoverProps {
    children: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function Popover({ children, open: controlledOpen, onOpenChange }: PopoverProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null!);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const setOpen = useCallback(
        (v: boolean) => {
            if (!isControlled) setUncontrolledOpen(v);
            onOpenChange?.(v);
        },
        [isControlled, onOpenChange]
    );

    return (
        <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
            <div style={{ position: "relative", display: "inline-flex" }}>{children}</div>
        </PopoverContext.Provider>
    );
}

interface PopoverTriggerProps {
    children: ReactNode;
    asChild?: boolean;
    className?: string;
    style?: React.CSSProperties;
    "aria-label"?: string;
}

export function PopoverTrigger({ children, className, style, "aria-label": ariaLabel }: PopoverTriggerProps) {
    const { open, setOpen, triggerRef } = usePopover();

    return (
        <button
            ref={triggerRef}
            aria-expanded={open}
            aria-label={ariaLabel}
            className={className}
            style={style}
            onClick={() => setOpen(!open)}
        >
            {children}
        </button>
    );
}

interface PopoverContentProps {
    children: ReactNode;
    align?: Align;
    side?: Side;
    sideOffset?: number;
    className?: string;
    style?: React.CSSProperties;
    minWidth?: number;
}

export function PopoverContent({
    children,
    align = "end",
    side = "bottom",
    sideOffset = 6,
    className,
    style,
    minWidth = 152,
}: PopoverContentProps) {
    const { open, setOpen, triggerRef } = usePopover();
    const contentRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

    const reposition = useCallback(() => {
        const trigger = triggerRef.current;
        const content = contentRef.current;
        if (!trigger || !content) return;

        const tr = trigger.getBoundingClientRect();
        const cr = content.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Side: prefer requested side, flip if it clips
        let top: number;
        const spaceBelow = vh - tr.bottom;
        const spaceAbove = tr.top;
        const preferredSide =
            side === "bottom"
                ? spaceBelow >= cr.height + sideOffset || spaceBelow >= spaceAbove
                    ? "bottom"
                    : "top"
                : spaceAbove >= cr.height + sideOffset || spaceAbove >= spaceBelow
                    ? "top"
                    : "bottom";

        top =
            preferredSide === "bottom"
                ? tr.bottom + sideOffset + window.scrollY
                : tr.top - cr.height - sideOffset + window.scrollY;

        // Align
        let left: number;
        if (align === "end") left = tr.right - cr.width + window.scrollX;
        else if (align === "start") left = tr.left + window.scrollX;
        else left = tr.left + tr.width / 2 - cr.width / 2 + window.scrollX;

        // Clamp to viewport
        left = Math.max(8 + window.scrollX, Math.min(left, vw - cr.width - 8 + window.scrollX));

        setCoords({ top, left });
    }, [align, side, sideOffset]);

    // Position on open and on scroll/resize
    useLayoutEffect(() => {
        if (!open) return;
        reposition();
        window.addEventListener("scroll", reposition, true);
        window.addEventListener("resize", reposition);
        return () => {
            window.removeEventListener("scroll", reposition, true);
            window.removeEventListener("resize", reposition);
        };
    }, [open, reposition]);

    // Close on outside click or Escape
    useEffect(() => {
        if (!open) return;
        function onMouseDown(e: MouseEvent) {
            if (
                contentRef.current &&
                !contentRef.current.contains(e.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setOpen(false);
                triggerRef.current?.focus();
            }
        }
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open, setOpen, triggerRef]);

    if (!open) return null;

    return createPortal(
        <div
            ref={contentRef}
            role="menu"
            className={className}
            style={{
                position: "absolute",
                top: coords?.top ?? -9999,
                left: coords?.left ?? -9999,
                zIndex: 9999,
                minWidth,
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-md)",
                borderRadius: "0.75rem",
                overflow: "hidden",
                ...style,
            }}
        >
            {children}
        </div>,
        document.body
    );
}

interface PopoverItemProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: "default" | "danger";
    className?: string;
}

export function PopoverItem({ children, onClick, variant = "default", className }: PopoverItemProps) {
    const { setOpen } = usePopover();

    function handleClick() {
        onClick?.();
        setOpen(false);
    }

    const dangerStyle: React.CSSProperties =
        variant === "danger"
            ? { color: "var(--color-danger, #c0392b)" }
            : { color: "var(--text-primary)" };

    return (
        <button
            role="menuitem"
            onClick={handleClick}
            className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors ${className ?? ""}`}
            style={dangerStyle}
            onMouseEnter={(e) => {
                e.currentTarget.style.background =
                    variant === "danger"
                        ? "var(--bg-danger-subtle, #fef2f2)"
                        : "var(--bg-subtle)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
            }}
        >
            {children}
        </button>
    );
}

export function PopoverSeparator() {
    return <div style={{ height: "1px", background: "var(--border)", margin: "2px 8px" }} />;
}