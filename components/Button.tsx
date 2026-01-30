import { FC, ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "full";
    isLoading?: boolean;
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
    isLoading = false,
    size = "md",
    ...props
}) => {
    const base = "inline-flex justify-center gap-2 font-medium rounded-lg hover:shadow-xl transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer";

    return (
        <button
            {...props}
            className={twMerge(
                clsx(base, variantStyles[variant], sizeStyles[size], className)
            )}
        >
            {isLoading && (
                <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
            )}
            <span className={isLoading ? "opacity-70" : "inline-flex gap-3 items-center"}>{children}</span>
        </button>
    );
};

export default Button;
