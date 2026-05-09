export default function AuthLayout({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">

            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <span className="font-display text-2xl text-white">
                        Invoice<span className="text-amber-400">.</span>
                    </span>
                </div>

                {/* Card */}
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
                    <h1 className="font-display text-2xl text-white mb-1">{title}</h1>
                    <p className="text-sm text-zinc-500 mb-7">{subtitle}</p>
                    {children}
                </div>
            </div>
        </div>
    );
}