import { useEffect, useState } from "react";

export type Client = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
};

export function useClients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/clients")
            .then((r) => r.json())
            .then((data) => setClients(data.clients ?? []))
            .finally(() => setLoading(false));
    }, []);

    return { clients, loading };
}