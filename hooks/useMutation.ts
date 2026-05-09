"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MutationOptions<TVariables> {
    mutationFn: (variables: TVariables) => Promise<Response>;
    onSuccess?: (variables: TVariables) => void;
    onError?: (variables: TVariables) => void;
    redirectTo?: string;
    successMessage?: string;
    errorMessage?: string;
}

export function useMutation<TVariables = void>({
    mutationFn,
    onSuccess,
    onError,
    redirectTo,
    successMessage,
    errorMessage,
}: MutationOptions<TVariables>) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const mutate = async (variables: TVariables) => {
        setIsLoading(true);
        try {
            const res = await mutationFn(variables);
            if (!res.ok) throw new Error();
            if (successMessage) toast.success(successMessage);
            onSuccess?.(variables);
            if (redirectTo) router.push(redirectTo);
            else router.refresh();
        } catch {
            if (errorMessage) toast.error(errorMessage);
            onError?.(variables);
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, isLoading };
}