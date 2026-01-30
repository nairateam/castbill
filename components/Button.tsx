import { FC, ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "full";
};

const variantStyles = {
    primary: "bg-primary shadow text-white hover:bg-shadow-xl",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border border-gray-300 text-gray-900 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
};

const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    full: "w-full px-4 py-2.5"
};

const Button: FC<ButtonProps> = ({
    className,
    children,
    variant = "primary",
    size = "md",
    ...props
}) => {
    const base = "font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer";

    return (
        <button
            {...props}
            className={twMerge(
                clsx(base, variantStyles[variant], sizeStyles[size], className)
            )}
        >
            {children}
        </button>
    );
};

export default Button;
