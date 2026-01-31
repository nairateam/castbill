'use client'

import { hexToRGBA } from "@/lib/utils";
import { ReactNode, useState } from "react";

type StatCardProps = {
    label: string;
    value: string | number;
    icon?: ReactNode;
    helperText?: string;
    color?: string; // dynamic color
};

const StatCard = ({
    label,
    value,
    icon,
    helperText,
    color = "#FFBF00",
}: StatCardProps) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="group relative rounded-xl border border-neutral-50 bg-white p-5 shadow-sm transition-all duration-300"
            style={{
                borderLeftWidth: "5px",
                borderLeftColor: hovered ? color : hexToRGBA(color, 0.1),
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="flex items-start justify-between">
                <div>
                    {icon && (
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 mb-4"
                            style={{ color }}
                        >
                            <span
                                className="rounded-lg p-2 transition-opacity duration-300"
                                style={{ backgroundColor: hexToRGBA(color, 0.1) }}
                            >
                                {icon}
                            </span>
                        </div>

                    )}
                    <p className="text-base text-primary/70">{label}</p>
                    <h3 className="mt-1 text-2xl font-semibold text-neutral-900">{value}</h3>
                </div>
                {helperText && (
                    <p className="rounded-full p-1 px-3 mt-1 text-xs font-semibold"
                        style={{ backgroundColor: hexToRGBA(color, 0.1), color }}
                    >{helperText}</p>
                )}
            </div>
        </div>
    );
};

export default StatCard;
