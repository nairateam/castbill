'use client';

import Button from "@/components/Button";
import Logo from "@/components/Logo";
import InputField from "@/components/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    remember: z.boolean().optional(),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (formData: LoginInput) => {
        const { email, password } = formData;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            return;
        }

        router.push("/dashboard");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">

            <div className="max-w-3xl flex flex-col justify-center items-center mx-auto space-y-3 px-6">
                <Logo />
                <form onSubmit={handleSubmit(onSubmit)} className="lg:w-120 space-y-4 rounded-lg shadow-xl p-10 bg-white">
                    <div className="space-y-4 pb-5">
                        <h1 className="text-3xl text-center font-semibold text-black">
                            Welcome back
                        </h1>
                        <p className="mt-4 text-center text-gray-600">
                            Log in to manage your invoices and track payments.
                        </p>
                    </div>
                    <InputField
                        label="Email Address"
                        placeholder="name@company.com"
                        {...register("email")}
                        error={errors.email?.message}
                        fullWidth
                    />

                    <InputField
                        label="Password"
                        type="password"
                        placeholder="Your password"
                        {...register("password")}
                        error={errors.password?.message}
                        fullWidth
                    />

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="remember"
                            {...register("remember")}
                            className="w-4 h-4 rounded border-gray-300"
                        />
                        <label htmlFor="remember" className="text-sm text-gray-700">
                            Keep me logged in
                        </label>
                    </div>

                    <Button size="full" isLoading={isSubmitting} disabled={isSubmitting}>
                        Sign In
                    </Button>

                    <hr className="my-5" />

                    <p className="text-sm text-gray-500 text-center pt-3">
                        Don’t have an account?{" "}
                        <span
                            className="text-blue-600 underline cursor-pointer"
                            onClick={() => router.push("/signup")}
                        >
                            Sign up
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
