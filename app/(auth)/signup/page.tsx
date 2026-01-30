'use client'

import Button from "@/components/Button";
import Logo from "@/components/Logo";
import InputField from "@/components/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignupPage = () => {
    const router = useRouter();

    const signupSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Password must include letters and numbers"),
    });

    type SignupInput = z.infer<typeof signupSchema>;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupInput) => {
        const { email, password } = data;
        const { data: authData, error } = await supabase.auth.signUp({ email, password });
        if (error) return toast.error(error.message);
        if (!authData.session) {
            toast.success("Check your email to confirm your account");
            return;
        }

        router.push("/dashboard");
    };

    return (
        <div className="flex min-h-screen">
            <div className="hidden flex-1 bg-gray-100 md:flex flex-col justify-center text-left p-10">
                <div className="max-w-5xl mx-auto px-6">
                    <Logo />
                    <h1 className="max-w-xl mt-10 text-3xl lg:text-[3.5rem] text-black font-semibold capitalize">Start managing your invoices <span className="text-primary">smarter</span>.</h1>
                    <p className="mt-4 text-muted text-base  md:text-lg max-w-md">
                        Join 10,000+ businesses automating their billing today. Reduce manual work and get paid 2x faster.
                    </p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center p-5 md:p-10 bg-white">
                <div className="w-full max-w-xl space-y-6 md:px-6">
                    <h2 className="text-2xl text-black font-semibold">Create your account</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <InputField
                            label="Email Address"
                            placeholder="name@company.com"
                            {...register("email")}
                            error={errors.email?.message}
                            fullWidth
                        />

                        <InputField
                            label="Password"
                            placeholder="Min. 8 characters"
                            type="password"
                            helperText="Must include letters + numbers"
                            {...register("password")}
                            error={errors.password?.message}
                            fullWidth
                        />
                        <Button type="submit" isLoading={isSubmitting} size="full">Create Account</Button>
                    </form>
                    <div className="flex items-center gap-2 my-4">
                        <hr className="flex-1 border-t border-gray-300" />
                        <span className="text-gray-500">OR SIGN UP WITH</span>
                        <hr className="flex-1 border-t border-gray-300" />
                    </div>
                    <Button size="full" variant="outline" className="text-base"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg> Signup with Google</Button>

                    <p className="text-sm text-gray-500 text-center">
                        Already have an account? <span className="text-blue-600 underline cursor-pointer">Log in instead</span>
                    </p>
                </div>
            </div>
        </div >
    );
};

export default SignupPage;
