'use client';

import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gray-50 px-4 overflow-hidden">

            {/* Background 404 */}
            <span className="absolute text-[30rem] font-bold text-gray-200/40 select-none leading-none">
                404
            </span>

            {/* Content Card */}
            <div className="relative z-10 max-w-md text-center">

                {/* Icon */}
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                    <SearchX className="h-7 w-7 text-blue-600" />
                </div>

                {/* Error Code */}
                <p className="text-xs font-semibold tracking-widest text-blue-600">
                    ERROR CODE: 404
                </p>

                {/* Title */}
                <h1 className="mt-3 text-3xl font-bold text-gray-900">
                    Page not found
                </h1>

                {/* Description */}
                <p className="mt-3 text-sm text-gray-500">
                    Sorry, we couldn’t find the page you’re looking for.
                    It might have been moved, deleted, or never existed.
                </p>

                {/* Actions */}
                <div className="mt-8 flex items-center justify-center gap-4">
                    <Link
                        href="/dashboard"
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
                    >
                        Back to Dashboard
                    </Link>

                    <Link
                        href="/support"
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                    >
                        Contact Support
                    </Link>
                </div>

                {/* Help text */}
                <p className="mt-8 text-xs text-gray-400">
                    Need help finding something?{" "}
                    <Link href="/help" className="text-blue-600 hover:underline">
                        Search our help center
                    </Link>
                </p>
            </div>
        </div>
    );
}
