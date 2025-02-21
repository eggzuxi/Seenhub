import { useEffect, useState } from "react";

export default function useAuth() {
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/user");
                const data = await res.json();
                if (data.authenticated) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Authentication check failed", error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return { user, loading };
}
