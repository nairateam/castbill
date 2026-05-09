"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";
import AuthForm from "@/components/ui/AuthForm";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) return toast.error("All fields are required.");
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (!res || !res.ok) {
            toast.error("Invalid email or password.");
        } else {
            toast.success("Welcome back!");
            setTimeout(() => router.push("/dashboard"), 1000);
        }
    };

    return (
        <AuthLayout title="Welcome back" subtitle="Sign in to your account">
            <AuthForm
                fields={[
                    { label: "Email", type: "email", value: email, onChange: setEmail, placeholder: "you@example.com" },
                    { label: "Password", type: "password", value: password, onChange: setPassword, placeholder: "••••••••" },
                ]}
                error=""
                loading={loading}
                submitLabel="Sign in"
                onSubmit={handleSubmit}
                footer={<>No account? <Link href="/register" className="text-amber-400 hover:underline">Register</Link></>}
            />
        </AuthLayout>
    );
}