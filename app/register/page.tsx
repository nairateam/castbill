"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";
import { signIn } from "next-auth/react";
import AuthForm from "@/components/ui/AuthForm";
import { toast } from "sonner";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) return toast.error("Email and password are required.");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");

            await signIn("credentials", { email, password, redirect: false });
            toast.success("Account created! Welcome aboard.");
            setTimeout(() => router.push("/dashboard"), 1000);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create account" subtitle="Start managing your invoices">
            <AuthForm
                fields={[
                    { label: "Email", type: "email", value: email, onChange: setEmail, placeholder: "you@example.com" },
                    { label: "Username", type: "text", value: username, onChange: setUsername, placeholder: "optional" },
                    { label: "Password", type: "password", value: password, onChange: setPassword, placeholder: "••••••••" },
                ]}
                loading={loading}
                submitLabel="Create account"
                onSubmit={handleSubmit}
                footer={<>Already have an account? <Link href="/login" style={{ color: "var(--accent)" }} className="hover:underline">Sign in</Link></>}
            />
        </AuthLayout>
    );
}