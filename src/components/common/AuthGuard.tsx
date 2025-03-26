"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "../../../store/userStore";

interface AuthGuardProps {
    children: React.ReactNode;
    allowAuthenticated?: boolean; // 로그인된 사용자 허용 여부 (기본값: true)
}

function AuthGuard({ children, allowAuthenticated = true }: AuthGuardProps) {
    const user = useUserStore((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        if (allowAuthenticated && !user) {
            router.push("/login"); // 로그인되지 않은 사용자 리다이렉트
        } else if (!allowAuthenticated && user) {
            router.push("/"); // 로그인된 사용자 리다이렉트
        }
    }, [user, router, allowAuthenticated]);

    return <>{children}</>;
}

export default AuthGuard;