import Image from "next/image";

interface LogoProps {
    text?: boolean;
    size?: "sm" | "md" | "lg";
}

const sizeMap = {
    sm: { w: 60, h: 28 },
    md: { w: 80, h: 40 },
    lg: { w: 100, h: 48 },
};

const Logo = ({ text = false, size = "md" }: LogoProps) => {
    const { w, h } = sizeMap[size];

    return (
        <div className="inline-flex items-center gap-2">
            <Image
                src="/logo.png"
                alt="Cashbill logo"
                width={w}
                height={h}
                priority
            />

            {text && (
                <span className="text-primary text-2xl font-medium leading-none">
                    Cashbill
                </span>
            )}
        </div>
    );
};

export default Logo;
